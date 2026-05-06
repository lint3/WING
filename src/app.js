const dropOverlay = document.getElementById('drop-overlay');
const editor = document.getElementById('editor');
const createBtn = document.getElementById('create-from-scratch');

function openEditor() {
  dropOverlay.style.display = 'none';
  editor.hidden = false;
}

dropOverlay.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropOverlay.classList.add('drag-over');
});

dropOverlay.addEventListener('dragleave', () => {
  dropOverlay.classList.remove('drag-over');
});

dropOverlay.addEventListener('drop', (e) => {
  e.preventDefault();
  openEditor();
});

createBtn.addEventListener('click', () => {
  openEditor();
});
