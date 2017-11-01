from sqlalchemy import func

from web import db


class User(db.Model):
	__tablename__ = 'users'
	id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
	login = db.Column(db.String(24), index=True, unique=True, nullable=False)
	password = db.Column(db.String(32), nullable=False)
	name = db.Column(db.String(46), nullable=False)
	created_at = db.Column(db.TIMESTAMP, nullable=False, default=func.current_timestamp())


class Category(db.Model):
	__tablename__ = 'categories'
	id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
	name = db.Column(db.String(24), unique=True, nullable=False)
	created_at = db.Column(db.TIMESTAMP, nullable=False, default=func.current_timestamp())
	notes = db.relationship('Note', backref='category')


class Note(db.Model):
	__tablename__ = 'notes'
	id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
	category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
	title = db.Column(db.String(42), nullable=False)
	content= db.Column(db.Text, nullable=False)
	created_at = db.Column(db.TIMESTAMP, nullable=False, default=func.current_timestamp())
	updated_at = db.Column(db.TIMESTAMP, nullable=False, default=func.current_timestamp())
	state = db.Column(db.Enum('default', 'deleted'), default='default', nullable=False)


class ToDoList(db.Model):
	__tablename__ = 'todo_lists'
	id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
	category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), primary_key=True, nullable=False)
	title = db.Column(db.String(42), nullable=False)
	target_date = db.Column(db.Date, nullable=False)
	created_at = db.Column(db.TIMESTAMP, nullable=False, default=func.current_timestamp())
	state = db.Column(db.Enum('default', 'deleted'), default='default', nullable=False)


class ToDoItem(db.Model):
	__tablename__ = 'todo_items'
	id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
	list_id = db.Column(db.Integer, db.ForeignKey('todo_lists.id'), nullable=False)
	content = db.Column(db.String(84), nullable=False)
	checked = db.Column(db.Boolean, default=False, nullable=False)
	created_at = db.Column(db.TIMESTAMP, nullable=False, default=func.current_timestamp())