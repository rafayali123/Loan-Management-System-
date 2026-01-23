package com.loanmanagement.controller;

import com.loanmanagement.model.Loan;
import com.loanmanagement.service.LoanService;
import com.loanmanagement.service.SMSNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*")
public class LoanController {
    
    @Autowired
    private LoanService loanService;
    
    @Autowired
    private SMSNotificationService smsService;
    
    @PostMapping
    public ResponseEntity<?> createLoan(@RequestBody Loan loan) {
        try {
            Loan createdLoan = loanService.createLoan(loan);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdLoan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorMessage("Failed to create loan: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getLoanById(@PathVariable String id) {
        Optional<Loan> loan = loanService.getLoanById(id);
        if (loan.isPresent()) {
            return ResponseEntity.ok(loan.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Loan not found"));
    }
    
    @GetMapping
    public ResponseEntity<?> getAllLoans() {
        List<Loan> loans = loanService.getAllLoans();
        return ResponseEntity.ok(loans);
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getLoansByCustomerId(@PathVariable String customerId) {
        List<Loan> loans = loanService.getLoansByCustomerId(customerId);
        return ResponseEntity.ok(loans);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getLoansByStatus(@PathVariable String status) {
        List<Loan> loans = loanService.getLoansByStatus(status);
        return ResponseEntity.ok(loans);
    }
    
    @GetMapping("/pending/all")
    public ResponseEntity<?> getPendingLoans() {
        List<Loan> loans = loanService.getPendingLoans();
        return ResponseEntity.ok(loans);
    }
    
    @GetMapping("/approved/all")
    public ResponseEntity<?> getApprovedLoans() {
        List<Loan> loans = loanService.getApprovedLoans();
        return ResponseEntity.ok(loans);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLoan(@PathVariable String id, @RequestBody Loan loan) {
        Loan updatedLoan = loanService.updateLoan(id, loan);
        if (updatedLoan != null) {
            return ResponseEntity.ok(updatedLoan);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Loan not found"));
    }
    
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveLoan(@PathVariable String id, @RequestBody ApprovalRequest request) {
        Loan approvedLoan = loanService.approveLoan(id, request.getApprovedBy());
        if (approvedLoan != null) {
            // Send SMS notification
            smsService.sendLoanApprovalNotification(
                request.getPhoneNumber(),
                request.getCustomerName(),
                String.valueOf(approvedLoan.getLoanAmount()),
                id
            );
            return ResponseEntity.ok(approvedLoan);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Loan not found"));
    }
    
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectLoan(@PathVariable String id, @RequestBody RejectionRequest request) {
        Loan rejectedLoan = loanService.rejectLoan(id, request.getReason());
        if (rejectedLoan != null) {
            // Send SMS notification
            smsService.sendLoanRejectionNotification(
                request.getPhoneNumber(),
                request.getCustomerName(),
                id,
                request.getReason()
            );
            return ResponseEntity.ok(rejectedLoan);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Loan not found"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLoan(@PathVariable String id) {
        if (loanService.deleteLoan(id)) {
            return ResponseEntity.ok(new SuccessMessage("Loan deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Loan not found"));
    }
    
    // Request classes
    public static class ApprovalRequest {
        private String approvedBy;
        private String phoneNumber;
        private String customerName;
        
        public String getApprovedBy() { return approvedBy; }
        public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
    }
    
    public static class RejectionRequest {
        private String reason;
        private String phoneNumber;
        private String customerName;
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
    }
    
    public static class ErrorMessage {
        private String error;
        
        public ErrorMessage(String error) { this.error = error; }
        public String getError() { return error; }
    }
    
    public static class SuccessMessage {
        private String message;
        
        public SuccessMessage(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}
