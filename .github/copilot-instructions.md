<!-- Loan Management System with SMS Notification - Copilot Instructions -->

# Loan Management System - Development Guide

## Project Overview
This is a comprehensive Java Spring Boot application for managing loan applications, customer records, repayments, and automated SMS notifications using MongoDB Atlas as the cloud database.

## Key Project Components

### Architecture
- **Backend**: Spring Boot 3.1.5 with Java 17
- **Database**: MongoDB Atlas (cloud)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: RESTful API endpoints
- **Threading**: Thread pool for background SMS notifications

### Important Files
- `.env` - Environment variables (DO NOT commit to version control)
- `pom.xml` - Maven dependencies and build configuration
- `src/main/java/com/loanmanagement/` - Main application code
- `src/main/resources/application.properties` - Spring Boot configuration
- `src/main/webapp/` - Frontend HTML, CSS, and JavaScript files
- `README.md` - Complete project documentation

## Development Workflow

### Setup
1. Update `.env` file with MongoDB Atlas credentials
2. Run `mvn clean install` to download dependencies
3. Run `mvn spring-boot:run` to start the application
4. Access at http://localhost:8080

### Database Operations
- Models: `src/main/java/com/loanmanagement/model/`
- Repositories: `src/main/java/com/loanmanagement/repository/`
- Services: `src/main/java/com/loanmanagement/service/`

### API Implementation
- Controllers: `src/main/java/com/loanmanagement/controller/`
- All endpoints documented in README.md
- SMS notifications integrated with loan approval/rejection

### Frontend Development
- Login: `src/main/webapp/pages/login.html`
- Dashboard: `src/main/webapp/pages/dashboard.html`
- Styles: `src/main/webapp/static/css/`
- Scripts: `src/main/webapp/static/js/`

## Configuration Notes

### MongoDB Atlas Setup
1. Create cluster on MongoDB Atlas
2. Create database: `loan_management_db`
3. Create collections: customers, loans, repayments, admins
4. Set up database user with read/write access
5. Update MONGODB_URI in .env file

### SMS Integration
- Supports any SMS provider with REST API
- Configure API key, URL, and Sender ID in .env
- Notifications sent asynchronously with thread pool
- Messages include: approval, rejection, due reminder, overdue, payment confirmation

### Thread Pool Configuration
- Core threads: 10 (configurable in ThreadPoolConfig.java)
- Max threads: 20
- Queue capacity: 100
- Graceful shutdown on application stop

## Important Considerations

### Security
- Keep .env file private - never commit to git
- Use strong passwords for MongoDB and admin accounts
- Validate all user inputs in backend
- Use HTTPS in production

### Performance
- Indexes auto-created on MongoDB
- Connection pooling configured
- Async SMS handling prevents blocking
- Response compression enabled

### Database Best Practices
- Collections have automatic indexing
- Timestamps (createdAt, updatedAt) on all documents
- Status fields for tracking document state
- Proper relationships via IDs

## Common Development Tasks

### Adding a New API Endpoint
1. Add method to relevant Service class
2. Create endpoint in corresponding Controller
3. Add MongoDB query in Repository if needed
4. Update frontend JS to call new endpoint
5. Update README.md documentation

### Modifying Database Schema
1. Update the Model class
2. Add repository methods if needed
3. MongoDB will auto-create fields
4. Update service layer as needed

### SMS Integration
- All SMS methods in SMSNotificationService
- Use executorService.execute() for async sending
- Thread pool automatically manages concurrency
- Check logs for SMS delivery status

## Deployment Considerations

### Pre-deployment Checklist
- [ ] Update .env with production credentials
- [ ] Run `mvn clean package` for final build
- [ ] Test all API endpoints
- [ ] Verify SMS configuration
- [ ] Set up logging and monitoring
- [ ] Configure CORS for frontend domain
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups

### Production Deployment
```bash
java -jar target/loan-management-system-1.0.0.jar
```

## Reference Documentation
- Spring Boot: https://spring.io/projects/spring-boot
- Spring Data MongoDB: https://spring.io/projects/spring-data-mongodb
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Java: https://www.oracle.com/java/

---

Last Updated: January 12, 2026
Version: 1.0.0
