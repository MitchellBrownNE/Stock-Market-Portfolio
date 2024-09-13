import os
from flask import Flask, send_from_directory

# Get the absolute path to the React build folder
app = Flask(__name__, static_folder=os.path.join(os.getcwd(), 'Frontend', 'build'), static_url_path='')

print(f"Static folder: {app.static_folder}")  # For debugging

from WebApp import routes

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')