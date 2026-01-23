# MongoDB Compass - Visual Setup Guide

## 📥 Installation

1. Download from: https://www.mongodb.com/products/compass
2. Install the application
3. Launch MongoDB Compass

---

## 🔌 Connection Setup

### Step 1: Open MongoDB Compass
Click **New Connection** button

### Step 2: Paste Connection String
In the connection string field, paste:
```
mongodb+srv://alisyedabdulrafay7_db_user:v6kUnFf68uo49NR6@cluster0.4vvrwmj.mongodb.net/loan_management_db
```

### Step 3: Connect
Click the **Connect** button

You should see your database listed on the left!

---

## 📂 Create Collections

### In the left panel:
1. Look for **loan_management_db**
2. Right-click on it
3. Select **Create Collection**

### Create These Collections (One by One):
1. **admins** - for admin users
2. **customers** - for loan customers
3. **loans** - for loan applications
4. **repayments** - for repayment tracking

---

## 👤 Add Default Admin User

### Step 1: Select admins Collection
Click on the **admins** collection in the left panel

### Step 2: Click "Add Data"
You'll see a green button labeled **+ INSERT DOCUMENT**

Click it!

### Step 3: Paste JSON Data
Replace the template with this JSON:

```json
{
  "_id": "admin_001",
  "username": "admin",
  "password": "admin123",
  "fullName": "System Administrator",
  "email": "admin@loansystem.com",
  "phoneNumber": "+919876543210",
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date(),
  "lastLogin": null
}
```

### Step 4: Click "Insert"
Green **INSERT** button at bottom

✅ Admin user created!

---

## 🔍 Verify Setup

To check if everything is set up correctly:

### View Admin Users
1. Click on **admins** collection
2. You should see 1 document (your admin user)

### Check Collections Exist
In left panel under loan_management_db, you should see:
- ✅ admins
- ✅ customers
- ✅ loans
- ✅ repayments

---

## 🎯 Next: Restart Application

Once MongoDB is set up:

1. Open **NEW PowerShell terminal**
2. Run these commands:

```powershell
cd "D:\Loan Management System"

# Set Maven paths
$tempDir = [System.IO.Path]::GetTempPath()
$env:MAVEN_HOME = "$tempDir\maven-extract\apache-maven-3.9.5"
$env:PATH = "$env:MAVEN_HOME\bin;$env:PATH"

# Start application
mvn spring-boot:run
```

3. Wait for: `Started LoanManagementApplication in X seconds`

---

## 🌐 Login to Dashboard

1. Open browser
2. Go to: http://localhost:8080/pages/login.html
3. Login:
   - Username: **admin**
   - Password: **admin123**

🎉 You're in!

---

## 📝 Sample Data to Add (Optional)

Once you're in the dashboard, you can add:

### Sample Customer:
```json
{
  "firstName": "Rajesh",
  "lastName": "Kumar",
  "email": "rajesh@email.com",
  "phoneNumber": "+919876543210",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "monthlyIncome": 50000,
  "employmentType": "Salaried",
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

Add to **customers** collection using same method!

---

## ✅ Quick Checklist

- [ ] MongoDB Compass installed
- [ ] Connected to MongoDB Atlas
- [ ] Created 4 collections
- [ ] Added admin user
- [ ] Restarted application
- [ ] Application running on port 8080
- [ ] Accessed login page
- [ ] Logged in successfully

Once all checked, you're ready to use the system! 🚀

