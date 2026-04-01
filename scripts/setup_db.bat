@echo off
echo ========================================
echo Setting up HealthFit AI Database
echo ========================================
echo.
echo Creating database and tables...
mysql -u root -proot123 < database/schema.sql
if %errorlevel% equ 0 (
    echo.
    echo Database setup completed successfully!
    echo.
    echo You can now login with:
    echo Email: patient@healthfit.com
    echo Password: password123
) else (
    echo.
    echo Error setting up database. Please make sure MySQL is running
    echo and root password is 'root123'
)
pause