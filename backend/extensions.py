from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Extensions are created here, but not bound to the app yet
db = SQLAlchemy()
migrate = Migrate()
