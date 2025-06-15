from flask import Flask, request, jsonify
import utils

app = Flask(__name__)

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        'locations': utils.get_location_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    data = request.get_json() 
    location = data['location']
    sqft = data['sqft']
    bhk = data['bhk']
    bath = data['bath']
    
    estimated_price = utils.get_estimated_price(location, sqft, bhk, bath)
    
    response = jsonify({
        'estimated_price': estimated_price
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    # Start the Flask application
    print("Starting server...")
    utils.load_saved_artifacts()
    print("Server started successfully.")
    app.run()