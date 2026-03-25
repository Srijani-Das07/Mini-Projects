const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const actions = document.getElementById('actions');
const mergeBtn = document.getElementById('mergeBtn');
const clearBtn = document.getElementById('clearBtn');
const status = document.getElementById('status');

let files = [];
let dragSrcIndex = null;

// Format file size
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Render file list
function renderFiles() {
  fileList.innerHTML = '';
  files.forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.draggable = true;
    item.dataset.index = index;
    item.innerHTML = `
      <div class="file-left">
        <span class="file-emoji">📄</span>
        <div class="file-info">
          <div class="file-name">${file.name}</div>
          <div class="file-size">${formatSize(file.size)}</div>
        </div>
      </div>
      <button class="remove-btn" data-index="${index}">✕ Remove</button>
    `;

    // Drag to reorder
    item.addEventListener('dragstart', () => {
      dragSrcIndex = index;
      setTimeout(() => item.classList.add('dragging'), 0);
    });
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      item.classList.add('drag-over');
    });
    item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.classList.remove('drag-over');
      if (dragSrcIndex !== null && dragSrcIndex !== index) {
        const moved = files.splice(dragSrcIndex, 1)[0];
        files.splice(index, 0, moved);
        renderFiles();
      }
    });

    // Remove button
    item.querySelector('.remove-btn').addEventListener('click', () => {
      files.splice(index, 1);
      renderFiles();
      toggleActions();
      setStatus('');
    });

    fileList.appendChild(item);
  });
}

function toggleActions() {
  actions.style.display = files.length > 1 ? 'flex' : 'none';
}

function setStatus(msg, type = '') {
  status.textContent = msg;
  status.className = 'status ' + type;
}

// Add files (filter duplicates)
function addFiles(newFiles) {
  const existing = files.map(f => f.name);
  let added = 0;
  Array.from(newFiles).forEach(f => {
    if (f.type === 'application/pdf' && !existing.includes(f.name)) {
      files.push(f);
      added++;
    }
  });
  if (added === 0) {
    setStatus('No new PDF files added (duplicates or wrong format).', 'error');
  } else {
    setStatus('');
  }
  renderFiles();
  toggleActions();
}

// File input
fileInput.addEventListener('change', (e) => addFiles(e.target.files));

// Drag & drop on upload zone
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  addFiles(e.dataTransfer.files);
});

// Click to browse
dropZone.addEventListener('click', (e) => {
  if (!e.target.classList.contains('browse-btn')) fileInput.click();
});

// Clear all
clearBtn.addEventListener('click', () => {
  files = [];
  renderFiles();
  toggleActions();
  setStatus('');
  fileInput.value = '';
});

// Merge
mergeBtn.addEventListener('click', async () => {
  if (files.length < 2) return;
  mergeBtn.disabled = true;
  setStatus('⏳ Merging PDFs...', 'loading');

  try {
    const { PDFDocument } = PDFLib;
    const merged = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => merged.addPage(page));
    }

    const mergedBytes = await merged.save();
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
    URL.revokeObjectURL(url);

    setStatus('✅ PDFs merged and downloaded successfully!', 'success');
  } catch (err) {
    setStatus('❌ Something went wrong. Make sure all files are valid PDFs.', 'error');
    console.error(err);
  } finally {
    mergeBtn.disabled = false;
  }
});