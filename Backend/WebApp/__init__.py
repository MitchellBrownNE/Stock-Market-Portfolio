import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder=os.path.join(os.getcwd(), 'Frontend\profitpulsex', 'dist'), static_url_path='')

from WebApp import routes

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')