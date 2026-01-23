# Quick Start Guide - Loan Management System

## ⚡ 5-Minute Setup

### Step 1: Setup MongoDB Atlas
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and login
3. Create a new project
4. Click "Build a Database"
5. Select "Free" tier (M0)
6. Choose AWS and US region
7. Name your cluster: "loan-management"
8. Click Create Cluster (takes 1-2 minutes)
9. Go to Database Access → Add New Database User
   - Username: your_username
   - Password: your_secure_password
   - Click "Add User"
10. Go to Network Access → Add IP Address
    - Click "Add My Current IP Address"
    - Or click "Allow Access from Anywhere"
11. Click "Databases" → "Connect"
12. Choose "Connect your application"
13. Select Java and copy the connection string
```

### Step 2: Configure Environment Variables
```
1. Open .env file in the project root
2. Find MONGODB_URI line
3. Replace with your connection string:
   MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/loan_management_db?retryWrites=true&w=majority
4. Save the file
```

### Step 3: Install Dependencies
```bash
mvn clean install
```

### Step 4: Run the Application
```bash
mvn spring-boot:run
```

### Step 5: Access the Application
```
Open browser and go to:
http://localhost:8080/pages/login.html
```

## 📋 Default Admin Credentials

First, you need to add an admin user to MongoDB:

### Option 1: Using MongoDB Compass (Recommended)
```
1. Download MongoDB Compass from https://www.mongodb.com/products/compass
2. Connect using your MongoDB URI from Atlas
3. Create database: loan_management_db
4. Create collection: admins
5. Add document:
{
  "username": "admin",
  "email": "admin@loansystem.com",
  "password": "admin123",
  "fullName": "System Administrator",
  "role": "ADMIN",
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

### Option 2: Using MongoDB Atlas UI
```
1. Click "Collections" in your cluster
2. Create database "loan_management_db"
3. Create collection "admins"
4. Click "Insert Document"
5. Add the JSON document above
```

## 🔑 Login to Dashboard
```
Username: admin
Password: admin123
URL: http://localhost:8080/pages/dashboard.html
```

## 📱 SMS Configuration (Optional)

For SMS notifications to work:
1. Sign up with SMS provider (Twilio, AWS SNS, etc.)
2. Get API Key and API URL
3. Update .env file:
   ```
   SMS_API_KEY=your_api_key
   SMS_API_URL=https://your-sms-provider.com/send
   SMS_SENDER_ID=YourCompanyName
   ```

Without SMS configuration, the application still works perfectly - just SMS notifications won't be sent.

## ✅ Verify Setup

### Check if application is running:
- Open browser: http://localhost:8080/pages/login.html
- Should see login page

### Test API:
```bash
curl http://localhost:8080/api/customers
```

Should return an empty array if no customers exist yet.

## 🐛 Troubleshooting

### Issue: Cannot connect to MongoDB
```
Solution:
1. Check MONGODB_URI in .env file
2. Verify MongoDB Atlas IP whitelist includes your IP
3. Check username and password are correct
4. Ensure database user has read/write permissions
```

### Issue: Application won't start
```
Solution:
1. Ensure Java 17+ is installed: java -version
2. Ensure Maven is installed: mvn -version
3. Check for error messages in terminal
4. Try: mvn clean install -U
```

### Issue: Cannot login
```
Solution:
1. Verify admin user exists in MongoDB admins collection
2. Check username and password exactly match
3. Check case sensitivity (admin vs Admin)
4. Clear browser cache and try again
```

### Issue: Port 8080 already in use
```
Solution:
Option 1: Kill process using port 8080
Option 2: Change port in application.properties
   server.port=8081
```

## 📚 Documentation

- **Full Documentation**: See README.md
- **API Endpoints**: See README.md - API Endpoints section
- **Database Models**: See README.md - Database Models section
- **Project Structure**: See README.md - Project Structure section

## 🚀 Next Steps

1. **Create Customers**: Use Dashboard → Customers → Add Customer
2. **Create Loans**: Use Dashboard → Loans → Add Loan
3. **Approve/Reject Loans**: Use Dashboard → Loans → Action buttons
4. **Track Repayments**: Use Dashboard → Repayments
5. **View Reports**: Use Dashboard → Reports

## 📞 Support

If you encounter any issues:
1. Check README.md Troubleshooting section
2. Review console logs for error messages
3. Ensure all configuration is correct
4. Check MongoDB connection is working

---

**Happy Coding! 🎉**

For detailed documentation, please see README.md
