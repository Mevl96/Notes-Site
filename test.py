import unittest

import flask

from web import app, db


class TestCase(unittest.TestCase):
	def setUp(self):
		from config import Config
		app.config.from_object(Config)
		app.config['TESTING'] = True
		app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:qwerty@localhost/lab_notes_test'
		app.config['CSRF_ENABLED'] = False
		self.app = app.test_client()
		from models import User
		user = User()
		user.name = 'Test'
		user.login = 'test@mail.ru'
		from _md5 import md5
		user.password = md5('qwe'.encode('utf-8')).hexdigest()
		db.session.add(user)
		db.session.flush()
		db.session.commit()

	def tearDown(self):
		from models import Note, Category, User
		db.session.query(Note).delete()
		db.session.query(Category).delete()
		db.session.query(User).delete()
		db.session.commit()
		db.session.flush()

	def test_sign_up(self):
		rv = self.app.post('/registration', data=dict(
			form_name='Test user',
			form_email='test@gmail.com',
			form_pswd1='qwerty'
		), follow_redirects=True)
		assert b'Test user' in rv.data

	def test_sign_in(self):
		with app.test_client() as c:
			rv = c.post('/ajax/auth', data=dict(
				login='test@mail.ru',
				password='qwe'
			))
			assert b'true' in rv.data
			assert 'user' in flask.session


if __name__ == '__main__':
	unittest.main()
