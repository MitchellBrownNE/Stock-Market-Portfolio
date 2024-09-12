from WebApp import app
from flask import render_template
from PredictionModel import stock_api as API

#Route any of the webpages here, example page set in templates
@app.route('/')
def index():

    data = API.DownloadData()

    return render_template('index.html', data=data)