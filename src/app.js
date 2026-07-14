import { addFile, updateFile, getRaw, getParsed, getAllPaths } from './state.js';
import { parseDocument } from './parser.js';
import { renderPage } from './renderer.js';

const dropOverlay = document.getElementById('drop-overlay');
const editor = document.getElementById('editor');
const createBtn = document.getElementById('create-from-scratch');
const leftContent = document.getElementById('left-content');
const leftTabs = document.getElementById('left-tabs');
const fileList = document.getElementById('file-list');
const editorFilename = document.getElementById('editor-filename');
const editorTextarea = document.getElementById('editor-textarea');
const previewPane = document.getElementById('preview-pane');
const previewFilmstrip = document.getElementById('preview-filmstrip');

let currentFile = null;
let renderTimer = null;
const RENDER_DELAY = 300;

function openEditor() {
  dropOverlay.style.display = 'none';
  editor.hidden = false;
}

function switchTab(tabId) {
  leftContent.querySelectorAll(':scope > div').forEach((p) => {
    p.classList.toggle('active', p.id === tabId);
  });
  leftTabs.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });
}

function renderFileList() {
  fileList.innerHTML = '';
  for (const path of getAllPaths().sort()) {
    const li = document.createElement('li');
    li.textContent = path;
    li.dataset.path = path;
    if (path === currentFile) li.classList.add('selected');
    fileList.appendChild(li);
  }
}

function openFile(path) {
  currentFile = path;
  editorFilename.textContent = path;
  editorTextarea.value = getRaw(path);
  renderFileList();
}

function renderDocument() {
  const result = parseDocument({
    getParsed: (p) => getParsed(p),
    getAllPaths: () => getAllPaths(),
  });

  previewFilmstrip.innerHTML = '';

  if (!result.resolvedPages || result.resolvedPages.length === 0) return;

  for (const page of result.resolvedPages) {
    const wrapper = document.createElement('div');
    wrapper.className = 'filmstrip-page';

    const label = document.createElement('div');
    label.className = 'filmstrip-page-label';
    label.textContent = page.pageId;
    wrapper.appendChild(label);

    const svg = renderPage(page);
    wrapper.appendChild(svg);

    previewFilmstrip.appendChild(wrapper);
  }
}

editorTextarea.addEventListener('input', () => {
  if (currentFile) {
    updateFile(currentFile, editorTextarea.value);
    scheduleRender();
  }
});

function scheduleRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(renderDocument, RENDER_DELAY);
}

fileList.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (li) openFile(li.dataset.path);
});

async function handleZipFile(file) {
  const jszip = await JSZip.loadAsync(file);
  const entries = Object.keys(jszip.files).filter((p) => !jszip.files[p].dir).sort();

  for (const path of entries) {
    const content = await jszip.files[path].async('string');
    addFile(path, content);
  }

  renderFileList();
  openEditor();
  switchTab('tab-files');
  renderDocument();
}

async function loadTestData() {
  const paths = [
    'document_template.json',
    'document_data.json',
  ];
  const sources = [
    'tests/examples/basic_elements.template.json',
    'tests/examples/basic_elements.data.json',
  ];

  for (let i = 0; i < paths.length; i++) {
    const resp = await fetch(sources[i]);
    const text = await resp.text();
    addFile(paths[i], text);
  }

  renderFileList();
  openEditor();
  switchTab('tab-files');
  renderDocument();
}

leftTabs.addEventListener('click', (e) => {
  if (e.target.dataset.tab) {
    switchTab(e.target.dataset.tab);
  }
});

switchTab('tab-tree');

dropOverlay.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropOverlay.classList.add('drag-over');
});

dropOverlay.addEventListener('dragleave', () => {
  dropOverlay.classList.remove('drag-over');
});

dropOverlay.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.name.endsWith('.zip')) {
    handleZipFile(file);
  }
});

createBtn.addEventListener('click', () => {
  openEditor();
  loadTestData();
});
