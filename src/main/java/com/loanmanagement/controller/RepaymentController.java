package com.loanmanagement.controller;

import com.loanmanagement.model.Repayment;
import com.loanmanagement.service.RepaymentService;
import com.loanmanagement.service.SMSNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/repayments")
@CrossOrigin(origins = "*")
public class RepaymentController {
    
    @Autowired
    private RepaymentService repaymentService;
    
    @Autowired
    private SMSNotificationService smsService;
    
    @PostMapping
    public ResponseEntity<?> createRepayment(@RequestBody Repayment repayment) {
        try {
            Repayment createdRepayment = repaymentService.createRepayment(repayment);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRepayment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorMessage("Failed to create repayment: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getRepaymentById(@PathVariable String id) {
        Optional<Repayment> repayment = repaymentService.getRepaymentById(id);
        if (repayment.isPresent()) {
            return ResponseEntity.ok(repayment.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Repayment not found"));
    }
    
    @GetMapping
    public ResponseEntity<?> getAllRepayments() {
        List<Repayment> repayments = repaymentService.getAllRepayments();
        return ResponseEntity.ok(repayments);
    }
    
    @GetMapping("/loan/{loanId}")
    public ResponseEntity<?> getRepaymentsByLoanId(@PathVariable String loanId) {
        List<Repayment> repayments = repaymentService.getRepaymentsByLoanId(loanId);
        return ResponseEntity.ok(repayments);
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getRepaymentsByCustomerId(@PathVariable String customerId) {
        List<Repayment> repayments = repaymentService.getRepaymentsByCustomerId(customerId);
        return ResponseEntity.ok(repayments);
    }
    
    @GetMapping("/status/pending/list")
    public ResponseEntity<?> getPendingRepayments() {
        List<Repayment> repayments = repaymentService.getPendingRepayments();
        return ResponseEntity.ok(repayments);
    }
    
    @GetMapping("/status/overdue/list")
    public ResponseEntity<?> getOverdueRepayments() {
        List<Repayment> repayments = repaymentService.getOverdueRepayments();
        return ResponseEntity.ok(repayments);
    }
    
    @GetMapping("/status/paid/list")
    public ResponseEntity<?> getPaidRepayments() {
        List<Repayment> repayments = repaymentService.getPaidRepayments();
        return ResponseEntity.ok(repayments);
    }
    
    @PostMapping("/{id}/pay")
    public ResponseEntity<?> markAsPaid(@PathVariable String id, @RequestBody PaymentRequest request) {
        Repayment repayment = repaymentService.markAsPaid(id, request.getAmountPaid());
        if (repayment != null) {
            // Send SMS confirmation
            smsService.sendPaymentConfirmationNotification(
                request.getPhoneNumber(),
                request.getCustomerName(),
                request.getAmountPaid(),
                java.time.LocalDate.now().toString()
            );
            return ResponseEntity.ok(repayment);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Repayment not found"));
    }
    
    @PostMapping("/{id}/overdue")
    public ResponseEntity<?> markAsOverdue(@PathVariable String id, @RequestBody OverdueRequest request) {
        Repayment repayment = repaymentService.markAsOverdue(id);
        if (repayment != null) {
            // Send SMS notification
            smsService.sendOverdueNotification(
                request.getPhoneNumber(),
                request.getCustomerName(),
                request.getPendingAmount(),
                repayment.getPenalty()
            );
            return ResponseEntity.ok(repayment);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Repayment not found"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRepayment(@PathVariable String id, @RequestBody Repayment repayment) {
        Repayment updatedRepayment = repaymentService.updateRepayment(id, repayment);
        if (updatedRepayment != null) {
            return ResponseEntity.ok(updatedRepayment);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Repayment not found"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRepayment(@PathVariable String id) {
        if (repaymentService.deleteRepayment(id)) {
            return ResponseEntity.ok(new SuccessMessage("Repayment deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Repayment not found"));
    }
    
    // Request classes
    public static class PaymentRequest {
        private double amountPaid;
        private String phoneNumber;
        private String customerName;
        
        public double getAmountPaid() { return amountPaid; }
        public void setAmountPaid(double amountPaid) { this.amountPaid = amountPaid; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
    }
    
    public static class OverdueRequest {
        private String phoneNumber;
        private String customerName;
        private double pendingAmount;
        
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public double getPendingAmount() { return pendingAmount; }
        public void setPendingAmount(double pendingAmount) { this.pendingAmount = pendingAmount; }
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
