# Loan Management System with SMS Notification

A comprehensive Java-based Loan Management System designed to manage loan applications, customer records, repayments, and automated SMS notifications using MongoDB as the database and multithreading for background operations.

## Project Features

✅ **Customer Management** - Add, update, delete, and manage customer records with comprehensive KYC details
✅ **Loan Management** - Create, approve, reject loan applications with automated calculations
✅ **Repayment Tracking** - Monitor installments, mark payments, track overdue loans
✅ **SMS Notifications** - Async SMS notifications for loan approval/rejection and payment reminders
✅ **Admin Dashboard** - Responsive web-based admin dashboard for system management
✅ **MongoDB Integration** - MongoDB Atlas integration for secure cloud database storage
✅ **Multithreading** - Thread pool configuration for handling background SMS notifications
✅ **RESTful APIs** - Complete REST API endpoints for all operations
✅ **Responsive UI** - Mobile-friendly dashboard with responsive design

## Tech Stack

### Backend
- **Java 17** - Core programming language
- **Spring Boot 3.1.5** - Framework for rapid application development
- **Spring Data MongoDB** - MongoDB integration with Spring
- **MongoDB** - NoSQL database (MongoDB Atlas)

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with responsive design
- **JavaScript (ES6+)** - Interactive frontend functionality
- **Responsive Design** - Mobile-first approach

### Database
- **MongoDB Atlas** - Cloud-hosted MongoDB instance
- **Collections**: customers, loans, repayments, admins

### Additional Libraries
- **java-dotenv** - Environment variable management
- **SLF4J** - Logging framework

## Project Structure

```
Loan Management System/
├── src/
│   ├── main/
│   │   ├── java/com/loanmanagement/
│   │   │   ├── config/
│   │   │   │   ├── MongoDBConfig.java       # MongoDB configuration
│   │   │   │   └── ThreadPoolConfig.java    # Thread pool setup
│   │   │   ├── model/
│   │   │   │   ├── Customer.java
│   │   │   │   ├── Loan.java
│   │   │   │   ├── Repayment.java
│   │   │   │   └── Admin.java
│   │   │   ├── repository/
│   │   │   │   ├── CustomerRepository.java
│   │   │   │   ├── LoanRepository.java
│   │   │   │   ├── RepaymentRepository.java
│   │   │   │   └── AdminRepository.java
│   │   │   ├── service/
│   │   │   │   ├── CustomerService.java
│   │   │   │   ├── LoanService.java
│   │   │   │   ├── RepaymentService.java
│   │   │   │   ├── AdminService.java
│   │   │   │   └── SMSNotificationService.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── CustomerController.java
│   │   │   │   ├── LoanController.java
│   │   │   │   └── RepaymentController.java
│   │   │   └── LoanManagementApplication.java
│   │   ├── resources/
│   │   │   └── application.properties
│   │   └── webapp/
│   │       ├── pages/
│   │       │   ├── login.html
│   │       │   └── dashboard.html
│   │       └── static/
│   │           ├── css/
│   │           │   ├── styles.css
│   │           │   └── responsive.css
│   │           ├── js/
│   │           │   ├── login.js
│   │           │   └── dashboard.js
│   │           └── images/
├── .env                    # Environment variables
├── pom.xml                 # Maven configuration
└── README.md              # This file
```

## Prerequisites

- **Java Development Kit (JDK) 17+**
- **Maven 3.6+**
- **MongoDB Atlas Account** (or local MongoDB)
- **Git** (for version control)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

## Installation & Setup

### 1. Clone/Download the Project
```bash
git clone <repository-url>
cd "Loan Management System"
```

### 2. Configure MongoDB Atlas

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string from the cluster dashboard
4. Create a database user with read/write permissions

### 3. Setup Environment Variables

Update the `.env` file in the project root with your credentials:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/loan_management_db?retryWrites=true&w=majority
MONGODB_DATABASE=loan_management_db

# SMS API Configuration
SMS_API_KEY=your_sms_provider_api_key
SMS_API_URL=https://api.sms-provider.com/send
SMS_SENDER_ID=LoanMgmt

# Admin Configuration
ADMIN_EMAIL=admin@loansystem.com
ADMIN_PASSWORD=secure_password

# Application Settings
APP_PORT=8080
THREAD_POOL_SIZE=10
QUEUE_CAPACITY=100
```

### 4. Build the Project

```bash
mvn clean install
```

### 5. Run the Application

```bash
mvn spring-boot:run
```

Or build and run the JAR:
```bash
mvn clean package
java -jar target/loan-management-system-1.0.0.jar
```

### 6. Access the Application

- **Login Page**: [http://localhost:8080/pages/login.html](http://localhost:8080/pages/login.html)
- **API Base URL**: [http://localhost:8080/api](http://localhost:8080/api)

## Database Models

### Customer Schema
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "idProofType": "string",
  "idProofNumber": "string",
  "annualIncome": "number",
  "employmentType": "string",
  "companyName": "string",
  "dateOfBirth": "date",
  "isActive": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Loan Schema
```json
{
  "customerId": "ObjectId",
  "loanAmount": "number",
  "interestRate": "number",
  "loanTerm": "number (months)",
  "loanType": "PERSONAL | HOME | AUTO | EDUCATION",
  "purpose": "string",
  "status": "PENDING | APPROVED | REJECTED | CLOSED",
  "monthlyInstallment": "number",
  "remainingInstallments": "number",
  "applicationDate": "date",
  "approvalDate": "date",
  "loanStartDate": "date",
  "loanEndDate": "date",
  "rejectionReason": "string",
  "approvedBy": "string"
}
```

### Repayment Schema
```json
{
  "loanId": "ObjectId",
  "customerId": "ObjectId",
  "installmentAmount": "number",
  "amountPaid": "number",
  "status": "PENDING | PAID | OVERDUE",
  "dueDate": "date",
  "paidDate": "date",
  "installmentNumber": "number",
  "penalty": "number",
  "remarks": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/logout` - Logout

### Customers
- `GET /api/customers` - Get all active customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer
- `GET /api/customers/email/{email}` - Get customer by email
- `PUT /api/customers/{id}/activate` - Activate customer
- `PUT /api/customers/{id}/deactivate` - Deactivate customer

### Loans
- `GET /api/loans` - Get all loans
- `GET /api/loans/{id}` - Get loan by ID
- `POST /api/loans` - Create new loan
- `PUT /api/loans/{id}` - Update loan
- `DELETE /api/loans/{id}` - Delete loan
- `GET /api/loans/pending/all` - Get pending loans
- `GET /api/loans/approved/all` - Get approved loans
- `POST /api/loans/{id}/approve` - Approve loan (triggers SMS)
- `POST /api/loans/{id}/reject` - Reject loan (triggers SMS)

### Repayments
- `GET /api/repayments` - Get all repayments
- `GET /api/repayments/{id}` - Get repayment by ID
- `POST /api/repayments` - Create new repayment
- `PUT /api/repayments/{id}` - Update repayment
- `DELETE /api/repayments/{id}` - Delete repayment
- `GET /api/repayments/loan/{loanId}` - Get repayments by loan
- `GET /api/repayments/status/pending/list` - Get pending repayments
- `GET /api/repayments/status/overdue/list` - Get overdue repayments
- `POST /api/repayments/{id}/pay` - Mark repayment as paid (triggers SMS)
- `POST /api/repayments/{id}/overdue` - Mark as overdue (triggers SMS)

## SMS Notification Features

The system automatically sends SMS notifications for:

1. **Loan Approval** - When a loan application is approved
2. **Loan Rejection** - When a loan application is rejected with reason
3. **Payment Reminder** - Before installment due date
4. **Overdue Notification** - When payment becomes overdue
5. **Payment Confirmation** - After successful payment

SMS notifications are sent asynchronously using:
- **Thread Pool**: Configured thread pool executor for handling concurrent SMS sending
- **ExecutorService**: Manages background tasks without blocking main application flow
- **SMS API Integration**: Integrates with third-party SMS providers via REST API

## Multithreading Configuration

The application uses a thread pool for SMS notifications:

```java
ThreadPoolExecutor(
    corePoolSize: 10,
    maxPoolSize: 20,
    keepAliveTime: 60 seconds,
    queue: LinkedBlockingQueue(100)
)
```

This ensures:
- Non-blocking SMS operations
- Efficient resource management
- Scalable notification handling
- Graceful queue management

## Dashboard Features

### Admin Dashboard
- **Dashboard View** - Overview of customers, loans, and repayments
- **Customer Management** - Full CRUD operations for customers
- **Loan Management** - Loan application review, approval, rejection
- **Repayment Tracking** - Monitor installments and overdue payments
- **SMS Notifications** - Send manual notifications, view notification logs
- **Reports & Settings** - Generate reports and configure system settings

### Responsive Design
- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Full functionality on tablets
- **Desktop** - Enhanced experience on larger screens
- **Touch Friendly** - Easy navigation on touch devices

## Configuration

### MongoDB Configuration
Edit `.env` file to configure MongoDB Atlas connection:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### SMS Provider Configuration
Integrate with your SMS provider by updating:
```env
SMS_API_KEY=your_api_key
SMS_API_URL=https://your-sms-provider.com/send
SMS_SENDER_ID=YourSenderID
```

### Thread Pool Configuration
Adjust thread pool settings in `.env`:
```env
THREAD_POOL_SIZE=10        # Core pool size
QUEUE_CAPACITY=100         # Maximum queue capacity
```

## Security Considerations

1. **Environment Variables** - Sensitive data stored in `.env` file
2. **Admin Authentication** - Username/password authentication for admins
3. **Session Management** - Session-based admin access control
4. **Input Validation** - All inputs validated before processing
5. **Database Security** - MongoDB Atlas with IP whitelisting recommended

## Performance Optimization

1. **Indexing** - Automatic index creation on MongoDB collections
2. **Connection Pooling** - Optimized connection pool for database
3. **Caching** - Client-side caching for API responses
4. **Compression** - Gzip compression enabled for responses
5. **Lazy Loading** - Dashboard components load on-demand

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

### SMS Not Sending
- Verify SMS API credentials in `.env`
- Check SMS provider API documentation
- Enable debug logging for detailed error messages

### Port Already in Use
Change the port in `.env`:
```env
APP_PORT=8081
```

### Build Errors
```bash
mvn clean install -U
```

## Future Enhancements

- Email notifications in addition to SMS
- Advanced loan calculation algorithms
- Document upload and management
- Automated penalty calculation and notifications
- Monthly/quarterly financial reports
- Integration with banking systems
- Mobile app (iOS/Android)
- Email digest for admins

## Support & Documentation

For more information:
- Check individual service classes for implementation details
- Review API documentation in controller comments
- Examine `.env` file for all configuration options

## License

This project is licensed under the MIT License.

## Contributors

- Development Team

## Contact

For support and inquiries, please contact: support@loansystem.com

---

**Last Updated**: January 12, 2026
**Version**: 1.0.0
