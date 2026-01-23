package com.loanmanagement.controller;

import com.loanmanagement.model.Customer;
import com.loanmanagement.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {
    
    @Autowired
    private CustomerService customerService;
    
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        try {
            Customer createdCustomer = customerService.createCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCustomer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorMessage("Failed to create customer: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable String id) {
        Optional<Customer> customer = customerService.getCustomerById(id);
        if (customer.isPresent()) {
            return ResponseEntity.ok(customer.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Customer not found"));
    }
    
    @GetMapping
    public ResponseEntity<?> getAllActiveCustomers() {
        List<Customer> customers = customerService.getAllActiveCustomers();
        return ResponseEntity.ok(customers);
    }
    
    @GetMapping("/all/list")
    public ResponseEntity<?> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable String id, @RequestBody Customer customer) {
        Customer updatedCustomer = customerService.updateCustomer(id, customer);
        if (updatedCustomer != null) {
            return ResponseEntity.ok(updatedCustomer);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Customer not found"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable String id) {
        if (customerService.deleteCustomer(id)) {
            return ResponseEntity.ok(new SuccessMessage("Customer deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Customer not found"));
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getCustomerByEmail(@PathVariable String email) {
        Optional<Customer> customer = customerService.getCustomerByEmail(email);
        if (customer.isPresent()) {
            return ResponseEntity.ok(customer.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Customer not found"));
    }
    
    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<?> getCustomerByPhoneNumber(@PathVariable String phoneNumber) {
        Optional<Customer> customer = customerService.getCustomerByPhoneNumber(phoneNumber);
        if (customer.isPresent()) {
            return ResponseEntity.ok(customer.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMessage("Customer not found"));
    }
    
    @GetMapping("/city/{city}")
    public ResponseEntity<?> getCustomersByCity(@PathVariable String city) {
        List<Customer> customers = customerService.getCustomersByCity(city);
        return ResponseEntity.ok(customers);
    }
    
    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateCustomer(@PathVariable String id) {
        customerService.activateCustomer(id);
        return ResponseEntity.ok(new SuccessMessage("Customer activated successfully"));
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateCustomer(@PathVariable String id) {
        customerService.deactivateCustomer(id);
        return ResponseEntity.ok(new SuccessMessage("Customer deactivated successfully"));
    }
    
    // Helper classes
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
