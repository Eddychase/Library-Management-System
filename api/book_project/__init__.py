from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import func

app = Flask(__name__)
CORS(app, origins='http://localhost:3000')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.secret_key = '123764838gdhmkcmdekcmeo34j89c0'
db = SQLAlchemy(app)
  # Enable CORS for t

from book_project import routes