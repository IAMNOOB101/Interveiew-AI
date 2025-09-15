from ..extensions import mongo
from typing import List, Dict

def get_interview_types() -> List[Dict]:
    return list(mongo.db.interview_types.find({}, {'_id': 0}))

def add_interview_type(name: str):
    mongo.db.interview_types.update_one({'name': name}, {'$set': {'name': name}}, upsert=True)

def delete_interview_type(name: str):
    mongo.db.interview_types.delete_one({'name': name})
