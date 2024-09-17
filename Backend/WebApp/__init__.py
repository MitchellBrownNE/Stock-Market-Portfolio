from flask import Flask, send_from_directory

app = Flask(__name__, static_url_path='', static_folder='../Frontend/profitpulsex/dist')

from WebApp import routes

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')