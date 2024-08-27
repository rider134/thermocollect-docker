from app import db, ma
from flask_sqlalchemy import *


class Facade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=False, nullable=False)
    facadeId = db.Column(db.String(80), unique=True, nullable=False)
    angle = db.Column(db.Integer, unique=False, nullable=False)
    mode = db.Column(db.Integer, unique=False, nullable=False)

    def __repr__(self):
        return '<Facade %r>' % self.name

class FacadeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Facade
        include_fk = True
        load_instance = True