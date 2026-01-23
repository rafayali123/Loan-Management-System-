package com.loanmanagement.controller;

import com.loanmanagement.model.Admin;
import com.loanmanagement.model.Customer;
import com.loanmanagement.service.AdminService;
import com.loanmanagement.service.CustomerService;
import com.loanmanagement.service.SMSNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private CustomerService customerService;
    
    @Autowired
    private SMSNotificationService smsService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // پہلے Admin کے طور پر login کرنے کی کوشش
        Optional<Admin> admin = adminService.authenticateAdmin(
            loginRequest.getUsername(), 
            loginRequest.getPassword()
        );
        
        if (admin.isPresent()) {
            Admin a = admin.get();
            if (a.isActive()) {
                adminService.updateLastLogin(a.getId());
                return ResponseEntity.ok(new LoginResponse(
                    "Login successful",
                    a.getId(),
                    a.getUsername(),
                    a.getFullName(),
                    a.getEmail(),
                    "ADMIN"
                ));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("Admin account is deactivated"));
            }
        }
        
        // اگر Admin نہیں ملا تو Customer کے طور پر login کرنے کی کوشش
        Optional<Customer> customer = customerService.authenticateCustomer(
            loginRequest.getUsername(), 
            loginRequest.getPassword()
        );
        
        if (customer.isPresent()) {
            Customer c = customer.get();
            if (c.isActive()) {
                customerService.updateLastLogin(c.getId());
                return ResponseEntity.ok(new LoginResponse(
                    "Login successful",
                    c.getId(),
                    loginRequest.getUsername(),
                    c.getFullName(),
                    c.getEmail(),
                    "CUSTOMER"
                ));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("Customer account is deactivated"));
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse("Invalid username or password"));
    }
    
    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {
        // Check if admin already exists
        if (adminService.getAdminByUsername(admin.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("Username already exists"));
        }
        
        if (adminService.getAdminByEmail(admin.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("Email already exists"));
        }
        
        Admin newAdmin = adminService.createAdmin(admin);
        
        // Send registration SMS notification
        if (admin.getPhoneNumber() != null && !admin.getPhoneNumber().isEmpty()) {
            String message = String.format(
                "Welcome %s! Your account has been successfully registered in the Loan Management System. " +
                "You can now login with your credentials. Thank you!",
                admin.getFullName()
            );
            smsService.sendCustomSMS(admin.getPhoneNumber(), message);
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(newAdmin);
    }
    
    @PostMapping("/register/customer")
    public ResponseEntity<?> registerCustomer(@RequestBody Customer customer) {
        // Check if customer already exists
        if (customerService.getCustomerByUsername(customer.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("Username already exists"));
        }
        
        if (customerService.getCustomerByEmail(customer.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("Email already exists"));
        }
        
        Customer newCustomer = customerService.createCustomer(customer);
        
        // Send registration SMS notification
        if (customer.getPhoneNumber() != null && !customer.getPhoneNumber().isEmpty()) {
            String message = String.format(
                "Welcome %s! Your account has been successfully registered in the Loan Management System. " +
                "Username: %s\n" +
                "You can now login with your credentials. Thank you!",
                customer.getFullName(),
                customer.getUsername()
            );
            smsService.sendCustomSMS(customer.getPhoneNumber(), message);
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(newCustomer);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(new SuccessResponse("Logout successful"));
    }
    
    // Request/Response classes
    public static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class LoginResponse {
        private String message;
        private String userId;
        private String username;
        private String fullName;
        private String email;
        private String userType;
        
        public LoginResponse(String message, String userId, String username, String fullName, String email, String userType) {
            this.message = message;
            this.userId = userId;
            this.username = username;
            this.fullName = fullName;
            this.email = email;
            this.userType = userType;
        }
        
        public String getMessage() { return message; }
        public String getUserId() { return userId; }
        public String getUsername() { return username; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getUserType() { return userType; }
    }
    
    public static class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) { this.error = error; }
        public String getError() { return error; }
    }
    
    public static class SuccessResponse {
        private String message;
        
        public SuccessResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}
