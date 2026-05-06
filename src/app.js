const dropOverlay = document.getElementById('drop-overlay');
const editor = document.getElementById('editor');
const createBtn = document.getElementById('create-from-scratch');
const leftContent = document.getElementById('left-content');
const leftTabs = document.getElementById('left-tabs');
const fileList = document.getElementById('file-list');

let zip = null;

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

function renderFileList(files) {
  fileList.innerHTML = '';
  for (const path of files) {
    const li = document.createElement('li');
    li.textContent = path;
    fileList.appendChild(li);
  }
}

async function handleZipFile(file) {
  zip = await JSZip.loadAsync(file);
  const files = Object.keys(zip.files).filter((path) => !zip.files[path].dir).sort();
  renderFileList(files);
  openEditor();
  switchTab('tab-files');
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
});
