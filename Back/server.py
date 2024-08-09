from flask import Flask, jsonify, send_file, make_response
from flask import request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

import db
import json
import pandas as pd
import os
from bson.json_util import dumps, loads 

from scraper import get_repos
from gpt import get_multiple_bullets
from vectorize import get_similiarity, embed_data
from keyword_parse import get_keyword_count
from generate import make_resume

@app.route("/")
def home():
    return "Hello, World!"

@app.route("/checkusername", methods=['POST'])
def checkusername():
    username = request.json['username']

    existing_user = db.db.collection.find_one({"username": username})
    if existing_user == None:
        return jsonify({"exists": False})
    else:
        return jsonify({"exists": True})

@app.route("/getuser", methods=['get'])
def getuserprojects():
    username = request.args.get('username')
    # print(username)
    existing_user = db.db.collection.find_one({"username": username})
    return json.loads(dumps(existing_user))
    
@app.route("/setuserinfo", methods=['post'])    
def setuserinfo():
    data = request.json
    existing_user = db.db.collection.find_one({"username": data['username']})
    if existing_user != None:
        existing_user.pop('_id')
        if "_id" in data:
          data.pop('_id')
        print(existing_user.keys())
        new_user = {**existing_user, **data}
        print(new_user.keys())
        db.db.collection.update_one({"username": data['username']}, {"$set":new_user})
        return "updated"
    else:
        db.db.collection.insert_one({**data})
        return "inserted"

@app.route("/scrapegithub", methods=['post'])
def scrapegithub():
    data = request.json
    existing_user = db.db.collection.find_one({"username": data['username']})
    if existing_user != None:
        repos = get_repos(data['github'])
        db.db.collection.update_one({"username": data['username']}, {"$set":{"github":data['github'], "repos": {**(existing_user.get('repos',{})), **repos}}})
        existing_user = db.db.collection.find_one({"username": data['username']})
        return json.loads(dumps(existing_user))
    else:
        return "no user found"
    
@app.route("/updateprojects", methods=['post']) 
def updateprojects():
    data = request.json
    existing_user = db.db.collection.find_one({"username": data['username']})
    if existing_user != None:
        db.db.collection.update_one({"username": data['username']}, {"$set":{"repos": data['repos']}})
        existing_user = db.db.collection.find_one({"username": data['username']})
        return json.loads(dumps(existing_user))
    else:
        return "user not found"
    
@app.route("/updateexperience", methods=['post']) 
def updateexperience():
    data = request.json
    existing_user = db.db.collection.find_one({"username": data['username']})
    if existing_user != None:
        db.db.collection.update_one({"username": data['username']}, {"$set":{"experiences": data['experiences']}})
        existing_user = db.db.collection.find_one({"username": data['username']})
        return json.loads(dumps(existing_user))
    else:
        return "user not found"

@app.route("/generatebullets", methods=['post'])
def genbullets():
    data = request.json
    existing_user = db.db.collection.find_one({"username": data['username']})
    if existing_user != None:
        repos = existing_user['repos']
        repos = get_multiple_bullets(repos)
        experiences = existing_user['experiences']
        experiences = get_multiple_bullets(experiences, prompt="experience")
        db.db.collection.update_one({"username": data['username']}, {"$set":{"repos": repos,"experiences": experiences}})

        return "bullets generated"
    else:
        return "user not found"
    

@app.route("/clear")
def clear():
    db.db.collection.delete_many({})
    return "cleared"

@app.route("/viewall")
def viewall():
    cursor = db.db.collection.find({})
    list_cur = list(cursor) 
    json_data = dumps(list_cur, indent = 2)  
    return json_data

@app.route("/getresume", methods=['post'])
def getresume():
    username = request.json['username']
    job_desc = request.json['job']
    existing_user = db.db.collection.find_one({"username": username})

    # Get Projects DF
    data = []
    for repo_name in existing_user['repos']:
        repo = existing_user['repos'][repo_name]
        if 'bullets' not in repo:
            continue
        for bullet in repo['bullets']:
            data.append((bullet, repo_name))
    data = pd.DataFrame(data, columns=["bullet", "title"])
    df_proj = get_similiarity(job_desc, embed_data(data))
    df_proj = get_keyword_count(job_desc, df_proj)

    # Get Experience DF
    data = []
    for experience_name in existing_user['experiences']:
        experience = existing_user['experiences'][experience_name]
        if 'bullets' not in experience:
            continue
        for bullet in experience['bullets']:
            data.append((bullet, experience['name'], experience.get('dates',""), experience.get('company',""), experience.get('location',"")))
    data = pd.DataFrame(data, columns=["bullet", "title", "date", "company", "location"])
    df_exp = get_similiarity(job_desc, embed_data(data))
    df_exp = get_keyword_count(job_desc, df_exp)

    filename = make_resume(df_exp, df_proj, existing_user)
    return filename

@app.route("/download/<string:username>", methods=['GET'])
def return_pdf(username):
    try:
        file_path = f'./pdfs/{username}_resume.pdf'
        if os.path.isfile(file_path):
            return send_file(file_path, as_attachment=False, mimetype='application/pdf', )
        else:
            return make_response(f"File '{username}' not found.", 404)
    except Exception as e:
        return make_response(f"Error: {str(e)}", 500)

if __name__ == '__main__':
    app.run(port=8000)