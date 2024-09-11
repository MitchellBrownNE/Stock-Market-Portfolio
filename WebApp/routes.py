from WebApp import app
from flask import render_template

#Route any of the webpages here, example page set in templates
@app.route('/')
def index():
    return render_template("index.html")