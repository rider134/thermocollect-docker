from app import *
import json

def initDB():
    with app.app_context():
        db.drop_all()
        db.create_all()    

        with open('facade.json') as facades:
            data = json.load(facades)
            print(data)
            data = facades_schema.load(data)
            
            db.session.add_all(data)
            db.session.commit() 

if __name__ == '__main__':
    initDB()