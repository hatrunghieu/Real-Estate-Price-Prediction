import json
import pickle

__locations = None
__data_columns = None
__model = None

def get_estimated_price(location, sqft, bhk, bath):
    try:
        loc_index = __data_columns.index(location.lower())
    except ValueError:
        loc_index = -1

    x = [0] * len(__data_columns)
    x[0] = sqft
    x[1] = bhk
    x[2] = bath
    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)

def get_location_names():
    return __locations

def load_saved_artifacts():
    print("Loading saved artifacts... start")
    global __data_columns
    global __locations
    global __model
    
    with open('artifacts/columns.json', 'r') as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]

    with open('artifacts/banglore_home_prices_model.pickle', 'rb') as f:
        __model = pickle.load(f)
    print("Loading saved artifacts... done")

if __name__ == "__main__":
    # This block is for testing purposes only
    # You can add test cases or example usage here
    print("This module is intended to be imported, not run directly.")
    load_saved_artifacts()
    print(get_estimated_price('1st Phase JP Nagar', 1000, 3, 3))
    