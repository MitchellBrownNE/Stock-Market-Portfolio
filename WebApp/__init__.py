from flask import Flask
from PredictionModel import stock_api as API

app = Flask(__name__)

from WebApp import routes