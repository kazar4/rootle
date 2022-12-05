import requests
import json
from flask import *
from flask_cors import CORS
from flask_cors import cross_origin
import math
from Algorithm import reorder

app = Flask(__name__)
cors = CORS(app)

auth_key = "3v32VhReRJaCPzOIZbMWGa1PzVXzTOAFbZA5-45itC7FFe_pWmZQXmBQ5rdSn0Z_c95vwMy07nqcQXW-_yTWKBC_NHYZ0TAuzlwP5_DTq3bRpnwTmqzjgPqKajyNY3Yx"


class BearerAuth(requests.auth.AuthBase):
    """Class to aid in sending an auth key."""
    def __init__(self, token):
        self.token = token

    def __call__(self, r):
        r.headers["authorization"] = "Bearer " + self.token
        return r

def filter_chain_brands(business_dict):
    """Filters out chain brands from the list of businesses by removing any
    businesses that appear more than once in the query."""
    counter = 0
    while counter < len(business_dict):
        curr_name = business_dict[counter]["name"]
        if sum([int(x["name"] == curr_name) for x in business_dict]) > 1:
            business_dict = list(filter(lambda x: x["name"] != curr_name, business_dict))
        else:
            counter += 1
    return business_dict

@app.route('/getFull/', methods=['POST', 'GET'])
@cross_origin()
def get_all_businesses():
    """Get all small businesses within a certain radius of location, and filtered
    by the search query given by inp."""
    if request.method == 'POST':
        location = request.form["loc"]
        inp = request.form["inp"]
    else:
        location = request.args.get("loc")
        inp = request.args.get("inp")

    from_search = ["id", "review_count", "name", "distance", "image_url", "categories"]
    counter = 0
    businesses = []
    error = None
    while True:
        if (counter + 1) * 50 == 1000:
            break
        parameters = {"location": location, "term": "Small Businesses " + inp, "limit": "50",
                  "radius": "15000", "offset": str(counter * 50)}
        response = requests.get('https://api.yelp.com/v3/businesses/search', params=parameters,
                                auth=BearerAuth(auth_key))
        json_parse = json.loads(response.text)

        if "error" in list(json_parse.keys()):
            # Error thrown
            error = json_parse
            break
        elif len(json_parse["businesses"]) == 0:
            break
        else:
            json_parse["businesses"] = [{key: x[key] for key in from_search} for x in json_parse["businesses"]]
            businesses += json_parse["businesses"]
            counter += 1

    if error is not None:
        # Some Error
        response = jsonify(error)
        #response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    else:
        if len(businesses) == 0:
            # No responses, throw an error
            response = jsonify([])
            #jsonify({"error": "No results"})
            #response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        else:
            businesses = filter_chain_brands(businesses)
            ids = [a["id"] for a in businesses]
            reviews = [a["review_count"] for a in businesses]

            # Algorithm here
            res = reorder(reviews, ids, len(ids))
            dict_res = {k:v for v,k in enumerate(res)}
            businesses.sort(key=lambda i: dict_res.get(i["id"]))
            print(businesses)

            response = jsonify(businesses)
            #response.headers.add('Access-Control-Allow-Origin', '*')
            return response


@app.route('/getFromBusiness/', methods=['POST', 'GET'])
@cross_origin()
def get_from_business():
    """Queries small business alternatives similar to the large business big_business,
    within a certain radius of location."""
    if request.method == 'POST':
        location = request.form["loc"]
        big_business = request.form["bbs"]
    else:
        location = request.args.get("loc")
        big_business = request.args.get("bbs")

    parameters = {"location": location, "term": big_business, "radius": "40000"}
    response = requests.get('https://api.yelp.com/v3/businesses/search', params=parameters,
                            auth=BearerAuth(auth_key))


    if (json.loads(response.text)["total"] == 0):
        return jsonify([])
    else:
        # Concatenates all category names, adds them to search query term
        category = " ".join([x["title"] for x in json.loads(response.text)["businesses"][0]["categories"]])

    from_search = ["id", "review_count", "name", "distance", "image_url", "categories"]
    counter = 0
    businesses = []
    error = None
    while True:
        if (counter + 1) * 50 == 1000:
            break
        parameters = {"location": location, "term": "Small Businesses " + category, "limit": "50",
                      "radius": "15000", "offset": str(counter * 50)}
        response = requests.get('https://api.yelp.com/v3/businesses/search', params=parameters,
                                auth=BearerAuth(auth_key))
        json_parse = json.loads(response.text)

        if "error" in list(json_parse.keys()):
            # Error thrown
            error = json_parse
            break
        elif len(json_parse["businesses"]) == 0:
            break
        else:
            json_parse["businesses"] = [{key: x[key] for key in from_search} for x in json_parse["businesses"]]
            businesses += json_parse["businesses"]
            counter += 1

    if error is not None:
        # Some Error
        response = jsonify(error)
        #response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    else:
        if len(businesses) == 0:
            # No responses, throw an error
            response = jsonify({"error": "No results"})
            #response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        else:
            businesses = filter_chain_brands(businesses)
            ids = [a["id"] for a in businesses]
            reviews = [a["review_count"] for a in businesses]

            # Algorithm here
            res = reorder(reviews, ids, len(ids))
            dict_res = {k: v for v, k in enumerate(res)}
            businesses.sort(key=lambda i: dict_res.get(i["id"]))
            print(businesses)

            response = jsonify(businesses)
            #response.headers.add('Access-Control-Allow-Origin', '*')
            return response


@app.route('/getBusiness/<id>', methods=['POST', 'GET'])
@cross_origin()
def get_business(id):
    """Gets more business information when the button is clicked to get more info."""
    from_id = ["photos", "hours", "location", "rating", "phone", "url"]
    info = json.loads(requests.get('https://api.yelp.com/v3/businesses/' + str(id), auth=BearerAuth(auth_key)).text)

    if "error" in list(info.keys()):
        # Some Error
        return json.dumps(info)
    else:
        # No Error
        if "hours" not in list(info.keys()):
            from_id = ["photos", "location", "rating", "phone", "url"]
            filtered_info = {key: info[key] for key in from_id}.update({"hours": "None"})
            response = jsonify(filtered_info)
            #response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        else:
            filtered_info = {key: info[key] for key in from_id}
            response = jsonify(filtered_info)
            #response.headers.add('Access-Control-Allow-Origin', '*')
            return response


if __name__ == '__main__':
    app.run(debug = True)
