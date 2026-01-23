package com.loanmanagement.repository;

import com.loanmanagement.model.Loan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends MongoRepository<Loan, String> {
    
    List<Loan> findByCustomerId(String customerId);
    
    List<Loan> findByStatus(String status);
    
    List<Loan> findByCustomerIdAndStatus(String customerId, String status);
    
    List<Loan> findByLoanType(String loanType);
    
    List<Loan> findByStatusOrderByApplicationDateDesc(String status);
    
    Optional<Loan> findById(String id);
    
    List<Loan> findAll();
}
