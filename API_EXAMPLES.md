# API Usage Examples

## Base URL
```
http://localhost:8080/api
```

## Authentication Endpoints

### 1. Admin Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response (200):
{
  "message": "Login successful",
  "adminId": "507f1f77bcf86cd799439011",
  "username": "admin",
  "fullName": "System Administrator",
  "email": "admin@loansystem.com"
}
```

### 2. Register New Admin
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "newadmin",
  "email": "newadmin@loansystem.com",
  "password": "securepassword",
  "fullName": "New Administrator",
  "role": "ADMIN",
  "department": "Loan Management"
}

Response (201):
{
  "id": "507f1f77bcf86cd799439012",
  "username": "newadmin",
  "email": "newadmin@loansystem.com",
  "fullName": "New Administrator",
  "role": "ADMIN",
  "isActive": true
}
```

## Customer Endpoints

### 1. Create Customer
```bash
POST /api/customers
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "9876543210",
  "address": "123 Main Street",
  "city": "New Delhi",
  "state": "Delhi",
  "zipCode": "110001",
  "idProofType": "AADHAR",
  "idProofNumber": "1234-5678-9012",
  "annualIncome": 500000,
  "employmentType": "EMPLOYED",
  "companyName": "Tech Corp",
  "dateOfBirth": "1990-01-15"
}

Response (201):
{
  "id": "507f1f77bcf86cd799439013",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "9876543210",
  "isActive": true,
  "createdAt": "2024-01-12T10:30:00Z",
  "updatedAt": "2024-01-12T10:30:00Z"
}
```

### 2. Get All Customers
```bash
GET /api/customers

Response (200):
[
  {
    "id": "507f1f77bcf86cd799439013",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "9876543210",
    "city": "New Delhi",
    "annualIncome": 500000,
    "isActive": true
  }
]
```

### 3. Get Customer by ID
```bash
GET /api/customers/507f1f77bcf86cd799439013

Response (200):
{
  "id": "507f1f77bcf86cd799439013",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "9876543210",
  "address": "123 Main Street",
  "city": "New Delhi",
  "state": "Delhi",
  "zipCode": "110001",
  "idProofType": "AADHAR",
  "idProofNumber": "1234-5678-9012",
  "annualIncome": 500000,
  "employmentType": "EMPLOYED",
  "companyName": "Tech Corp",
  "dateOfBirth": "1990-01-15",
  "isActive": true,
  "createdAt": "2024-01-12T10:30:00Z"
}
```

### 4. Update Customer
```bash
PUT /api/customers/507f1f77bcf86cd799439013
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@newemail.com",
  "phoneNumber": "9876543210",
  "city": "Bangalore",
  "annualIncome": 600000
}

Response (200):
{
  "id": "507f1f77bcf86cd799439013",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@newemail.com",
  "updatedAt": "2024-01-12T11:00:00Z"
}
```

### 5. Delete Customer
```bash
DELETE /api/customers/507f1f77bcf86cd799439013

Response (200):
{
  "message": "Customer deleted successfully"
}
```

## Loan Endpoints

### 1. Create Loan
```bash
POST /api/loans
Content-Type: application/json

{
  "customerId": "507f1f77bcf86cd799439013",
  "loanAmount": 500000,
  "interestRate": 8.5,
  "loanTerm": 60,
  "loanType": "PERSONAL",
  "purpose": "Home Renovation"
}

Response (201):
{
  "id": "507f1f77bcf86cd799439014",
  "customerId": "507f1f77bcf86cd799439013",
  "loanAmount": 500000,
  "interestRate": 8.5,
  "loanTerm": 60,
  "loanType": "PERSONAL",
  "purpose": "Home Renovation",
  "status": "PENDING",
  "monthlyInstallment": 9733.45,
  "remainingInstallments": 60,
  "applicationDate": "2024-01-12T10:30:00Z"
}
```

### 2. Get All Loans
```bash
GET /api/loans

Response (200):
[
  {
    "id": "507f1f77bcf86cd799439014",
    "customerId": "507f1f77bcf86cd799439013",
    "loanAmount": 500000,
    "loanType": "PERSONAL",
    "status": "PENDING",
    "applicationDate": "2024-01-12T10:30:00Z"
  }
]
```

### 3. Get Pending Loans
```bash
GET /api/loans/pending/all

Response (200):
[
  {
    "id": "507f1f77bcf86cd799439014",
    "customerId": "507f1f77bcf86cd799439013",
    "loanAmount": 500000,
    "status": "PENDING"
  }
]
```

### 4. Approve Loan (Triggers SMS)
```bash
POST /api/loans/507f1f77bcf86cd799439014/approve
Content-Type: application/json

{
  "approvedBy": "admin",
  "phoneNumber": "9876543210",
  "customerName": "John Doe"
}

Response (200):
{
  "id": "507f1f77bcf86cd799439014",
  "status": "APPROVED",
  "approvalDate": "2024-01-12T11:00:00Z",
  "approvedBy": "admin"
}

SMS Sent:
"Dear John Doe, Your loan application (ID: 507f1f77bcf86cd799439014) 
for amount ₹500000 has been APPROVED. Please visit our office to 
complete the formalities. Thank you!"
```

### 5. Reject Loan (Triggers SMS)
```bash
POST /api/loans/507f1f77bcf86cd799439014/reject
Content-Type: application/json

{
  "reason": "Insufficient income verification",
  "phoneNumber": "9876543210",
  "customerName": "John Doe"
}

Response (200):
{
  "id": "507f1f77bcf86cd799439014",
  "status": "REJECTED",
  "rejectionReason": "Insufficient income verification"
}

SMS Sent:
"Dear John Doe, We regret to inform that your loan application 
(ID: 507f1f77bcf86cd799439014) has been REJECTED. 
Reason: Insufficient income verification. Thank you!"
```

## Repayment Endpoints

### 1. Create Repayment
```bash
POST /api/repayments
Content-Type: application/json

{
  "loanId": "507f1f77bcf86cd799439014",
  "customerId": "507f1f77bcf86cd799439013",
  "installmentAmount": 9733.45,
  "installmentNumber": 1,
  "dueDate": "2024-02-12"
}

Response (201):
{
  "id": "507f1f77bcf86cd799439015",
  "loanId": "507f1f77bcf86cd799439014",
  "customerId": "507f1f77bcf86cd799439013",
  "installmentAmount": 9733.45,
  "status": "PENDING",
  "dueDate": "2024-02-12",
  "installmentNumber": 1
}
```

### 2. Get Pending Repayments
```bash
GET /api/repayments/status/pending/list

Response (200):
[
  {
    "id": "507f1f77bcf86cd799439015",
    "loanId": "507f1f77bcf86cd799439014",
    "customerId": "507f1f77bcf86cd799439013",
    "installmentAmount": 9733.45,
    "status": "PENDING",
    "dueDate": "2024-02-12"
  }
]
```

### 3. Mark Repayment as Paid (Triggers SMS)
```bash
POST /api/repayments/507f1f77bcf86cd799439015/pay
Content-Type: application/json

{
  "amountPaid": 9733.45,
  "phoneNumber": "9876543210",
  "customerName": "John Doe"
}

Response (200):
{
  "id": "507f1f77bcf86cd799439015",
  "status": "PAID",
  "amountPaid": 9733.45,
  "paidDate": "2024-01-12T15:30:00Z"
}

SMS Sent:
"Dear John Doe, Your loan installment payment of ₹9733.45 has been 
successfully received on 2024-01-12. Thank you for your timely payment!"
```

### 4. Get Overdue Repayments
```bash
GET /api/repayments/status/overdue/list

Response (200):
[
  {
    "id": "507f1f77bcf86cd799439016",
    "status": "OVERDUE",
    "penalty": 486.67
  }
]
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Failed to create customer: Invalid email format"
}
```

### 404 Not Found
```json
{
  "error": "Customer not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "An error occurred while processing your request"
}
```

## Testing with cURL

### Save as test-api.sh
```bash
#!/bin/bash

BASE_URL="http://localhost:8080/api"

# Login
curl -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get customers
curl -X GET $BASE_URL/customers

# Get pending loans
curl -X GET $BASE_URL/loans/pending/all

# Get pending repayments
curl -X GET $BASE_URL/repayments/status/pending/list
```

## Testing with Postman

1. Download Postman from https://www.postman.com/downloads/
2. Import collection from provided JSON file
3. Set environment variables:
   - `baseUrl`: http://localhost:8080/api
   - `adminId`: Your admin ID
4. Run requests from collection

---

For more details, see README.md and project documentation.
