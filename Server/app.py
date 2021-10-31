from flask import Flask, request, json, jsonify, current_app, abort
from flask_cors import CORS
from scrape import Scrape
import database
import jwt
import datetime
from functools import wraps

from settings import SECRET_KEY


app = Flask(__name__)
CORS(app)
app.config.from_object("settings")
db = database.Database()
port = app.config.get("PORT",5000)
app.config["db"] = db

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        try:
            data = jwt.decode(token, SECRET_KEY)
            print(data["user"])
        except:
            return jsonify({'message':'Token is invalid or missing'}), 403
        return f(*args, *kwargs, data["user"])
    return decorated

@app.route('/scrape', methods =["GET","POST"])
def home():
    success = Scrape()
    return jsonify({"message": success})

@app.route('/main_page', methods =["GET"])
@token_required
def main_page(username):
    votes,foods,isLunch = db.get_homepage_infos(username)
    return json.dumps({"foods": foods, "userVotes":votes, "isLunch":isLunch}, indent = 4,ensure_ascii=False, separators=(',', ': '))

@app.route('/vote', methods =["POST"])
@token_required
def vote(username):
    addData_json = request.get_json()
    score = addData_json.get('score')
    food_name = addData_json.get('foodName')
    success = db.vote(username, score, food_name)
    return jsonify(success)

@app.route('/comment', methods =["POST"])
@token_required
def comment(username):
    addData_json = request.get_json()
    text_ = addData_json.get('text')
    food_name = addData_json.get('foodName')
    success = db.comment(username, text_, food_name)
    return jsonify(success)

@app.route('/get-food-comments', methods =["POST"])
@token_required
def get_food_comments(username):
    food_name = request.get_json().get('foodName')
    return json.dumps(db.get_food_comments(food_name, False, username), indent = 4, ensure_ascii=False, separators=(',', ': '))

@app.route('/get-food-info', methods =["POST"])
@token_required
def get_food_info(username):
    food_name = request.get_json().get('foodName')
    return jsonify(db.get_food_comments(food_name, True, username))

@app.route('/signup', methods =["POST"])
def signup():
    addData_json = request.get_json()
    username = addData_json.get('username').lower()
    password_ = addData_json.get('password')
    success = db.signup(username, password_)
    if(success):
        token = jwt.encode({'user' : username}, SECRET_KEY)
        return jsonify({'Authorization' : token.decode('UTF-8')})
    return "Username exists", 403

@app.route('/signin', methods =["POST"])
def signin():
    addData_json = request.get_json()
    username = addData_json.get('username').lower()
    password_ = addData_json.get('password')
    print(username, password_)
    success = db.signin(username, password_)
    if(success):
        token = jwt.encode({'user' : username}, SECRET_KEY)
        print("Signin başarılı")
        return jsonify({'Authorization' : token.decode('UTF-8')})
    return "Incorrect username or password", 403

@app.route('/comment-vote', methods =["POST"])
@token_required
def comment_vote(username):
    data_json = request.get_json()
    comment_id = data_json.get('commentId')
    operation = data_json.get('operation')
    commenter = data_json.get('commenter')
    return jsonify(db.comment_vote(comment_id, username, operation, commenter))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)

