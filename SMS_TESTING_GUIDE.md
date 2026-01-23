# SMS Notification Testing & Configuration Guide

## Current Status
✅ **SMS API is fully functional**
✅ **Development Mode: SMS logs instead of sending** (because API key not configured)
✅ **Ready for real SMS when you add provider credentials**

---

## How SMS Works Now (Development Mode)

### When you send SMS:
1. System logs the SMS details to the application logs
2. Shows in browser console confirmation
3. No actual SMS sent (because SMS_API_KEY is not configured)

### Example Log Output:
```
[INFO] =========================== SMS MESSAGE (DEVELOPMENT MODE - NOT SENT) ===========================
[INFO] To: +919876543210
[INFO] From: LoanMgmt
[INFO] Message: Welcome John Doe! Your account has been successfully registered...
[INFO] =====================================
```

---

## Test SMS Now (Development)

### Step 1: Try Sending SMS via Dashboard
1. Login to dashboard
2. Go to **Notifications** section
3. Enter phone number: `+919876543210` (or any number)
4. Type message
5. Click **Send SMS**
6. Check the terminal/logs - you'll see the message logged

### Step 2: Check Application Logs
Look at the terminal where Spring Boot is running. You should see:
```
[INFO] =========================== SMS MESSAGE (DEVELOPMENT MODE - NOT SENT) ===========================
[INFO] To: +919876543210
[INFO] From: LoanMgmt
[INFO] Message: Your custom message here
[INFO] =====================================
```

### Step 3: Try SMS on Registration
1. Go to **Register** page
2. Create new admin with:
   - Username: testuser
   - Email: test@example.com
   - Phone: +919876543210 (or any number)
   - Password: Test@1234
3. Click Register
4. Check logs - welcome SMS should be logged

---

## Enable Real SMS (Production Setup)

### Option 1: Use Twilio (Recommended)

**Step 1: Get Twilio Account**
1. Go to https://www.twilio.com
2. Sign up for free account
3. Get these credentials:
   - Account SID
   - Auth Token
   - Phone Number (assigned by Twilio)

**Step 2: Update .env File**
```env
# SMS Notification Configuration
SMS_API_KEY=your_twilio_auth_token_here
SMS_API_URL=https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json
SMS_SENDER_ID=+1234567890
```

**Step 3: Restart Application**
```bash
mvn spring-boot:run
```

---

### Option 2: Use Msg91 (India Based)

**Step 1: Get Msg91 Account**
1. Go to https://www.msg91.com
2. Sign up (has free credits)
3. Get API Key from dashboard

**Step 2: Update .env File**
```env
# SMS Notification Configuration  
SMS_API_KEY=your_msg91_api_key_here
SMS_API_URL=https://api.msg91.com/api/sendhttp.php
SMS_SENDER_ID=LOANMGT
```

**Step 3: Restart Application**

---

### Option 3: Use AWS SNS

**Step 1: AWS Account Setup**
1. Create AWS account
2. Go to SNS (Simple Notification Service)
3. Create topic and get credentials

**Step 2: Update .env File**
```env
SMS_API_KEY=your_aws_access_key
SMS_API_URL=https://sns.amazonaws.com/
SMS_SENDER_ID=LOANMGT
```

---

## Verify SMS is Working

### Method 1: Check Logs
After sending SMS, look for this in terminal:

✅ **Development Mode:**
```
[INFO] =========================== SMS MESSAGE (DEVELOPMENT MODE - NOT SENT) ===========================
[INFO] To: +919876543210
[INFO] From: LoanMgmt
[INFO] Message: Hello Test
[INFO] =====================================
```

✅ **Production Mode (with real SMS):**
```
[INFO] SMS sent successfully to: +919876543210
[INFO] SMS Response: {"success": true, "messageId": "123456"}
```

---

### Method 2: API Test
**Test via cURL:**
```bash
curl -X POST http://localhost:8080/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "message": "Test SMS message"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "SMS sent successfully to: +919876543210",
  "phoneNumber": "+919876543210"
}
```

---

### Method 3: Dashboard Test
1. Go to Notifications section
2. Send test SMS
3. Check browser console (F12) for confirmation
4. Check application logs for message details

---

## SMS Features Currently Working

### ✅ Automatic SMS on Registration
When admin user registers with phone number:
- Automatic welcome SMS triggered
- Async processing (non-blocking)
- Currently logs instead of sending

### ✅ Manual SMS from Dashboard
Send SMS to any phone number:
- Single phone number
- Custom message
- Template variables
- Character counter
- Broadcast to multiple numbers

### ✅ API SMS Endpoints
Three REST endpoints available:
- `/api/sms/send` - Custom SMS
- `/api/sms/send-registration` - Registration SMS
- `/api/sms/send-announcement` - Announcement SMS

### ✅ Message Templates
Pre-defined templates for:
- Loan Approval
- Loan Rejection
- Payment Reminder
- Payment Confirmation

---

## Troubleshooting

### Issue: No SMS logs appearing
**Solution:**
1. Check logs in terminal where Spring Boot is running
2. Press F12 in browser to check console
3. Verify phone number format (+91XXXXXXXXXX)
4. Check application.properties logging level is INFO

### Issue: SMS says sent but not received
**Reason:** API key not configured (development mode)
**Solution:** Configure real SMS provider API key in .env

### Issue: API returns error
**Check:**
1. Is application running? (http://localhost:8080 should work)
2. Is phone number format correct?
3. Is message not empty?
4. Check browser console for error details

---

## SMS Configuration Summary

### Current Setup
| Component | Status | Config |
|-----------|--------|--------|
| API Endpoints | ✅ Active | `/api/sms/send` etc |
| Dashboard UI | ✅ Active | Notifications section |
| Auto SMS on Register | ✅ Active | Triggered on signup |
| SMS Provider API | ⏳ Not configured | needs .env update |
| Real SMS Delivery | ⏳ Disabled | add API key |

### To Enable Real SMS:
1. Get API credentials from SMS provider
2. Update .env file
3. Restart application
4. Test sending SMS

---

## Free SMS Providers for Testing

| Provider | Free Credits | Setup Time | India Support |
|----------|--------------|-----------|---|
| Twilio | 15 USD (phone verify) | 10 min | ✅ Yes |
| Msg91 | 100 SMS | 5 min | ✅ Yes (India based) |
| AWS SNS | 12 month free tier | 15 min | ✅ Yes |
| Textlocal | 10 Credits | 5 min | ✅ Yes |

---

## Next Steps

### Immediate (Testing)
1. ✅ SMS API is working (logs in console)
2. Try sending SMS from dashboard
3. Check application logs

### Short Term (Real SMS)
1. Choose SMS provider (Msg91 recommended for India)
2. Sign up and get API credentials
3. Update .env file
4. Restart application
5. Test with real phone number

### Long Term (Production)
1. Set up monitoring/alerting
2. Track SMS delivery status
3. Implement SMS cost tracking
4. Add SMS template management UI

---

**Current Status:** ✅ Ready for Development & Testing
**SMS API Status:** ✅ Fully Functional (Logging Mode)
**Production Ready:** ⏳ Pending SMS Provider Configuration

---

Created: January 13, 2026
Version: 1.0.0
