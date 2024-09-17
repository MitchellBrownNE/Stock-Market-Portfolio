from flask import Flask, send_from_directory, jsonify
import os

# Adjust the path to the static folder based on the main directory on Render
static_folder_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../Frontend/profitpulsex/dist'))
print(f"Static folder path: {static_folder_path}")
if not os.path.exists(static_folder_path):
    print("The static folder path does not exist.")
else:
    print("The static folder path exists.")

# Print the contents of the /app directory for debugging
app_folder_contents = os.listdir('/app/frontend')
print("App directory contents:")
for item in app_folder_contents:
    print(item)

# Print the contents of the root directory for debugging
root_contents = os.listdir('/root/')
print("Root directory contents:")
for item in root_contents:
    print(item)

# Print the contents of the static folder for debugging
static_folder_contents = os.listdir(static_folder_path)
print("Static folder contents:")
for item in static_folder_contents:
    print(item)

# Initialize the Flask application
app = Flask(__name__, static_url_path='', static_folder=static_folder_path)

# Serve the React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Ignore favicon requests by returning a 204 No Content response
@app.route('/favicon.ico')
def ignore_favicon():
    return '', 204  # 204 No Content

# Handle 404 errors by serving the React app's index.html
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)