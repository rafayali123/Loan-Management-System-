# MongoDB Setup - Complete Guide for Your Connection

## ✅ Configuration Complete!

Your MongoDB Atlas connection string has been successfully added to the `.env` file:

```
MONGODB_URI=mongodb+srv://alisyedabdulrafay7_db_user:v6kUnFf68uo49NR6@cluster0.4vvrwmj.mongodb.net/loan_management_db?retryWrites=true&w=majority
MONGODB_DATABASE=loan_management_db
```

---

## 🚀 Next Steps - Create Collections and Add Admin User

### Option 1: Using MongoDB Compass (GUI - Recommended)

**Step 1: Download MongoDB Compass**
- Go to: https://www.mongodb.com/products/compass
- Download and install the application
- Launch MongoDB Compass

**Step 2: Connect to Your Cluster**
1. Click **New Connection**
2. Paste your connection string:
   ```
   mongodb+srv://alisyedabdulrafay7_db_user:v6kUnFf68uo49NR6@cluster0.4vvrwmj.mongodb.net/loan_management_db
   ```
3. Click **Connect**

**Step 3: Create Collections**
1. Right-click on **loan_management_db** in left panel
2. Select **Create Collection**
3. Create these 4 collections:
   - `admins`
   - `customers`
   - `loans`
   - `repayments`

**Step 4: Add Default Admin User**
1. Click on **admins** collection
2. Click **Add Data** → **Insert Document**
3. Paste this JSON:

```json
{
  "_id": { "$oid": "65a123456789012345678901" },
  "username": "admin",
  "password": "admin123",
  "fullName": "System Administrator",
  "email": "admin@loansystem.com",
  "phoneNumber": "+919876543210",
  "isActive": true,
  "createdAt": { "$date": "2026-01-12T00:00:00Z" },
  "updatedAt": { "$date": "2026-01-12T00:00:00Z" },
  "lastLogin": null
}
```

4. Click **Insert**

---

### Option 2: Using MongoDB Shell (Terminal)

**Step 1: Download MongoDB Shell**
- Go to: https://www.mongodb.com/try/download/shell
- Download and install
- Add to PATH or use full path

**Step 2: Open Terminal and Run**

```powershell
# Connect to MongoDB Atlas
mongosh "mongodb+srv://alisyedabdulrafay7_db_user:v6kUnFf68uo49NR6@cluster0.4vvrwmj.mongodb.net/loan_management_db"
```

**Step 3: Create Collections and Add Admin**

```javascript
// Create collections
db.createCollection("admins")
db.createCollection("customers")
db.createCollection("loans")
db.createCollection("repayments")

// Add default admin user
db.admins.insertOne({
  "username": "admin",
  "password": "admin123",
  "fullName": "System Administrator",
  "email": "admin@loansystem.com",
  "phoneNumber": "+919876543210",
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date(),
  "lastLogin": null
})

// Verify insertion
db.admins.find()

// Exit
exit()
```

---

## 🔄 Restart Application with New Configuration

### Step 1: Stop Current Application
1. Find the terminal running `mvn spring-boot:run`
2. Press **Ctrl + C** multiple times to stop it

### Step 2: Restart with New Configuration

Open a **NEW PowerShell terminal** and run:

```powershell
cd "D:\Loan Management System"

# Set Maven environment
$tempDir = [System.IO.Path]::GetTempPath()
$env:MAVEN_HOME = "$tempDir\maven-extract\apache-maven-3.9.5"
$env:PATH = "$env:MAVEN_HOME\bin;$env:PATH"

# Start application (will use new .env configuration)
mvn spring-boot:run
```

You should see:
```
Started LoanManagementApplication in X.XXX seconds
```

---

## 🌐 Access Your Application

### Open Dashboard
1. Open your browser
2. Go to: **http://localhost:8080/pages/login.html**

### Login
- **Username:** `admin`
- **Password:** `admin123`

---

## ✅ Verification Checklist

After setup, verify these are working:

- [ ] MongoDB Compass connects to your cluster
- [ ] Collections created: admins, customers, loans, repayments
- [ ] Admin user inserted in `admins` collection
- [ ] Application started successfully (no connection errors)
- [ ] Can login to dashboard with admin/admin123
- [ ] Dashboard loads without errors

---

## 🆘 Troubleshooting

### Issue: "Failed looking up SRV record"
**Solution:** Make sure:
1. You've stopped the old application (Ctrl+C)
2. .env file was updated correctly (check it!)
3. Wait 10 seconds for DNS to update
4. Restart the application

### Issue: "Cannot connect to MongoDB"
**Solution:**
1. Verify connection string is correct in .env
2. Check IP whitelist in MongoDB Atlas:
   - Go to MongoDB Atlas → Network Access
   - Ensure your IP is whitelisted (or use "Allow Anywhere")
3. Verify database user exists with correct password

### Issue: Login fails
**Solution:**
1. Check if admin user was inserted: Use MongoDB Compass or mongosh
2. Verify database name is correct: `loan_management_db`
3. Verify collection name is correct: `admins`

### Issue: Port 8080 already in use
**Solution:**
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Then restart
```

---

## 📋 MongoDB Collection Schemas

### admins Collection
```json
{
  "_id": ObjectId,
  "username": String,
  "password": String,
  "fullName": String,
  "email": String,
  "phoneNumber": String,
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date,
  "lastLogin": Date (nullable)
}
```

### customers Collection
```json
{
  "_id": ObjectId,
  "firstName": String,
  "lastName": String,
  "email": String,
  "phoneNumber": String,
  "address": String,
  "city": String,
  "state": String,
  "pincode": String,
  "monthlyIncome": Double,
  "employmentType": String,
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}
```

### loans Collection
```json
{
  "_id": ObjectId,
  "customerId": ObjectId (Reference to customers._id),
  "loanType": String,
  "principalAmount": Double,
  "interestRate": Double,
  "loanTenureMonths": Integer,
  "monthlyEMI": Double,
  "status": String (PENDING, APPROVED, REJECTED, CLOSED),
  "approvalDate": Date (nullable),
  "rejectionReason": String (nullable),
  "remainingInstallments": Integer,
  "createdAt": Date,
  "updatedAt": Date
}
```

### repayments Collection
```json
{
  "_id": ObjectId,
  "loanId": ObjectId (Reference to loans._id),
  "customerId": ObjectId (Reference to customers._id),
  "installmentNumber": Integer,
  "dueDate": Date,
  "amount": Double,
  "status": String (PENDING, PAID, OVERDUE),
  "paidDate": Date (nullable),
  "penaltyAmount": Double,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 📞 Quick Reference

**MongoDB Atlas Cluster:** cluster0.4vvrwmj.mongodb.net  
**Database:** loan_management_db  
**Username:** alisyedabdulrafay7_db_user  
**Application URL:** http://localhost:8080/pages/login.html  
**Default Credentials:** admin / admin123  

---

## ✨ What Happens Next

Once everything is configured:

1. **Dashboard Access** - Full admin interface
2. **Customer Management** - Add and manage customers
3. **Loan Management** - Create and track loans
4. **Repayment Tracking** - Monitor payments
5. **SMS Notifications** - Loan approvals, reminders, etc.
6. **Reports** - View system statistics

---

**Everything is ready to go! Follow these steps and you'll be up and running! 🚀**

