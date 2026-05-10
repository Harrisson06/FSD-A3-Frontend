# CMP2812 - Assessment 3: Full-Stack Frontend
# Student ID: 28958802

## Prerequisites
- Python 
- MySQL Server (Docker Container)
- Browser (Chrome, Firefox)

## Project Structure
FSD-A3-Frontend/
├── index.html
├── driver/
│   ├── register.html
│   ├── login.html
│   ├── dashboard.html
│   └── profile.html
├── admin/
│   ├── login.html
│   ├── dashboard.html
│   └── notices.html
├── css/
│   ├── main.css
│   ├── driver.css
│   └── admin.css
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── ui.js
│   └── validations.js
└── assets/
└── images/

## Startup Order

### Step 1 — Start MySQL Database
Start Docker container running MySQL.
Then run the database setup script:

NYSPD.sql

### Step 2 — Start FastAPI Backend
Navigate to your Assessment 2 folder

Verify API is running at: `http://127.0.0.1:8000/docs`

### Step 3 — Start Frontend Web Server
Navigate to your Assessment 3 folder

Open browser at: `http://127.0.0.1:5500`

## Test Credentials

### Driver Accounts
- Email: `Citizen1@test.com`
- Password: `Password1`
- Drivers License: `822895210`

- Email: `Citizen2@test.com`
- Password: `Password1`
- Drivers License: `49641347`

### Admin/Officer Account
- Email: `admin@test.com`
- Password: `Password1`

- Email: `officer.test@test.com`
- Password: `Password1`

## Key User Journeys

### Driver Journey
1. Register at `/driver/register.html`
2. Login at `/driver/login.html`
3. View citations at `/driver/dashboard.html`
4. Update profile at `/driver/profile.html`

### Admin Journey
1. Login at `/admin/login.html`
2. View dashboard at `/admin/dashboard.html`
3. Manage notices at `/admin/notices.html`

## Troubleshooting

### CORS Errors
Ensure FastAPI has CORS middleware configured in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Database Connection Issues
- Ensure Docker container is running
- Check MySQL is accessible on port 3306
- Verify credentials in FastAPI `.env` file

### API Not Responding
- Confirm FastAPI is running on port 8000
- Check `http://127.0.0.1:8000/docs` is accessible
- Restart with `uvicorn main:app --reload`

### Frontend Not Loading
- Confirm Python HTTP server is running on port 5500
- Check no other service is using port 5500

## API Endpoints Used
| Endpoint | Method | Purpose |
|---|---|---|
| `/api/Login` | POST | User authentication |
| `/api/Users/` | POST | User registration |
| `/api/violations/my-violations` | GET | Driver citations |
| `/api/corrections/all` | GET | All notices (admin) |
| `/api/corrections/log-correction` | POST | Create notice |
| `/api/corrections/delete-notice/{id}` | DELETE | Delete notice |
| `/api/Officers` | GET | All officers |
| `/api/officers/linked-to-license/{id}` | GET | Officer by license |
| `/api/drivers/update-lastname` | PUT | Update driver name |
| `/api/drivers/update-address` | PUT | Update driver address |