const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const processingState = document.getElementById('processing-state');
const resultsArea = document.getElementById('results-area');
const imageGrid = document.getElementById('image-grid');
const downloadAllBtn = document.getElementById('download-all-btn');

let processedFilesList = [];

// Drag & Drop handlers
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    if (files.length === 0) return;

    if (files.length > 12) {
        alert("Please select a maximum of 12 images.");
        return;
    }

    uploadFiles(files);
}

function uploadFiles(files) {
    // Show processing state
    dropZone.classList.add('hidden');
    resultsArea.classList.add('hidden');
    processingState.classList.remove('hidden');
    imageGrid.innerHTML = ''; // Clear previous results
    processedFilesList = [];

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
    }

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error: ' + data.error);
                resetUI();
                return;
            }

            displayResults(data.files);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during upload.');
            resetUI();
        });
}

function displayResults(files) {
    processingState.classList.add('hidden');
    resultsArea.classList.remove('hidden');
    dropZone.classList.remove('hidden'); // allow more uploads

    files.forEach(file => {
        processedFilesList.push(file.processed);

        const card = document.createElement('div');
        card.className = 'image-card';
        card.innerHTML = `
            <div class="img-preview">
                <img src="${file.processed_url}" alt="Processed Image">
            </div>
            <div class="card-actions">
                <span class="filename" title="${file.original}">${file.original}</span>
                <a href="${file.processed_url}" class="download-icon" download>
                    <i class="fa-solid fa-download"></i>
                </a>
            </div>
        `;
        imageGrid.appendChild(card);
    });
}

function resetUI() {
    processingState.classList.add('hidden');
    resultsArea.classList.add('hidden');
    dropZone.classList.remove('hidden');
}

downloadAllBtn.addEventListener('click', () => {
    if (processedFilesList.length === 0) return;

    fetch('/download_all', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filenames: processedFilesList })
    })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'processed_images.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        })
        .catch(err => console.error("Error downloading zip:", err));
});
