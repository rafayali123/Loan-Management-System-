package com.loanmanagement.repository;

import com.loanmanagement.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
    
    Optional<Customer> findByEmail(String email);
    
    Optional<Customer> findByPhoneNumber(String phoneNumber);
    
    Optional<Customer> findByUsername(String username);
    
    Optional<Customer> findByUsernameAndPassword(String username, String password);
    
    List<Customer> findByIsActiveTrue();
    
    List<Customer> findByCityAndIsActiveTrue(String city);
    
    List<Customer> findByEmploymentType(String employmentType);
    
    List<Customer> findByAnnualIncomeGreaterThan(double income);
}
