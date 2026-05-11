# CMP2812 - Assessment 3: Full-Stack Development: Frontend
**Student ID:** 28958802
**Student Name:** Harrison Macdonald

### Features
- **Driver Portal**: Register, login, view traffic violations, and manage profile information
- **Admin Portal**: Login, manage notices, and view system dashboard
- **Responsive Design**: Works on desktop and mobile devices
- **API Integration**: Seamless communication with FastAPI backend
- **Authentication**: Secure login with session management

---

### Code Organization & Separation of Concerns

**HTML (Structure)** - Content & semantic markup
- Portal-specific HTML files contain page structure
- Forms for user input
- Semantic HTML5 elements for accessibility

**CSS (Presentation)** - Visual styling & layout
- `main.css`: Global styles, typography, common components
- `driver.css`: Driver portal-specific styling
- `admin.css`: Admin portal-specific styling
- Responsive design for mobile compatibility

**JavaScript (Behavior & Logic)** - DOM manipulation & interactions
- `api.js`: Encapsulates all HTTP API communication (DRY principle)
- `auth.js`: Handles authentication flows and session management
- `ui.js`: DOM manipulation helper functions to avoid code duplication
- `validations.js`: Centralized form validation logic
- Portal-specific `.js` files: Page-specific business logic

**Benefits of this separation:**
    **Modularity**: Each layer has a single responsibility
    **Maintainability**: Easy to locate and update specific functionality
    **Reusability**: Shared modules prevent code duplication (DRY)
    **Testability**: Independent modules can be tested in isolation
    **Scalability**: New features can be added without affecting existing code

---

## Getting Started

### Step 1 — Start MySQL Database
1. Start your Docker container running MySQL
2. Run the database setup script:
   ```
   NYSPD.sql
   ```

### Step 2 — Start FastAPI Backend
1. Navigate to your Assessment 2 folder
2. Start the FastAPI server with: `uvicorn main:app --reload`
3. Verify API is running at: `http://127.0.0.1:8000/docs`

### Step 3 — Start Frontend Web Server
1. Navigate to this Assessment 3 folder
2. Start a local web server (if using VS Code Live Server, just open `index.html`)
3. Open browser at: `http://127.0.0.1:5500`

---

## Test Credentials

### Driver Accounts
| Email | Password | License |
|-------|----------|---------|
| `Citizen1@test.com` | `Password1` | `822895210` |
| `Citizen2@test.com` | `Password1` | `49641347` |

### Admin/Officer Accounts
| Email | Password |
|-------|----------|
| `admin@test.com` | `Password1` |
| `officer.test@test.com` | `Password1` |

---

## Project Structure

```
FSD-A3-Frontend/
├── index.html              # Home page
├── README.md              # This file
├── admin/                 # Admin portal
│   ├── dashboard.html     # Officer dashboard
│   ├── dashboard.js       # Dashboard logic
│   ├── login.html         # Admin login page
│   ├── login.js           # Admin authentication
│   ├── notices.html       # Notice management
│   └── notices.js         # Notice operations
├── driver/                # Driver portal
│   ├── dashboard.html     # Driver citations view
│   ├── dashboard.js       # Dashboard logic
│   ├── login.html         # Driver login page
│   ├── login.js           # Driver authentication
│   ├── profile.html       # Driver profile page
│   ├── profile.js         # Profile management
│   ├── register.html      # Driver registration
│   └── register.js        # Registration logic
├── css/                   # Stylesheets
│   ├── admin.css          # Admin portal styles
│   ├── driver.css         # Driver portal styles
│   └── main.css           # Global styles
└── js/                    # Shared utilities
    ├── api.js             # API request handling
    ├── auth.js            # Authentication logic
    ├── ui.js              # UI helper functions
    └── validations.js     # Form validation
```

--- 

## API Endpoints

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

---

## Troubleshooting

### Database Connection Issues
**Problem**: Cannot connect to MySQL database
**Solutions**:
- Ensure Docker container is running
- Check MySQL is accessible on port 3306
- Verify database credentials in FastAPI `.env` file
- Confirm NYSPD.sql has been executed

### API Not Responding
**Problem**: Backend API is unreachable
**Solutions**:
- Confirm FastAPI is running on port 8000
- Check `http://127.0.0.1:8000/docs` is accessible
- Restart with: `uvicorn main:app --reload`
- Check firewall is not blocking port 8000

### Frontend Not Loading
**Problem**: Website not loading in browser
**Solutions**:
- Confirm Python HTTP server is running on port 5500
- Check no other service is using port 5500
- Clear browser cache (Ctrl+Shift+Delete)
- Try opening in incognito/private mode

## Testing & Deployment

### Local Deployment
This application is designed for **local development and testing only** using:
- Python's Live Server extension which uses (port 5500)
- Local FastAPI backend (port 8000)
- Docker-based MySQL (port 3306)

### Deployment order
- Run MySQL docker container 
- Run NYSPD.sql script in MySQL workbench
- Open 28958802_HM_A2 FASTAPI vsc file
- Create .venv 
- Run the project using the python FastAPI debugging tool
- open the terminal and run 
``` bash
python -m seed.seed_users
```
- this creates four test users that you can use to check functionality 
- Refresh the debugging tool if the command didn't already do so
- Open Assessment 3 folder in VSC
- Ensure live server is installed or which ever testing system your using
- the frontend should open in your browser

### Environment Setup
Create `.env` files for environment-specific configuration:
- Click View 
- Click Command Palette
- click Python: Create environment
- select python version if multiple exist
- create the .venv using requirements.txt

## Additional Resources

### Code References
- [MDN Web Docs](https://developer.mozilla.org/) - HTML, CSS, JavaScript documentation
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - For understanding API calls
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) - Session management

### Related Projects
- **Assessment 2**: FastAPI Backend - Handles logic and database
- **NYSPD Database**: SQL schema and seed data

### Support & Questions
For issues or questions:
1. Check Troubleshooting section above
2. Review browser console for error messages
3. Verify all services are running (MySQL, FastAPI)
4. Check API documentation at `http://127.0.0.1:8000/docs`