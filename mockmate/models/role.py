from ..extensions import mongo
from typing import List, Dict

def get_roles() -> List[Dict]:
    return list(mongo.db.roles.find({}, {'_id': 0}))

def add_role(name: str):
    mongo.db.roles.update_one({'name': name}, {'$set': {'name': name}}, upsert=True)

def delete_role(name: str):
    mongo.db.roles.delete_one({'name': name})
