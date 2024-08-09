from flask import Flask
from flask_pymongo import pymongo
from server import app
from dotenv import load_dotenv
import os

load_dotenv()
CONNECTION_STRING = os.getenv("MONGO_DB_URL")
client = pymongo.MongoClient(CONNECTION_STRING)
db = client.get_database('flask_mongodb_atlas')
user_collection = pymongo.collection.Collection(db, 'user_collection')