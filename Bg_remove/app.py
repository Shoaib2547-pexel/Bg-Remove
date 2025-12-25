import os
from flask import Flask, render_template, request, send_file, jsonify
from rembg import remove
from PIL import Image
import io
import zipfile
import time

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'files[]' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    files = request.files.getlist('files[]')
    
    processed_files = []
    
    for file in files:
        if file.filename == '':
            continue
            
        if file:
            filename = file.filename
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Process image
            try:
                # Open image using PIL to ensure format handling
                with open(file_path, 'rb') as i:
                    input_data = i.read()
                
                # Use rembg
                # rembg.remove returns bytes if input is bytes
                # To ensure we aren't losing quality, we can just save the result directly as PNG
                # PNG is lossless, so as long as rembg doesn't downscale, we are good.
                # However, let's explicitely use PIL to check if we want to add any other checks
                
                subject = remove(input_data)
                
                # Save processed image
                output_filename = 'no_bg_' + os.path.splitext(filename)[0] + '.png'
                output_path = os.path.join(app.config['PROCESSED_FOLDER'], output_filename)
                
                with open(output_path, 'wb') as o:
                    o.write(subject)
                
                processed_files.append({
                    'original': filename,
                    'processed': output_filename,
                    'processed_url': f'/download/{output_filename}'
                })
            except Exception as e:
                print(f"Error processing {filename}: {e}")
                return jsonify({'error': str(e)}), 500

    return jsonify({'files': processed_files})

@app.route('/download/<filename>')
def download_file(filename):
    return send_file(os.path.join(app.config['PROCESSED_FOLDER'], filename), as_attachment=True)

@app.route('/download_all', methods=['POST'])
def download_all():
    json_data = request.json
    filenames = json_data.get('filenames', [])
    
    if not filenames:
        return jsonify({'error': 'No files to download'}), 400

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
        for filename in filenames:
            file_path = os.path.join(app.config['PROCESSED_FOLDER'], filename)
            if os.path.exists(file_path):
                zip_file.write(file_path, filename)
    
    zip_buffer.seek(0)
    
    return send_file(
        zip_buffer,
        mimetype='application/zip',
        as_attachment=True,
        download_name='processed_images.zip'
    )

if __name__ == '__main__':
    app.run(debug=True, port=5000)
