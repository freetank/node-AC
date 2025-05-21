from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.generate_layout import generate_layout

app = Flask(__name__)
CORS(app)

@app.route('/generate-layout', methods=['POST'])
def generate_layout_endpoint():
    return generate_layout()

if __name__ == '__main__':
    app.run(host='localhost', port=9500)