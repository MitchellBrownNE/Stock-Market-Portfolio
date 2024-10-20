import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow logs
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import sys
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../Backend')))
from PredictionModel import predict_model

# Adjust the path to the static folder based on the main directory on Render
static_folder_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../Frontend/profitpulsex/dist'))

# Initialize the Flask application
app = Flask(__name__, static_url_path='', static_folder=static_folder_path)
CORS(app)

# Serve the React app by setting the proper default path and returning the proper directory that is required by
# the React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Ignore favicon requests by returning a 204 No Content response as it causes issues within webhosting
@app.route('/favicon.ico')
def ignore_favicon():
    return '', 204  # 204 No Content

# Handle 404 errors by serving the React app's index.html and returning the index.html file that routes it to the root
# within React
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/predict', methods = ['GET'])
def predict():
    symbol = request.args.get('symbol')
    prediction_model = predict_model.PredictionModel(symbol)
    prediction_model.build_train_predict_model()
    preds_json = prediction_model.prediction_to_json()
    preds = json.loads(preds_json)

    
    return jsonify({
        "symbol": symbol,
        "predicted_price": preds[symbol]["lstm_predictions"]
    })

if __name__ == "__main__":
    app.run(debug=True)