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
const treeContainer = document.getElementById('tree-container');

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
  console.log('openFile:', path);
  currentFile = path;
  editorFilename.textContent = path;
  editorTextarea.value = getRaw(path);
  renderFileList();
}

function renderTree(parseResult) {
  const { nodeMap, resolvedPages } = parseResult;

  const templates = Object.values(nodeMap).filter((n) => n.type === 'template');
  const pages = Object.values(nodeMap).filter((n) => n.type === 'page');

  const root = document.createElement('div');

  const tHeader = elTreeRow('Templates (' + templates.length + ')', 'section');
  root.appendChild(tHeader);
  for (const t of templates) {
    const row = elTreeRow(t.id, 'template', t.parent, null);
    root.appendChild(row);
    const sub = elTreeSub();
    sub.appendChild(elTreeRow('elements: ' + Object.keys(t.data.elements || {}).join(', '), 'prop'));
    const slots = t.data.slots || {};
    const slotKeys = Object.keys(slots);
    if (slotKeys.length) {
      sub.appendChild(elTreeRow('slots: ' + slotKeys.join(', '), 'prop'));
    }
    for (const child of row.querySelectorAll('.tree-children')[0]?.children || []) {
      sub.appendChild(child.cloneNode(true));
    }
    row.querySelector('.tree-children').appendChild(sub);
  }

  const pHeader = elTreeRow('Pages (' + pages.length + ')', 'section');
  root.appendChild(pHeader);
  for (const p of pages) {
    const resolved = resolvedPages.find((r) => r.pageId === p.id);
    const chainStr = resolved ? resolved.chain.map((c) => c.id).join(' → ') : '';
    const row = elTreeRow(p.id, 'page', p.parent, null);
    root.appendChild(row);
    const sub = elTreeSub();
    if (chainStr) sub.appendChild(elTreeRow('chain: ' + chainStr, 'prop'));
    if (resolved) {
      sub.appendChild(elTreeRow('properties: ' + Object.keys(resolved.properties).join(', '), 'prop'));
      sub.appendChild(elTreeRow('elements: ' + Object.keys(resolved.elements).join(', '), 'prop'));
      const slotFills = p.data.slots || {};
      const fillKeys = Object.keys(slotFills);
      if (fillKeys.length) {
        for (const k of fillKeys) {
          sub.appendChild(elTreeRow(`slot "${k}" = "${slotFills[k]}"`, 'prop'));
        }
      }
      const extras = p.data.extra_elements || {};
      const extraKeys = Object.keys(extras);
      if (extraKeys.length) {
        sub.appendChild(elTreeRow('extra elements: ' + extraKeys.join(', '), 'prop'));
      }
    }
    row.querySelector('.tree-children').appendChild(sub);
  }

  treeContainer.innerHTML = '';
  treeContainer.appendChild(root);
}

function elTreeRow(label, kind, parent, count) {
  const row = document.createElement('div');
  row.className = 'tree-row';

  const toggle = document.createElement('span');
  toggle.className = 'tree-toggle';

  const text = document.createElement('span');
  text.className = 'tree-label';
  text.textContent = label;

  const badge = document.createElement('span');
  badge.className = 'tree-badge ' + (kind || '');
  if (kind === 'section') {
    badge.textContent = '';
  } else if (kind) {
    badge.textContent = kind || '';
    if (count != null) badge.textContent += ' (' + count + ')';
  }

  row.appendChild(toggle);
  row.appendChild(badge);
  row.appendChild(text);

  if (parent) {
    const pSpan = document.createElement('span');
    pSpan.className = 'tree-parent';
    pSpan.textContent = '← ' + parent;
    row.appendChild(pSpan);
  }

  const children = document.createElement('div');
  children.className = 'tree-children';
  children.style.display = 'none';
  row.appendChild(children);

  toggle.addEventListener('click', () => {
    const expanded = children.style.display !== 'none';
    children.style.display = expanded ? 'none' : 'block';
    toggle.textContent = expanded ? '▸' : '▾';
    toggle.classList.toggle('expanded', !expanded);
  });

  if (kind === 'section') {
    children.style.display = 'block';
    toggle.textContent = '▾';
    toggle.classList.add('expanded');
    row.classList.add('tree-section');
  } else if (kind === 'prop') {
    toggle.textContent = '';
    toggle.style.visibility = 'hidden';
  } else {
    toggle.textContent = '▸';
  }

  return row;
}

function elTreeSub() {
  const div = document.createElement('div');
  div.className = 'tree-sub';
  return div;
}

function renderDocument() {
  console.group('renderDocument');
  const result = parseDocument({
    getParsed: (p) => getParsed(p),
    getAllPaths: () => getAllPaths(),
  });

  renderTree(result);
  previewFilmstrip.innerHTML = '';

  if (!result.resolvedPages || result.resolvedPages.length === 0) {
    console.log('no pages to render');
    console.groupEnd();
    return;
  }

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
  console.groupEnd();
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
  console.log('handleZipFile:', file.name, '(' + (file.size / 1024).toFixed(1) + ' KB)');
  const jszip = await JSZip.loadAsync(file);
  const entries = Object.keys(jszip.files).filter((p) => !jszip.files[p].dir).sort();
  console.log('  entries:', entries.length, entries);

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
  console.log('loadTestData: fetching test files...');
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
    console.log('  loaded', paths[i], 'from', sources[i], '(' + text.length + ' bytes)');
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
