@echo off
echo Setting up Prodiny project...
cd /d "%~dp0"

echo Installing backend dependencies...
npm install

echo Installing frontend dependencies...
cd client
npm install
cd ..

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Your MongoDB connection is already configured in .env file
echo 2. Run: npm run seed (to populate sample data - DONE if you see this message)
echo 3. Run: npm run dev (to start both backend and frontend)
echo.
echo Quick start options:
echo - start-app.bat (starts both backend and frontend)
echo - start-backend-only.bat (backend only)
echo - start-frontend.bat (frontend only)
echo.
echo Access your app at: http://localhost:3000
echo Backend API at: http://localhost:5000
pause
