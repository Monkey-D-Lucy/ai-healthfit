from app import create_app, db
from app.models.user import User

app = create_app()
with app.app_context():
    # Drop and recreate tables (for clean start)
    db.drop_all()
    db.create_all()
    print("Tables created successfully!")
    
    # Create test user
    user = User(
        email='patient@healthfit.com',
        first_name='John',
        last_name='Doe',
        role='patient'
    )
    user.set_password('password123')
    db.session.add(user)
    
    # Create doctor
    doctor = User(
        email='doctor@healthfit.com',
        first_name='Sarah',
        last_name='Johnson',
        role='doctor'
    )
    doctor.set_password('password123')
    db.session.add(doctor)
    
    db.session.commit()
    print("Users created successfully!")
    print("Email: patient@healthfit.com")
    print("Password: password123")
    print("\nYou can now login!")