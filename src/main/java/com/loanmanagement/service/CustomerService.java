package com.loanmanagement.service;

import com.loanmanagement.model.Customer;
import com.loanmanagement.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }
    
    public Optional<Customer> getCustomerById(String id) {
        return customerRepository.findById(id);
    }
    
    public List<Customer> getAllActiveCustomers() {
        return customerRepository.findByIsActiveTrue();
    }
    
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    public Customer updateCustomer(String id, Customer customer) {
        Optional<Customer> existing = customerRepository.findById(id);
        if (existing.isPresent()) {
            customer.setId(id);
            return customerRepository.save(customer);
        }
        return null;
    }
    
    public boolean deleteCustomer(String id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isPresent()) {
            customerRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }
    
    public Optional<Customer> getCustomerByPhoneNumber(String phoneNumber) {
        return customerRepository.findByPhoneNumber(phoneNumber);
    }
    
    public Optional<Customer> getCustomerByUsername(String username) {
        return customerRepository.findByUsername(username);
    }
    
    public Optional<Customer> authenticateCustomer(String username, String password) {
        return customerRepository.findByUsernameAndPassword(username, password);
    }
    
    public void updateLastLogin(String customerId) {
        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isPresent()) {
            Customer c = customer.get();
            c.setLastLogin(new Date());
            customerRepository.save(c);
        }
    }
    
    public List<Customer> getCustomersByCity(String city) {
        return customerRepository.findByCityAndIsActiveTrue(city);
    }
    
    public List<Customer> getCustomersByEmploymentType(String employmentType) {
        return customerRepository.findByEmploymentType(employmentType);
    }
    
    public List<Customer> getCustomersWithMinimumIncome(double income) {
        return customerRepository.findByAnnualIncomeGreaterThan(income);
    }
    
    public void activateCustomer(String id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isPresent()) {
            Customer c = customer.get();
            c.setActive(true);
            customerRepository.save(c);
        }
    }
    
    public void deactivateCustomer(String id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isPresent()) {
            Customer c = customer.get();
            c.setActive(false);
            customerRepository.save(c);
        }
    }
}
