# MongoDB Setup Guide for Loan Management System

The application is running, but you need to configure MongoDB to use it. Choose one of the following options:

## Option 1: MongoDB Atlas (Cloud) - Recommended

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new project
4. Create a new cluster (free tier available)

### Step 2: Get Connection String
1. Go to **Database** → **Clusters**
2. Click **Connect** on your cluster
3. Choose **Drivers** → **Node.js**
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority`)

### Step 3: Add IP Whitelist
1. Go to **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** or add your IP
4. Confirm

### Step 4: Create Database User (if not done)
1. Go to **Database Access**
2. Click **Add New Database User**
3. Set username: `loanadmin`
4. Set password: `YourSecurePassword123!`
5. Click **Add User**

### Step 5: Update .env File
Edit the `.env` file in the project root and update:

```env
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://loanadmin:YourSecurePassword123!@cluster0.xxxxx.mongodb.net/loan_management_db?retryWrites=true&w=majority
MONGODB_DATABASE=loan_management_db
```

---

## Option 2: Local MongoDB (Windows)

### Step 1: Download and Install MongoDB
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer with default settings
3. MongoDB will be installed and start automatically

### Step 2: Verify Installation
```powershell
# Check if MongoDB is running
Get-Service -Name MongoDB
```

### Step 3: Connect String for Local MongoDB
Update your `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/loan_management_db
MONGODB_DATABASE=loan_management_db
```

### Step 4: Create Collections (Optional)
MongoDB will auto-create collections when needed.

---

## Option 3: Docker MongoDB (If Docker Installed)

### Step 1: Pull and Run MongoDB Image
```powershell
docker run --name loan-mongo -d -p 27017:27017 mongo:latest
```

### Step 2: Update .env
```env
MONGODB_URI=mongodb://localhost:27017/loan_management_db
MONGODB_DATABASE=loan_management_db
```

---

## After Configuration

### Step 1: Stop Current Application
Press `Ctrl+C` in the terminal running the application

### Step 2: Restart Application
```powershell
cd "D:\Loan Management System"

# Set Maven environment
$tempDir = [System.IO.Path]::GetTempPath()
$env:MAVEN_HOME = "$tempDir\maven-extract\apache-maven-3.9.5"
$env:PATH = "$env:MAVEN_HOME\bin;$env:PATH"

# Start application
mvn spring-boot:run
```

### Step 3: Access Dashboard
Open your browser and go to:
```
http://localhost:8080/pages/login.html
```

**Default Login Credentials:**
- Username: `admin`
- Password: `admin123`

---

## Troubleshooting

### MongoDB Connection Errors
If you see: `Failed looking up SRV record` or similar DNS errors
- **For MongoDB Atlas**: Verify your connection string includes the correct username and password
- **For Local MongoDB**: Make sure MongoDB service is running (`Get-Service MongoDB`)

### Cannot Login
Make sure MongoDB is running and you've created the admin user:
1. Login with default credentials (admin/admin123)
2. If it fails, you may need to manually create an admin record in MongoDB

### Port 8080 Already in Use
If you get "Port 8080 already in use":
```powershell
# Kill process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

Then restart the application.

---

## Quick Setup (MongoDB Atlas)

```bash
# 1. Create MongoDB Atlas account and cluster
# 2. Get connection string from Atlas
# 3. Edit .env file with connection string
# 4. Stop app (Ctrl+C)
# 5. Run: mvn spring-boot:run
# 6. Go to: http://localhost:8080/pages/login.html
# 7. Login: admin / admin123
```

---

## Next Steps

Once MongoDB is configured and you can login to the dashboard:

1. **Create test customers** - Use the dashboard to add new loan customers
2. **Create test loans** - Add loan applications
3. **Test SMS feature** - Configure SMS API key in .env (optional)
4. **Explore all features** - Try all dashboard sections

---

For detailed MongoDB Atlas setup with screenshots, see: **SETUP_INSTRUCTIONS.md**

