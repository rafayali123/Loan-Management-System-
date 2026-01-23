package com.loanmanagement.repository;

import com.loanmanagement.model.Repayment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RepaymentRepository extends MongoRepository<Repayment, String> {
    
    List<Repayment> findByLoanId(String loanId);
    
    List<Repayment> findByCustomerId(String customerId);
    
    List<Repayment> findByStatus(String status);
    
    List<Repayment> findByLoanIdAndStatus(String loanId, String status);
    
    List<Repayment> findByCustomerIdAndStatus(String customerId, String status);
    
    Optional<Repayment> findByLoanIdAndInstallmentNumber(String loanId, int installmentNumber);
}
