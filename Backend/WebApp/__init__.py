from flask import Flask, send_from_directory


app = Flask(__name__, static_folder='../Frontend/stockmarket/build', static_url_path='')

from WebApp import routes

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')