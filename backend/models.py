from flask_sqlalchemy import SQLAlchemy 

db = SQLAlchemy()

class users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

class highscores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    highscore = db.Column(db.Integer, nullable=False)