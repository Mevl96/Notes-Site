import hashlib
from flask import Flask, render_template, request, jsonify, session, redirect
from flask_sqlalchemy import SQLAlchemy

from config import Config
from models import User

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = 'rwf0r3rj0e0rjnenr003dc'
db = SQLAlchemy(app)


@app.route('/ajax/auth', methods=['POST'])
def auth():
	user = User.query() \
		.filter_by(User.login == request.form['login']) \
		.filter_by(User.password == hashlib.md5(request.form['password'])) \
		.one_or_none()
	if user is not None:
		session['user'] = user.id
		return jsonify({'result': True})
	else:
		return jsonify({'result': False})


@app.route('/logout')
def logout():
	session.pop('user', None)
	return redirect('/')


@app.route('/')
def index():
	return render_template('index.html')


if __name__ == '__main__':
	app.run()
