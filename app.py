from flask import Flask, session, abort
from flask_sqlalchemy import SQLAlchemy
from functools import wraps

from config import Config

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = 'rwf0r3rj0e0rjnenr003dc'
db = SQLAlchemy(app)


def auth_required(f):
	@wraps(f)
	def decorated(*args, **kwargs):
		if 'user' not in session:
			abort(403)
		else:
			return f(*args, **kwargs)

	return decorated


if __name__ == '__main__':
	from web import bp
	app.register_blueprint(bp)
	app.run()
