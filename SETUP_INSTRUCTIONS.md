# 🚀 SETUP INSTRUCTIONS - Loan Management System

## Welcome! 👋

Your complete Loan Management System project has been created and is ready for setup. Follow these instructions to get your application running in minutes.

---

## Step 1: MongoDB Atlas Setup (5 minutes)

### 1.1 Create MongoDB Account
```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google account
4. Verify your email
```

### 1.2 Create Your First Cluster
```
1. Login to MongoDB Atlas
2. Click "Build a Database"
3. Select "Shared" tier (FREE)
4. Choose your region (e.g., AWS - US East)
5. Click "Create"
6. Wait 1-2 minutes for cluster creation
```

### 1.3 Create Database User
```
1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Enter:
   - Username: any username (e.g., "loan_admin")
   - Password: strong password
4. Click "Add User"
5. Copy the username and password - you'll need them!
```

### 1.4 Setup Network Access
```
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Choose one:
   Option A: Click "Add My Current IP Address" (Recommended for development)
   Option B: Click "Allow Access from Anywhere" (Less secure but easier)
4. Click "Confirm"
```

### 1.5 Get Your Connection String
```
1. Click "Databases" in top menu
2. Find your cluster, click "Connect"
3. Select "Connect your application"
4. Choose "Java"
5. Copy the connection string
6. It will look like:
   mongodb+srv://username:password@cluster-name.mongodb.net/databasename?retryWrites=true&w=majority
```

---

## Step 2: Configure Your Project (.env File)

### 2.1 Open .env File
```
Location: Loan Management System/.env
```

### 2.2 Update MongoDB Configuration
Find these lines and update:
```env
# Replace with YOUR connection string
MONGODB_URI=mongodb+srv://your_username:your_password@your-cluster-name.mongodb.net/loan_management_db?retryWrites=true&w=majority

# Database name (usually leave as is)
MONGODB_DATABASE=loan_management_db
```

### 2.3 Complete Configuration (Optional for now)
```env
# SMS (Optional - for SMS notifications)
SMS_API_KEY=your_sms_api_key_here
SMS_API_URL=https://api.sms-provider.com/send

# Admin (Update if you want different credentials)
ADMIN_EMAIL=admin@loansystem.com
ADMIN_PASSWORD=secure_password_here

# Application
APP_PORT=8080
THREAD_POOL_SIZE=10
QUEUE_CAPACITY=100
```

### 2.4 Save the File
```
Ctrl+S (or Cmd+S on Mac)
```

---

## Step 3: Create Database & Collections

### Method A: MongoDB Compass (Recommended for Beginners)

#### 3.1 Download MongoDB Compass
```
1. Go to: https://www.mongodb.com/products/compass
2. Download for your OS
3. Install and open
```

#### 3.2 Connect to Your Database
```
1. Click "New Connection"
2. Paste your MongoDB URI from step 1.5
3. Click "Connect"
4. You should see your cluster
```

#### 3.3 Create Database and Collections
```
1. Right-click on your cluster
2. Select "Create Database"
3. Database name: loan_management_db
4. Collection name: admins
5. Click "Create"
6. Repeat for collections: customers, loans, repayments
```

#### 3.4 Add Initial Admin User
```
1. Click on "admins" collection
2. Click "Insert Document"
3. Copy and paste this JSON:

{
  "username": "admin",
  "email": "admin@loansystem.com",
  "password": "admin123",
  "fullName": "System Administrator",
  "role": "ADMIN",
  "department": "Management",
  "isActive": true,
  "createdAt": {"$date": "2024-01-12T00:00:00.000Z"},
  "updatedAt": {"$date": "2024-01-12T00:00:00.000Z"}
}

4. Click "Insert"
```

### Method B: MongoDB Atlas UI (If you don't want Compass)

#### 3.1 Create Collections via Web UI
```
1. In MongoDB Atlas, click "Databases"
2. Click your cluster
3. Click "Collections" tab
4. Click "+ Create Database"
5. Name: loan_management_db
6. Create collections: admins, customers, loans, repayments
```

#### 3.2 Add Admin Document via Atlas
```
1. Click on "admins" collection
2. Click "Insert Document"
3. Add JSON (as shown above in Method A, step 3.4)
4. Click "Insert"
```

---

## Step 4: Install Java & Maven

### 4.1 Check Java Installation
```bash
# Open terminal/command prompt
java -version

# Should show Java 17 or higher
# If not installed, download from: https://www.oracle.com/java/technologies/downloads/
```

### 4.2 Check Maven Installation
```bash
mvn -version

# Should show Maven 3.6+
# If not installed, download from: https://maven.apache.org/download.cgi
```

---

## Step 5: Install Project Dependencies

### 5.1 Open Terminal/Command Prompt
```bash
# Navigate to project directory
cd "Loan Management System"
```

### 5.2 Run Maven Clean Install
```bash
mvn clean install
```

**Wait for it to complete** (2-5 minutes depending on internet)

You should see:
```
BUILD SUCCESS
```

If you see errors, check:
1. Java version (must be 17+)
2. Maven is installed correctly
3. Internet connection is working
4. .env file has correct MONGODB_URI

---

## Step 6: Start the Application

### 6.1 Run Spring Boot
```bash
mvn spring-boot:run
```

**Wait until you see:**
```
Started LoanManagementApplication in X.XXX seconds
```

### 6.2 Application is Running!
```
Your application is now running on:
http://localhost:8080
```

---

## Step 7: Access the Dashboard

### 7.1 Open Your Browser
```
Go to: http://localhost:8080/pages/login.html
```

### 7.2 Login with Default Credentials
```
Username: admin
Password: admin123
```

### 7.3 Welcome to Your Dashboard!
```
You should see the admin dashboard with:
- Customer statistics
- Loan statistics  
- Navigation menu
- All management features
```

---

## ✅ Verification Checklist

Make sure everything works:

### Frontend Check
- [ ] Login page loads at http://localhost:8080/pages/login.html
- [ ] Can enter username and password
- [ ] Can click login button

### Backend Check
```bash
# In another terminal, test API:
curl http://localhost:8080/api/customers

# Should return: [] (empty array, which is correct for new database)
```

### Database Check
- [ ] Can see "loan_management_db" in MongoDB Compass/Atlas
- [ ] Can see admin user in "admins" collection

---

## 🎉 Next Steps

### Start Using the System
1. Login with admin/admin123
2. Go to Customers → Add Customer
3. Create a test customer
4. Go to Loans → Add Loan
5. Create a test loan for the customer
6. Try approving/rejecting loans to test SMS setup

### (Optional) Setup SMS Notifications
1. Sign up with SMS provider:
   - Twilio: https://www.twilio.com
   - AWS SNS: https://aws.amazon.com/sns/
   - Or any other provider
2. Get your API key and endpoint
3. Update .env file:
   ```env
   SMS_API_KEY=your_actual_api_key
   SMS_API_URL=your_provider_api_endpoint
   ```
4. Restart the application

---

## 🐛 Troubleshooting

### Issue: mvn clean install fails
```bash
# Try clearing cache
mvn clean install -U
```

### Issue: Cannot connect to MongoDB
```
Check:
1. .env file has correct MONGODB_URI
2. IP address is whitelisted in MongoDB Atlas Network Access
3. Username and password are correct
4. Database exists in MongoDB Atlas
```

### Issue: Cannot login (after adding admin)
```
Check:
1. Admin user exists in MongoDB "admins" collection
2. Username exactly matches: "admin"
3. Password exactly matches: "admin123"
4. Restart the application
```

### Issue: Port 8080 already in use
```
Option 1: Stop the process using port 8080
Option 2: Edit application.properties:
   server.port=8081
Then access: http://localhost:8081/pages/login.html
```

### Issue: CSS/JS not loading (blank page)
```
Check:
1. Clear browser cache (Ctrl+F5)
2. Check browser console for errors
3. Ensure application is running (should see "BUILD SUCCESS")
4. Try a different browser
```

---

## 📞 Help & Documentation

### Read These If Stuck
1. **Quick reference**: QUICKSTART.md
2. **Full documentation**: README.md
3. **API examples**: API_EXAMPLES.md
4. **File locations**: FILE_INDEX.md
5. **What's completed**: COMPLETION_CHECKLIST.md

---

## 🎯 You're All Set!

Your Loan Management System is now ready to use. 

**Summary of what you have:**
- ✅ Complete Java/Spring Boot backend (27 API endpoints)
- ✅ Responsive admin dashboard
- ✅ MongoDB database integration
- ✅ SMS notification system (ready to activate)
- ✅ Comprehensive documentation

---

## 📋 Quick Reference Card

```
Project Directory: Loan Management System/

Main Commands:
  mvn clean install         → Install dependencies
  mvn spring-boot:run      → Start application
  
Access Points:
  Login:     http://localhost:8080/pages/login.html
  Dashboard: http://localhost:8080/pages/dashboard.html
  API:       http://localhost:8080/api

Default Login:
  Username: admin
  Password: admin123

Key Files:
  Configuration: .env
  Backend code: src/main/java/com/loanmanagement/
  Frontend code: src/main/webapp/
  Docs: README.md, QUICKSTART.md, API_EXAMPLES.md

MongoDB Collections:
  - admins      (admin users)
  - customers   (customer records)
  - loans       (loan applications)
  - repayments  (payment tracking)
```

---

**Congratulations! You're ready to use your Loan Management System! 🎉**

For detailed help, see README.md or QUICKSTART.md

---

**Created**: January 12, 2026  
**Version**: 1.0.0  
**Status**: Ready to Use
