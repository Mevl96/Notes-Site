from flask import render_template, request, jsonify, session, redirect, abort, Blueprint
from hashlib import md5

from app import db, auth_required
from models import User

bp = Blueprint('bp', __name__, template_folder='templates')


@bp.route('/ajax/auth', methods=['POST'])
def auth():
	from models import User
	user = db.session.query(User) \
		.filter(User.login == request.form['login']) \
		.filter(User.password == md5(request.form['password'].encode('utf-8')).hexdigest()) \
		.one_or_none()
	if user is not None:
		session['user'] = user.id
		return jsonify({'result': True})
	else:
		return jsonify({'result': False})


@auth_required
@bp.route('/ajax/notes/by-cat/<int:cat_id>', methods=['GET'])
def notes(cat_id):
	from models import Note
	notes = db.session.query(Note).filter(Note.category_id == cat_id).all()
	return jsonify({'notes': notes})


@auth_required
@bp.route('/ajax/notes/new', methods=['POST'])
def newnote():
	try:
		from models import Note
		note = Note()
		note.category_id = request.form['category']
		note.content = request.form['content']
		note.title = request.form['title']
		db.session.add(note)
		db.session.flush()
		db.session.commit()
		return jsonify({'id': note.id})
	except:
		db.session.rollback()
		abort(500)


@auth_required
@bp.route('/ajax/notes/<int:note_id>', methods=['GET', 'DELETE', 'POST'])
def note_act(note_id):
	from models import Note
	if request.method == 'GET':
		note = db.session.query(Note).get(note_id)
		if note is None:
			abort(404)
		else:
			return jsonify({'note': note})
	elif request.method == 'DELETE':
		try:
			db.session.query(Note).filter(Note.id == note_id).delete()
			db.session.flush()
			db.session.commit()
			return jsonify({'result': True})
		except:
			db.session.rollback()
			abort(500)
	else:
		try:
			note = db.session.query(Note).get(note_id)
			if note is None:
				abort(404)
			note.title = request.form['title']
			note.content = request.form['content']
			db.session.flush()
			db.session.commit()
			return jsonify({'result': True})
		except:
			db.session.rollback()
			abort(500)


@auth_required
@bp.route('/ajax/category/new', methods=['POST'])
def newcat():
	try:
		from models import Category
		cat = Category()
		cat.name = request.form['name']
		cat.user_id = session['user']
		db.session.add(cat)
		db.session.flush()
		db.session.commit()
		return jsonify({'name': cat.name, 'id': cat.id})
	except:
		db.session.rollback()
		abort(500)


@bp.route('/logout')
def logout():
	session.pop('user', None)
	return redirect('/')


@bp.route('/')
def index():
	return render_template('index.html')


@bp.route('/registration', methods=['GET', 'POST'])
def registration(self: User):
	if request.method == 'GET':
		return render_template('registration.html')
	else:
		try:
			from models import User
			user = User()
			user.name = request.form['form_name']
			user.login = request.form['form_email']
			user.password = md5(request.form['form_pswd1'].encode('utf-8')).hexdigest()
			db.session.add(user)
			db.session.flush()
			db.session.commit()
			session['user'] = user.id
			return redirect('/dash')
		except:
			db.session.rollback()
			abort(500)


@bp.route('/dash')
def dash():
	if 'user' not in session:
		return redirect('/')
	from models import User, Note, Category
	user = db.session.query(User).get(session['user'])
	categories = db.session.query(Category).filter(Category.user_id == user.id).all()
	notes = {}
	for cat in categories:
		notes[cat.id] = db.session.query(Note).filter(Note.category_id == cat.id).all()
	return render_template('dashboard.html', u=user, cats=categories, notes=notes)
