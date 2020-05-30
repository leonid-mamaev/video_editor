import json
import logging
import os
from flask import Flask, jsonify, request, url_for, render_template
from flask_cors import CORS
from src.editor import Editor
from src.storage_local import StorageLocal, FileNotFound
from werkzeug.utils import secure_filename


media_storage = StorageLocal()
tmp_storage = StorageLocal('tmp')
editor = Editor()
app = Flask(__name__, static_folder=str(media_storage.directory))
app.config['UPLOAD_FOLDER'] = str(media_storage.directory)
CORS(app)

if os.getenv('DEBUG', 'no') == 'yes':
    logging.basicConfig(level=logging.DEBUG)
    app.debug = True


@app.route('/')
def index():
    video_files = media_storage.list()
    videos = [item.name for item in video_files]
    return render_template('index.html', videos=videos)


@app.route('/api/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file provided', 400
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return 'success', 200


@app.route('/play')
def play():
    file_name = request.args.get('file_name')
    file = media_storage.get_file(file_name)
    return f"""
<h1>{file.name}</h1>
<video autoplay width="640" height="480" controls>
<source src="{url_for('static', filename=file.name)}" type="video/mp4">
</video>
"""


@app.route('/api/list', methods=['GET'])
def list_files():
    video_files = media_storage.list()
    return jsonify([item.name for item in video_files])


@app.route('/api/rename', methods=['POST'])
def rename_file():
    media_storage.rename(request.json['name'], request.json['new_name'])
    return 'Done', 200


@app.route('/api/extract_audio', methods=['POST'])
def extract_audio_from_video():
    editor.extract_audio_from_video(
        source=media_storage.get_file_path(request.json['source_file_name']),
        destination=media_storage.generate_file_path(request.json['destination_file_name']),
        start=request.json['start'],
        end=request.json['end'],
    )
    return 'Done', 200


@app.route('/api/slice_video', methods=['POST'])
def slice_video():
    start = request.json['start'] if request.json['start'] else None
    end = request.json['end'] if request.json['end'] else None
    editor.slice_video(
        source=media_storage.get_file_path(request.json['source_file_name']),
        destination=media_storage.generate_file_path(request.json['destination_file_name']),
        start=start,
        end=end
    )
    return 'Done', 200


@app.route('/api/cut_audio', methods=['POST'])
def cut_audio():
    editor.slice_audio(
        source=media_storage.get_file_path(request.json['source_file_name']),
        destination=media_storage.generate_file_path(request.json['destination_file_name']),
        start=request.json['start'],
        end=request.json['end']
    )
    return 'Done', 200


@app.route('/api/crop_video', methods=['POST'])
def crop_video():
    editor.crop_video(
        source=media_storage.get_file_path(request.json['source_file_name']),
        destination=media_storage.generate_file_path(request.json['destination_file_name']),
        x1=request.json['x1'],
        x2=request.json['x2'],
        y1=request.json['y1'],
        y2=request.json['y2']
    )
    return 'Done', 200


@app.route('/api/apply_audio', methods=['POST'])
def apply_audio():
    editor.apply_audio(
        video_path=media_storage.get_file_path(request.json['video']),
        audio_path=media_storage.get_file_path(request.json['audio']),
        destination=media_storage.generate_file_path(request.json['destination'])
    )
    return 'Done', 200


@app.route('/api/join_videos', methods=['POST'])
def join_videos():
    editor.join_videos(
        video_1=media_storage.get_file_path(request.json['video_1']),
        video_2=media_storage.get_file_path(request.json['video_2']),
        destination=media_storage.generate_file_path(request.json['destination'])
    )
    return 'Done', 200


@app.route('/api/join_audios', methods=['POST'])
def join_audios():
    editor.join_audios(
        audio_1=media_storage.get_file_path(request.json['audio_1']),
        audio_2=media_storage.get_file_path(request.json['audio_2']),
        destination=media_storage.generate_file_path(request.json['destination'])
    )
    return 'Done', 200


@app.route('/api/remove', methods=['POST'])
def remove_files():
    media_storage.remove_files(
        names=request.json['names']
    )
    return 'Done', 200


@app.route('/api/get_audio_wave_form', methods=['GET'])
def get_audio_wave_form():
    name = request.args.get('name')
    if not name:
        return 'Missing name', 400
    wav_path = tmp_storage.generate_file_path(f'{name}.wav')
    try:
        tmp_storage.get_file_path(f'{name}.wav')
    except FileNotFound:
        file_path = media_storage.get_file_path(name)
        editor.convert_audio_to_wave(file_path, wav_path)
    signal, time = editor.get_wave_form_signal(wav_path, points=300)
    result = []
    for i in range(300):
        result.append({'signal': signal[i], 'time': time[i]})
    return json.dumps(result), 200


@app.route('/api/get_video_wave_form', methods=['GET'])
def get_video_wave_form():
    name = request.args.get('name')
    if not name:
        return 'Missing name', 400
    wav_path = tmp_storage.generate_file_path(f'{name}.mp3.wav')
    try:
        tmp_storage.get_file_path(f'{name}.mp3.wav')
    except FileNotFound:
        video_path = media_storage.get_file_path(name)
        mp3_path = tmp_storage.generate_file_path(f'{name}.mp3')
        editor.extract_audio_from_video(video_path, mp3_path)
        editor.convert_audio_to_wave(mp3_path, wav_path)
    signal, time = editor.get_wave_form_signal(wav_path, points=300)
    result = []
    for i in range(300):
        result.append({'signal': signal[i], 'time': time[i]})
    return json.dumps(result), 200


if __name__ == '__main__':
    PORT = os.getenv('PORT', '8000')
    app.run(host='0.0.0.0', port=PORT)
