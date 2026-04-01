from app import create_app, db
from app.models.user import User

app = create_app()
with app.app_context():
    user = User.query.filter_by(email='patient@healthfit.com').first()
    if user:
        user.set_password('password123')
        db.session.commit()
        print(f"Password updated for {user.email}")
        print("You can now login with: password123")
    else:
        print("User not found. Creating new user...")
        new_user = User(
            email='patient@healthfit.com',
            first_name='John',
            last_name='Doe',
            role='patient'
        )
        new_user.set_password('password123')
        db.session.add(new_user)
        db.session.commit()
        print("User created successfully!")
        print("Email: patient@healthfit.com")
        print("Password: password123")