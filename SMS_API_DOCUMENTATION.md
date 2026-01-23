# SMS Notification API Documentation

## Overview
The Loan Management System now includes a comprehensive SMS Notification API that allows you to send SMS messages to customers' phone numbers. This API supports:

1. **Generic SMS Sending** - Send custom messages to any phone number
2. **Registration Notifications** - Automatic SMS on user registration
3. **Loan-related Notifications** - Approval, rejection, payment reminders, etc.
4. **Broadcast Messaging** - Send the same message to multiple recipients

## API Endpoints

### 1. Send Custom SMS
**Endpoint:** `POST /api/sms/send`

**Description:** Send a custom SMS message to a specific phone number.

**Request Body:**
```json
{
  "phoneNumber": "+919876543210",
  "message": "Your custom message here"
}
```

**Phone Number Formats Accepted:**
- International format: `+919876543210`
- Indian format: `919876543210`
- Local format: `9876543210`

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "SMS sent successfully to: +919876543210",
  "phoneNumber": "+919876543210"
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "error": "Phone number is required"
}
```

**Example cURL Command:**
```bash
curl -X POST http://localhost:8080/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "message": "Welcome to our Loan Management System!"
  }'
```

---

### 2. Send Registration SMS
**Endpoint:** `POST /api/sms/send-registration`

**Description:** Send an automated welcome SMS to a newly registered user.

**Request Body:**
```json
{
  "phoneNumber": "+919876543210",
  "fullName": "John Doe"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Registration SMS sent successfully",
  "phoneNumber": "+919876543210"
}
```

**Example cURL Command:**
```bash
curl -X POST http://localhost:8080/api/sms/send-registration \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "fullName": "John Doe"
  }'
```

---

### 3. Send Announcement SMS
**Endpoint:** `POST /api/sms/send-announcement`

**Description:** Send promotional or important announcements to customers.

**Request Body:**
```json
{
  "phoneNumber": "+919876543210",
  "title": "Special Offer",
  "content": "Get 2% cashback on all transactions this month!"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Announcement SMS sent successfully",
  "phoneNumber": "+919876543210"
}
```

**Example cURL Command:**
```bash
curl -X POST http://localhost:8080/api/sms/send-announcement \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "title": "Special Offer",
    "content": "Get 2% cashback on all transactions this month!"
  }'
```

---

## Dashboard SMS Notification Interface

### Accessing the SMS Notification Panel
1. Login to the Admin Dashboard
2. Click on **"Notifications"** in the sidebar navigation
3. You will see the SMS Notification Panel

### Features of the SMS Notification Panel

#### 1. Quick Templates
Pre-configured message templates for common scenarios:
- **Registration** - Welcome new users
- **Loan Approval** - Notify customer of approved loan
- **Loan Rejection** - Notify customer of rejected application
- **Payment Reminder** - Due payment notification

Click any template to auto-populate the message field.

#### 2. Send Custom SMS
- **Select Customer** - Dropdown to select from registered customers
- **Or Enter Phone Number** - Manually enter phone number if customer not in system
- **Message Type** - Choose from pre-defined types or custom
- **Message** - Write or paste your custom message
- **Character Counter** - Shows current character count (max 160 for single SMS)

#### 3. Send Broadcast Message
- **Phone Numbers** - Enter multiple phone numbers (one per line)
- **Message** - Single message to send to all numbers
- **Send to All** - Button to send message in batch

#### 4. Notification History
- View all sent SMS messages
- Recipient name and phone number
- Message content
- Timestamp of when message was sent
- Status of delivery

---

## Automatic SMS on User Registration

When a new admin user registers through the registration page:

1. User fills in registration form with:
   - Username
   - Email
   - Phone Number
   - Full Name
   - Password

2. Upon successful registration, an automatic SMS is sent to the provided phone number with:
   ```
   Welcome [User Name]! Your account has been successfully registered in the Loan Management System. You can now login with your credentials. Thank you!
   ```

3. The SMS is sent asynchronously using a thread pool executor to avoid blocking the registration process.

---

## Configuration

### Environment Variables
The SMS service uses the following environment variables from `.env` file:

```env
SMS_PROVIDER_URL=https://api.sms-provider.com/send
SMS_API_KEY=your-api-key-here
SMS_SENDER_ID=LoanMgmt
MONGODB_URI=mongodb+srv://...
```

### Thread Pool Configuration
SMS notifications are sent asynchronously using a thread pool:
- **Core Threads:** 10
- **Max Threads:** 20
- **Queue Capacity:** 100
- **Keep-Alive Time:** 60 seconds

Configure these values in `ThreadPoolConfig.java`:
```java
@Bean
public TaskExecutor taskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(10);
    executor.setMaxPoolSize(20);
    executor.setQueueCapacity(100);
    executor.setThreadNamePrefix("sms-");
    executor.initialize();
    return executor;
}
```

---

## Message Templates

### Pre-configured Templates

#### Loan Approval
```
Dear [Name], Congratulations! Your loan application for ₹[Amount] has been APPROVED. Please visit our office for documentation. Thank you!
```

#### Loan Rejection
```
Dear [Name], We regret to inform that your loan application has been REJECTED. Please contact our office for more details. Thank you!
```

#### Payment Reminder
```
Dear [Name], This is a reminder that your loan installment of ₹[Amount] is due on [Date]. Please ensure timely payment. Thank you!
```

#### Payment Confirmation
```
Dear [Name], We have received your payment of ₹[Amount]. Thank you! Your loan account has been updated.
```

### Template Variables
When using templates, you can replace placeholders with actual data:

| Variable | Example | Used In |
|----------|---------|---------|
| `[Name]` | `John Doe` | All templates |
| `[Amount]` | `50000` | Loan templates |
| `[Date]` | `15-02-2026` | Payment Reminder |

---

## Error Handling

### Common Errors

**1. Invalid Phone Number**
```
Status: 400 Bad Request
{
  "error": "Invalid phone number format"
}
```

**2. Missing Required Fields**
```
Status: 400 Bad Request
{
  "error": "Phone number is required"
}
```

**3. SMS Service Unavailable**
```
Status: 503 Service Unavailable
{
  "error": "SMS service temporarily unavailable. Please try again later."
}
```

**4. Recipient Not Found**
```
Status: 404 Not Found
{
  "error": "Customer not found"
}
```

---

## Rate Limiting

- **Per Minute:** Maximum 100 SMS messages
- **Per Hour:** Maximum 5000 SMS messages
- **Exceeded:** Response returns 429 Too Many Requests

---

## Best Practices

### 1. Phone Number Validation
- Always validate phone numbers before sending
- Use international format (+91 for India) for consistency
- Check for duplicate numbers in broadcast sends

### 2. Message Content
- Keep messages under 160 characters for single SMS (multi-part SMS charged more)
- Use clear, professional language
- Include sender identification

### 3. Timing
- Send business notifications during business hours (9 AM - 6 PM)
- Avoid sending multiple messages to same customer within minutes
- Schedule batch sends during off-peak hours

### 4. Compliance
- Always include opt-out option if promotional
- Maintain records of consent for regulatory compliance
- Follow local regulations for SMS communication

---

## Testing

### Test SMS Sending via cURL

**1. Test with sample phone number:**
```bash
curl -X POST http://localhost:8080/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "message": "Test SMS from Loan Management System"
  }'
```

**2. Test registration SMS:**
```bash
curl -X POST http://localhost:8080/api/sms/send-registration \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "fullName": "Test User"
  }'
```

**3. Test announcement:**
```bash
curl -X POST http://localhost:8080/api/sms/send-announcement \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "title": "Test Announcement",
    "content": "This is a test announcement message"
  }'
```

---

## Monitoring & Logging

### Log Locations
- Application logs: `logs/application.log`
- SMS transaction logs: `logs/sms-transactions.log`
- Error logs: `logs/errors.log`

### Log Format
```
[2026-01-13 00:15:23] INFO [SMSNotificationService] SMS sent successfully to: +919876543210
[2026-01-13 00:15:24] DEBUG [SMSNotificationService] SMS content: Welcome John! Your account has been registered...
[2026-01-13 00:15:25] INFO [SMSNotificationService] Async SMS execution completed for phone: +919876543210
```

### Monitoring SMS Delivery
Check MongoDB for SMS transaction records:
```javascript
db.sms_logs.find({
  phoneNumber: "+919876543210",
  sentAt: { $gte: new Date("2026-01-13") }
})
```

---

## Troubleshooting

### Issue: SMS not being sent
**Solution:**
1. Check if SMS provider API key is valid in `.env` file
2. Verify phone number format is correct
3. Check application logs for error messages
4. Ensure MongoDB connection is active

### Issue: Slow SMS sending
**Solution:**
1. Check thread pool configuration
2. Monitor MongoDB performance
3. Check SMS provider API response time
4. Scale up thread pool if needed

### Issue: Customer phone number not found
**Solution:**
1. Ensure customer registration includes phone number
2. Verify phone number format in database
3. Check that customer record exists in MongoDB

---

## Future Enhancements

1. **SMS Delivery Status Tracking** - Track read/delivered status
2. **SMS Templates Management UI** - Create and manage custom templates
3. **Scheduled SMS** - Schedule SMS to send at specific times
4. **Two-Way SMS** - Receive and process replies
5. **Multi-language Support** - Send SMS in different languages
6. **SMS Analytics** - Track delivery rates, costs, and effectiveness

---

## Support

For issues or questions:
- Check the logs in `logs/` directory
- Review error messages in the dashboard
- Test endpoints using provided cURL examples
- Contact support team with error details

---

**Last Updated:** January 13, 2026
**Version:** 1.0.0
