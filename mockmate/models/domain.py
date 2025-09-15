from ..extensions import mongo
from typing import List, Dict

def get_domains() -> List[Dict]:
    return list(mongo.db.domains.find({}, {'_id': 0}))

def add_domain(name: str):
    mongo.db.domains.update_one({'name': name}, {'$set': {'name': name}}, upsert=True)

def delete_domain(name: str):
    mongo.db.domains.delete_one({'name': name})
