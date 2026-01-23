package com.loanmanagement.service;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class SMSNotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(SMSNotificationService.class);
    private static final Dotenv dotenv = Dotenv.load();
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);
    
    private static final String TWILIO_API_URL = "https://api.twilio.com/2010-04-01/Accounts/";
    
    /**
     * Send loan approval SMS notification asynchronously
     */
    public void sendLoanApprovalNotification(String phoneNumber, String customerName, 
                                            String loanAmount, String loanId) {
        executorService.execute(() -> {
            String message = String.format(
                "Dear %s, Your loan application (ID: %s) for amount ₹%s has been APPROVED. " +
                "Please visit our office to complete the formalities. Thank you!",
                customerName, loanId, loanAmount
            );
            sendSMS(phoneNumber, message);
        });
    }
    
    /**
     * Send loan rejection SMS notification asynchronously
     */
    public void sendLoanRejectionNotification(String phoneNumber, String customerName, 
                                             String loanId, String reason) {
        executorService.execute(() -> {
            String message = String.format(
                "Dear %s, We regret to inform that your loan application (ID: %s) has been REJECTED. " +
                "Reason: %s. For more details, please contact our office. Thank you!",
                customerName, loanId, reason
            );
            sendSMS(phoneNumber, message);
        });
    }
    
    /**
     * Send installment due reminder SMS notification asynchronously
     */
    public void sendInstallmentReminderNotification(String phoneNumber, String customerName, 
                                                    double installmentAmount, String dueDate) {
        executorService.execute(() -> {
            String message = String.format(
                "Dear %s, This is a reminder that your loan installment of ₹%s is due on %s. " +
                "Please ensure timely payment to avoid penalties. Thank you!",
                customerName, installmentAmount, dueDate
            );
            sendSMS(phoneNumber, message);
        });
    }
    
    /**
     * Send installment overdue notification SMS asynchronously
     */
    public void sendOverdueNotification(String phoneNumber, String customerName, 
                                       double pendingAmount, double penaltyAmount) {
        executorService.execute(() -> {
            String message = String.format(
                "Dear %s, Your loan installment is OVERDUE. Pending amount: ₹%s, Penalty: ₹%s. " +
                "Please pay immediately to avoid further action. Thank you!",
                customerName, pendingAmount, penaltyAmount
            );
            sendSMS(phoneNumber, message);
        });
    }
    
    /**
     * Send payment confirmation SMS asynchronously
     */
    public void sendPaymentConfirmationNotification(String phoneNumber, String customerName, 
                                                    double amount, String paymentDate) {
        executorService.execute(() -> {
            String message = String.format(
                "Dear %s, Your loan installment payment of ₹%s has been successfully received on %s. " +
                "Thank you for your timely payment!",
                customerName, amount, paymentDate
            );
            sendSMS(phoneNumber, message);
        });
    }
    
    /**
     * Send custom SMS to any phone number (for general purpose)
     */
    public void sendCustomSMS(String phoneNumber, String message) {
        executorService.execute(() -> {
            sendSMS(phoneNumber, message);
        });
    }
    
    /**
     * Generic SMS sending method using Twilio API
     */
    private void sendSMS(String phoneNumber, String message) {
        try {
            String accountSid = dotenv.get("TWILIO_ACCOUNT_SID");
            String authToken = dotenv.get("TWILIO_AUTH_TOKEN");
            String fromNumber = dotenv.get("TWILIO_PHONE_NUMBER");
            
            // Format: Ensure phone number is in valid format
            phoneNumber = formatPhoneNumber(phoneNumber);
            
            // If credentials are not configured, log message instead of sending (development mode)
            if (accountSid == null || accountSid.isEmpty() || 
                authToken == null || authToken.isEmpty() || 
                fromNumber == null || fromNumber.isEmpty()) {
                logger.warn("Twilio credentials not configured. SMS would be sent to: {}", phoneNumber);
                logger.info("=== SMS MESSAGE (DEVELOPMENT MODE - NOT SENT) ===");
                logger.info("To: {}", phoneNumber);
                logger.info("From: {}", fromNumber);
                logger.info("Message: {}", message);
                logger.info("=========================================");
                return;
            }
            
            // Build Twilio API URL
            String apiUrl = TWILIO_API_URL + accountSid + "/Messages.json";
            
            // Prepare request body for Twilio API
            String requestBody = String.format(
                "From=%s&To=%s&Body=%s",
                URLEncoder.encode(fromNumber, StandardCharsets.UTF_8),
                URLEncoder.encode(phoneNumber, StandardCharsets.UTF_8),
                URLEncoder.encode(message, StandardCharsets.UTF_8)
            );
            
            // Create Basic Auth header
            String auth = accountSid + ":" + authToken;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Basic " + encodedAuth);
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("Content-Length", String.valueOf(requestBody.length()));
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            conn.setDoOutput(true);
            
            // Send request body
            try (OutputStream os = conn.getOutputStream()) {
                os.write(requestBody.getBytes(StandardCharsets.UTF_8));
                os.flush();
            }
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200 || responseCode == 201) {
                try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) {
                        response.append(line);
                    }
                    logger.info("SMS sent successfully to: {}", phoneNumber);
                    logger.info("SMS Response: {}", response.toString());
                }
            } else {
                logger.error("Failed to send SMS. Response code: {}", responseCode);
                try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getErrorStream()))) {
                    StringBuilder errorResponse = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) {
                        errorResponse.append(line);
                    }
                    logger.error("Error Response: {}", errorResponse.toString());
                }
            }
            
            conn.disconnect();
            
        } catch (Exception e) {
            logger.error("Error sending SMS to {}: {}", phoneNumber, e.getMessage(), e);
        }
    }
    
    /**
     * Format phone number to ensure it's in the correct format (E.164 format for Twilio)
     */
    private String formatPhoneNumber(String phoneNumber) {
        // Remove any spaces, dashes, or parentheses
        String cleaned = phoneNumber.replaceAll("[\\s\\-()]+", "");
        
        // If phone number doesn't start with +, add it
        if (!cleaned.startsWith("+")) {
            // If it's a Pakistani number (92XXXXXXXXXX or 03XXXXXXXXX)
            if (cleaned.startsWith("92")) {
                cleaned = "+" + cleaned;
            } else if (cleaned.startsWith("03")) {
                cleaned = "+92" + cleaned.substring(1);
            } else if (cleaned.length() == 10) {
                // Assume Pakistan if no country code and 10 digits
                cleaned = "+92" + cleaned.substring(1);
            } else if (cleaned.startsWith("1")) {
                // US/Canada number
                cleaned = "+" + cleaned;
            }
        }
        
        return cleaned;
    }
    
    /**
     * Shutdown the executor service gracefully
     */
    public void shutdown() {
        executorService.shutdown();
        logger.info("SMS Notification Service shutdown");
    }
}
