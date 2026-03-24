let filesArray = [];

const input = document.getElementById("pdfFiles");
const fileList = document.getElementById("fileList");
const dropZone = document.getElementById("dropZone");

input.addEventListener("change", (e) => {
    addFiles(e.target.files);
});

dropZone.addEventListener("click", () => input.click());

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
});

function addFiles(files) {
    for (let file of files) {
        if (file.type === "application/pdf") {
            filesArray.push(file);
        }
    }
    renderList();
}

function renderList() {
    fileList.innerHTML = "";

    filesArray.forEach((file, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${file.name}
            <div>
                <button onclick="moveUp(${index})">↑</button>
                <button onclick="moveDown(${index})">↓</button>
                <button onclick="removeFile(${index})">❌</button>
            </div>
        `;

        fileList.appendChild(li);
    });
}

function moveUp(index) {
    if (index === 0) return;
    [filesArray[index], filesArray[index - 1]] = [filesArray[index - 1], filesArray[index]];
    renderList();
}

function moveDown(index) {
    if (index === filesArray.length - 1) return;
    [filesArray[index], filesArray[index + 1]] = [filesArray[index + 1], filesArray[index]];
    renderList();
}

function removeFile(index) {
    filesArray.splice(index, 1);
    renderList();
}

async function mergePDFs() {
    const { PDFDocument } = PDFLib;
    const status = document.getElementById("status");

    if (filesArray.length < 2) {
        status.innerText = "Select at least 2 PDFs";
        return;
    }

    status.innerText = "Merging...";

    const mergedPdf = await PDFDocument.create();

    for (let file of filesArray) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(p => mergedPdf.addPage(p));
    }

    const mergedBytes = await mergedPdf.save();

    const blob = new Blob([mergedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();

    status.innerText = "Download started!";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}