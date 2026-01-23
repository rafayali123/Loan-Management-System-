## Dual User Authentication System - Complete Setup Guide

### **System Architecture**

#### **Two Separate User Types:**
1. **ADMIN** - Loan Management System Administrator
2. **CUSTOMER** - Loan Applicant/Customer

---

### **API Endpoints**

#### **Authentication:**
```
POST /api/auth/login
- Accepts: {username, password}
- Returns: {userId, userName, email, userType, userUsername}
- User Type: "ADMIN" or "CUSTOMER"

POST /api/auth/register/admin
- Create Admin Account
- Fields: username, password, fullName, email, phoneNumber

POST /api/auth/register/customer
- Create Customer Account
- Fields: username, password, firstName, lastName, email, phoneNumber, address, city, state, zipCode, idProofType, idProofNumber, employmentType, annualIncome, dateOfBirth, companyName
```

---

### **Frontend Pages**

#### **Registration Pages:**
| Page | URL | Purpose |
|------|-----|---------|
| Admin Registration | `/pages/register.html` | Admin account creation |
| Customer Registration | `/pages/customer-register.html` | Customer account creation |
| Login | `/pages/login.html` | Both Admin & Customer login |

#### **Dashboard Pages:**
| Page | URL | User Type | Features |
|------|-----|-----------|----------|
| Admin Dashboard | `/pages/dashboard.html` | ADMIN | Manage customers, loans, repayments, notifications |
| Customer Dashboard | `/pages/customer-dashboard.html` | CUSTOMER | Apply for loans, view loans, track repayments, manage profile |

---

### **Session Management**

#### **Session Storage Keys:**
```javascript
// All Users
userId          // User's unique ID
userName        // User's full name
userEmail       // User's email
userUsername    // User's username
userType        // "ADMIN" or "CUSTOMER"
```

#### **Automatic Redirects:**
```javascript
ADMIN Login      → /pages/dashboard.html
CUSTOMER Login   → /pages/customer-dashboard.html
Non-logged-in    → /pages/login.html
Admin accessing customer page → /pages/customer-dashboard.html → redirected to login
Customer accessing admin page → /pages/dashboard.html → redirected to customer dashboard
```

---

### **Admin Dashboard Features**

**Navigation Items:**
- Dashboard - View statistics and summaries
- Customers - Manage customer accounts
- Loans - Review and approve/reject loan applications
- Repayments - Track payment history
- Notifications - SMS notifications
- Reports - Generate reports
- Settings - System configuration

**Purpose:** Administrative control and loan management

---

### **Customer Dashboard Features**

**Navigation Items:**
- Dashboard - View loan statistics and pending repayments
- My Loans - View all loan applications and their status
- Apply for Loan - Submit new loan application
- Repayments - View payment history and schedule
- Profile - View personal and employment information

**Purpose:** Self-service loan application and management

---

### **Testing Workflow**

#### **Step 1: Admin Registration**
```
Navigate to: http://localhost:8080/pages/register.html
Fill: Admin details (username, password, name, email, phone)
Submit: Create Admin Account
Redirect: Login Page
```

#### **Step 2: Admin Login**
```
Navigate to: http://localhost:8080/pages/login.html
Enter: Admin username & password
Click: Login
Redirect: /pages/dashboard.html (Admin Dashboard)
```

#### **Step 3: Customer Registration**
```
Navigate to: http://localhost:8080/pages/customer-register.html
Fill: Customer details (username, password, name, email, address, income, etc.)
Submit: Create Customer Account
Redirect: Login Page
```

#### **Step 4: Customer Login**
```
Navigate to: http://localhost:8080/pages/login.html
Enter: Customer username & password
Click: Login
Redirect: /pages/customer-dashboard.html (Customer Dashboard)
```

---

### **Key JavaScript Functions**

#### **login.js**
```javascript
checkExistingSession()       // Verify if user is already logged in
setupLoginForm()            // Handle login form submission
setupRememberMe()           // Store username in localStorage
```

#### **dashboard.js** (Admin)
```javascript
checkAdminSession()         // Verify ADMIN access only
initializeNavigation()      // Setup menu navigation
loadDashboardData()         // Load admin statistics
logout()                    // Clear session and logout
```

#### **customer-dashboard.js** (Customer)
```javascript
checkCustomerSession()      // Verify CUSTOMER access only
loadCustomerProfile()       // Fetch and display customer info
loadDashboardData()         // Load customer statistics
loadLoansTable()            // Display customer's loans
submitLoanApplication()     // Submit new loan application
logoutCustomer()            // Clear session and logout
```

---

### **Security Features**

✅ **Role-Based Access Control (RBAC)**
- Admin can only access admin dashboard
- Customer can only access customer dashboard
- Non-logged-in users redirected to login

✅ **Session Storage**
- Data stored in browser session (cleared on browser close)
- Not persisted in localStorage for security

✅ **User Type Verification**
- Every page checks user type before loading
- Automatic redirect if wrong user type

✅ **Logout Functionality**
- Clears all session data
- Redirects to login page

---

### **Database Schema**

#### **Customers Collection:**
```
- id (String)
- username (String) - UNIQUE
- password (String)
- firstName (String)
- lastName (String)
- email (String) - UNIQUE
- phoneNumber (String)
- address (String)
- city (String)
- state (String)
- zipCode (String)
- idProofType (String)
- idProofNumber (String)
- dateOfBirth (Date)
- annualIncome (Number)
- employmentType (String)
- companyName (String)
- isActive (Boolean)
- createdAt (Date)
- updatedAt (Date)
- lastLogin (Date)
```

#### **Admins Collection:**
```
- id (String)
- username (String) - UNIQUE
- password (String)
- fullName (String)
- email (String) - UNIQUE
- phoneNumber (String)
- position (String)
- isActive (Boolean)
- createdAt (Date)
- updatedAt (Date)
- lastLogin (Date)
```

---

### **Styling & Theme**

**Color Scheme:**
```css
--primary-color: #2563eb       /* Blue */
--secondary-color: #1e40af     /* Dark Blue */
--success-color: #10b981       /* Green */
--warning-color: #f59e0b       /* Amber */
--danger-color: #ef4444        /* Red */
--light-bg: #f9fafb            /* Light Gray */
--dark-text: #1f2937           /* Dark Gray */
```

**Common Components:**
- Sidebar Navigation with gradient background
- Top header with user profile
- Card-based statistics
- Table layouts for data display
- Responsive design for mobile devices

---

### **Error Handling**

| Scenario | Action |
|----------|--------|
| Invalid credentials | Show error message, keep at login page |
| Session expired | Redirect to login page |
| Wrong user type | Redirect to correct dashboard |
| Missing required fields | Form validation + error messages |
| Network error | Display error alert and allow retry |
| Duplicate username | Show error and prevent registration |

---

### **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| Customer sees admin dashboard | Check login.js redirects. Verify userType in session |
| Login not working | Ensure AuthController has both login methods |
| Dashboard won't load | Check session storage has userId and userType |
| Logout not working | Verify logout functions clear sessionStorage correctly |
| Styling issues | Check if CSS files are properly linked in HTML |

---

### **Next Steps (Optional Enhancements)**

- [ ] Add password reset functionality
- [ ] Implement two-factor authentication
- [ ] Add email verification for registration
- [ ] Create admin user management panel
- [ ] Add loan document upload feature
- [ ] Implement payment gateway integration
- [ ] Add notification preferences
- [ ] Create audit logging system
- [ ] Add export/print functionality
- [ ] Implement real-time notifications using WebSockets

---

**Version:** 1.0.0  
**Last Updated:** January 15, 2026  
**Status:** Production Ready ✅
