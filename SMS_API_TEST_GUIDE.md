# SMS Notification API - Quick Test Guide

## Current Status
✅ **Application Running** at `http://localhost:8080`
✅ **SMS API Endpoints** Active and Ready
✅ **Dashboard** Updated with SMS Notification Interface

---

## Method 1: Using the Dashboard UI

### Step 1: Login to Dashboard
1. Open `http://localhost:8080` in your browser
2. Login with admin credentials
3. You'll be redirected to the dashboard

### Step 2: Navigate to Notifications
1. Click **"Notifications"** in the left sidebar
2. You'll see the SMS Notification Panel

### Step 3: Send Test SMS
**Option A: To a Registered Customer**
1. Click "Select Customer" dropdown
2. Choose a customer from the list
3. Their phone number will auto-populate
4. Enter your message in the "Message" field
5. Click "Send SMS"

**Option B: To Any Phone Number**
1. Leave "Select Customer" empty
2. Enter phone number in "Or Enter Phone Number" field (format: +919876543210 or 9876543210)
3. Type your message
4. Click "Send SMS"

**Option C: Using Quick Templates**
1. Click any template button (Registration, Loan Approval, etc.)
2. Message will auto-populate
3. Replace `[Name]` and other placeholders with actual values if needed
4. Click "Send SMS"

### Step 4: Send Broadcast Message
1. Scroll to "Send Broadcast Message" section
2. Enter multiple phone numbers (one per line)
3. Type the message to send to all
4. Click "Send to All"

---

## Method 2: Using REST API (cURL/Postman)

### Prerequisite
- Have cURL installed, or use Postman
- Application running on `http://localhost:8080`

### Test 1: Send Simple SMS

```bash
curl -X POST http://localhost:8080/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "message": "Hello! This is a test SMS from Loan Management System."
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "SMS sent successfully to: +919876543210",
  "phoneNumber": "+919876543210"
}
```

---

### Test 2: Send Registration SMS

```bash
curl -X POST http://localhost:8080/api/sms/send-registration \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "fullName": "John Doe"
  }'
```

**Expected Message Sent:**
```
Welcome John Doe! Your account has been successfully registered in our Loan Management System. You can now login with your credentials. Thank you!
```

---

### Test 3: Send Announcement SMS

```bash
curl -X POST http://localhost:8080/api/sms/send-announcement \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "title": "Special Interest Rate Offer",
    "content": "Get loans at just 8% interest rate this month! Limited time offer."
  }'
```

---

### Test 4: Verify SMS Sent
Check application logs for confirmation:
```
[INFO] SMS sent successfully to: +919876543210
[DEBUG] SMS content: Welcome John Doe! Your account has been successfully registered...
```

---

## Method 3: Using Postman

### Step 1: Setup Request
1. Open Postman
2. Click "New" → "Request"
3. Set method to `POST`
4. URL: `http://localhost:8080/api/sms/send`

### Step 2: Configure Headers
- Click "Headers" tab
- Add header:
  - Key: `Content-Type`
  - Value: `application/json`

### Step 3: Add Request Body
- Click "Body" tab
- Select "raw"
- Paste the following:

```json
{
  "phoneNumber": "+919876543210",
  "message": "Test SMS message from Loan Management System"
}
```

### Step 4: Send Request
1. Click the blue "Send" button
2. Check the response status (should be 200 OK)
3. View response in the lower panel

---

## Test Scenarios

### Scenario 1: New User Registration
**Test:** Register a new admin user and verify SMS is sent automatically

**Steps:**
1. Go to `http://localhost:8080/pages/register.html`
2. Fill in registration form including a valid phone number
3. Click "Register"
4. Check application logs for SMS confirmation

**Expected Behavior:**
- User is created successfully
- SMS sent to the provided phone number
- Welcome message appears in logs

---

### Scenario 2: Loan Approval Notification
**Test:** Send loan approval SMS to customer

**Steps:**
1. Go to Dashboard → Notifications
2. Select message type: "Loan Approval"
3. The template message will populate
4. Replace `[Name]` with actual name, `[Amount]` with loan amount
5. Click "Send SMS"

**Template Message:**
```
Dear [Name], Congratulations! Your loan application for ₹[Amount] has been APPROVED. Please visit our office for documentation. Thank you!
```

---

### Scenario 3: Payment Reminder
**Test:** Send payment reminder to multiple customers

**Steps:**
1. Go to Dashboard → Notifications → Broadcast Message
2. Enter multiple phone numbers (one per line):
   ```
   +919876543210
   +919876543211
   +919876543212
   ```
3. Type payment reminder message
4. Click "Send to All"

---

### Scenario 4: Character Count Validation
**Test:** Verify SMS character counter works

**Steps:**
1. In SMS Message field, type a message
2. Watch the character count update in real-time
3. Type more than 160 characters
4. Counter should turn red warning about SMS splitting

---

## Verification Checklist

After sending SMS, verify:

- ✅ Response shows `"success": true`
- ✅ Phone number is correctly formatted in response
- ✅ Application logs show SMS sent confirmation
- ✅ No error messages in browser console
- ✅ Status message appears in green at top of form
- ✅ Form can be reset and reused

---

## Common Phone Number Formats to Test

Test the API with these different phone number formats - all should work:

| Format | Example | Notes |
|--------|---------|-------|
| International | `+919876543210` | Recommended |
| Country Code | `919876543210` | Auto-formatted to international |
| Local (India) | `9876543210` | Auto-formatted to international |
| With Spaces | `+91 9876 543 210` | Spaces removed automatically |

---

## Sample Test Phone Numbers
(These are for testing - actual SMS will try to send)

```
+919876543210  (Primary test number)
+919876543211  (Secondary test number)
+919876543212  (Tertiary test number)
```

---

## Application Logs Location

Check these files for SMS confirmation:
- Main logs: `target/classes/` (while running in dev)
- Console output: Look in terminal where `mvn spring-boot:run` is running

**Expected Log Entry:**
```
[TIMESTAMP] INFO [SMSNotificationService] SMS sent successfully to: +919876543210
[TIMESTAMP] DEBUG [SMSNotificationService] Formatted phone number: +919876543210
[TIMESTAMP] INFO [SMSNotificationService] Async SMS sending via thread pool
```

---

## Troubleshooting Test Issues

### Issue: 404 Error on SMS endpoint
**Solution:**
- Verify application is running on port 8080
- Check URL is exactly: `http://localhost:8080/api/sms/send`
- Refresh browser cache

### Issue: 400 Bad Request
**Solution:**
- Check if phoneNumber field is present in JSON
- Verify JSON is valid (use jsonformatter.org)
- Ensure phoneNumber is not empty string

### Issue: SMS appears not to send
**Solution:**
- Check application logs for errors
- Verify .env file has SMS provider configuration
- Check MongoDB connection status
- Restart application if needed

### Issue: Form not responding
**Solution:**
- Check browser console for JavaScript errors
- Clear browser cache and reload
- Ensure all JavaScript files loaded (check Network tab)

---

## Next Steps

After successful testing:

1. **Configure Real SMS Provider**
   - Update `.env` file with actual SMS provider credentials
   - Test with real phone number to verify delivery

2. **Set Up Monitoring**
   - Configure logging to track all SMS sent
   - Set up alerts for failed SMS

3. **Production Deployment**
   - Update application configuration for production
   - Enable HTTPS for secure API calls
   - Configure rate limiting

4. **Additional Features**
   - Add SMS delivery status tracking
   - Create SMS templates management UI
   - Implement scheduled SMS feature

---

## Support & Documentation

- **Full API Documentation:** See `SMS_API_DOCUMENTATION.md`
- **Architecture:** See `ARCHITECTURE_DIAGRAM.md`
- **README:** See `README.md` for general info
- **Application Status:** Visit http://localhost:8080

---

**Created:** January 13, 2026
**Status:** Ready for Testing ✅
