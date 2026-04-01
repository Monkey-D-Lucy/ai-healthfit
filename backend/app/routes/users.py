from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..models.user import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/doctors', methods=['GET'])
@jwt_required()
def get_doctors():
    try:
        doctors = User.query.filter_by(role='doctor', is_active=True).all()
        return jsonify({'doctors': [d.to_dict() for d in doctors]})
    except Exception as e:
        print(f"Error in get_doctors: {str(e)}")
        return jsonify({'doctors': []}), 200