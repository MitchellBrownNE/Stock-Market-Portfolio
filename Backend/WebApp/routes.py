from WebApp import app
from flask import send_from_directory, jsonify
import os
from PredictionModel import stock_api as API

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Example API route
@app.route('/api/data')
def get_data():
    data = API.DownloadData()
    return jsonify(data)