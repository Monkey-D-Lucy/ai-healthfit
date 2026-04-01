from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}?charset=utf8mb4"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600
    
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    # Configure CORS - only once
    CORS(app, 
         origins=["http://localhost:3000"], 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({'error': 'Bad request', 'message': str(e)}), 400
    
    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({'error': 'Unauthorized', 'message': 'Invalid or missing token'}), 401
    
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Not found', 'message': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Server error', 'message': 'Internal server error'}), 500
    
    from .routes.auth import auth_bp
    from .routes.health import health_bp
    from .routes.appointments import appointments_bp
    from .routes.users import users_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(health_bp, url_prefix='/api/health')
    app.register_blueprint(appointments_bp, url_prefix='/api/appointments')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    
    return app