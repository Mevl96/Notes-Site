class Config(object):
	DEBUG = True
	SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:qwerty@localhost/lab_notes'
	SQLALCHEMY_NATIVE_UNICODE = True
	SQLALCHEMY_ECHO = False
	SQLALCHEMY_TRACK_MODIFICATIONS = False