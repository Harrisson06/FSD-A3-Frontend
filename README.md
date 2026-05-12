# CMP2812 - Assessment 3: Full-Stack Development: Frontend
**Student ID:** 28958802
**Student Name:** Harrison Macdonald

### Step 1 — Start MySQL Database
1. Start your Docker container running MySQL
2. open MySql workbench
3. Run the database setup script:
   ```
   NYSPD.sql
   ```

### Step 2 — Start FastAPI Backend
1. Navigate to your Assessment 2 folder
2. Create `.env` files for environment-specific configuration:
    - Click View 
    - Click Command Palette
    - Click Python: Create environment
    - Select python version if multiple exist
    - Create the .venv using requirements.txt
3. Start the FastAPI server with: `uvicorn main:app --reload`
4. Once ran, stop running, open the terminal and run 
``` Bash
python -m seed.seed_users
```
5. Re-start the FastAPI server with: `uvicorn main:app --reload`
6. Verify API is running at: `http://127.0.0.1:8000/docs`

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
| `Citizen2@test.com` | `Password1` | `496461347` |

### Admin/Officer Accounts
| Email | Password |
|-------|----------|
| `admin@test.com` | `Password1` |
| `officer.test@test.com` | `Password1` |

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
