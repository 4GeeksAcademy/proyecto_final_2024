from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    name = db.Column(db.String(120),  nullable=True)
    password = db.Column(db.String(80), unique=False, nullable=True)
    profile_picture_url = db.Column(db.String(500), nullable=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "profile_picture_url": self.profile_picture_url
            # do not serialize the password, its a security breach
        }