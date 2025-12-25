# Offline Batch Background Remover

This is a Flask-based web application that allows users to remove backgrounds from images in batch. It uses the `rembg` library to process images offline and provides a simple interface for uploading, processing, and downloading images.

## Features

- **Batch Processing:** Upload and process multiple images at once (designed for 10-12 images).
- **Offline Capability:** All processing is done locally on your machine using `rembg`.
- **Background Removal:** clean background removal for various image types.
- **Download Options:** Download processed images individually or as a single ZIP file.
- **Easy to Use:** Simple and intuitive web interface.

## Prerequisites

- Python 3.8 or higher recommended.
- Git (optional, for cloning the repository).

## Installation

1.  **Clone the repository (or download the source code):**
    ```bash
    git clone <repository-url>
    cd Bg_remove
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

    *Note: `onnxruntime` is used by `rembg`. If you have a compatible GPU, you might want to install `onnxruntime-gpu` for faster processing, though the default `requirements.txt` includes the CPU version which works fine for general use.*

## Usage

1.  **Start the application:**
    ```bash
    python app.py
    ```

2.  **Access the web interface:**
    Open your web browser and go to `http://127.0.0.1:5000` or `http://localhost:5000`.

3.  **Remove Backgrounds:**
    - Click on the "Upload" button or drag and drop your images.
    - Wait for the processing to complete.
    - Preview the results.
    - Click "Download" to get individual images or "Download All" to get a ZIP file.

## Project Structure

- `app.py`: The main Flask application file handling routes and logic.
- `requirements.txt`: List of Python dependencies.
- `templates/`: Contains HTML templates for the web interface.
- `static/`: Contains static files (CSS, JS, images).
- `uploads/`: Temporary folder for uploaded images.
- `processed/`: Temporary folder for processed images.

## technical Details

- **Backend:** Flask (Python)
- **Image Processing:** `rembg` (powered by U-2-Net), `Pillow`
- **Frontend:** HTML, CSS, JavaScript (assumed standard web tech)

## License

[MIT](https://choosealicense.com/licenses/mit/)
