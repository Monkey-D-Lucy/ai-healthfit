from app import create_app, db
from app.models.user import User

app = create_app()
with app.app_context():
    # Check if user exists
    user = User.query.filter_by(email='patient@healthfit.com').first()
    if user:
        print("User already exists")
    else:
        # Create new user
        user = User(
            email='patient@healthfit.com',
            first_name='John',
            last_name='Doe',
            role='patient'
        )
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        print("User created successfully!")
        print("Email: patient@healthfit.com")
        print("Password: password123")