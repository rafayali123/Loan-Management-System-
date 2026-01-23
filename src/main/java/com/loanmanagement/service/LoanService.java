package com.loanmanagement.service;

import com.loanmanagement.model.Loan;
import com.loanmanagement.model.Customer;
import com.loanmanagement.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LoanService {
    
    @Autowired
    private LoanRepository loanRepository;
    
    @Autowired
    private CustomerService customerService;
    
    public Loan createLoan(Loan loan) {
        calculateMonthlyInstallment(loan);
        loan.setRemainingInstallments(loan.getLoanTerm());
        
        // Fetch and populate customer details
        if (loan.getCustomerId() != null) {
            Optional<Customer> customer = customerService.getCustomerById(loan.getCustomerId());
            if (customer.isPresent()) {
                loan.setCustomerName(customer.get().getFirstName() + " " + customer.get().getLastName());
                loan.setCustomerPhoneNumber(customer.get().getPhoneNumber());
            }
        }
        
        return loanRepository.save(loan);
    }
    
    public Optional<Loan> getLoanById(String id) {
        return loanRepository.findById(id);
    }
    
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }
    
    public List<Loan> getLoansByCustomerId(String customerId) {
        return loanRepository.findByCustomerId(customerId);
    }
    
    public List<Loan> getLoansByStatus(String status) {
        return loanRepository.findByStatus(status);
    }
    
    public List<Loan> getPendingLoans() {
        return loanRepository.findByStatusOrderByApplicationDateDesc("PENDING");
    }
    
    public List<Loan> getApprovedLoans() {
        return loanRepository.findByStatus("APPROVED");
    }
    
    public List<Loan> getLoansByType(String loanType) {
        return loanRepository.findByLoanType(loanType);
    }
    
    public Loan updateLoan(String id, Loan loan) {
        Optional<Loan> existing = loanRepository.findById(id);
        if (existing.isPresent()) {
            loan.setId(id);
            loan.setCreatedAt(existing.get().getCreatedAt());
            return loanRepository.save(loan);
        }
        return null;
    }
    
    public Loan approveLoan(String id, String approvedBy) {
        Optional<Loan> loan = loanRepository.findById(id);
        if (loan.isPresent()) {
            Loan l = loan.get();
            l.setStatus("APPROVED");
            l.setApprovalDate(new Date());
            l.setApprovedBy(approvedBy);
            
            // Set loan start date to today
            l.setLoanStartDate(new Date());
            
            // Calculate loan end date
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            calendar.add(Calendar.MONTH, l.getLoanTerm());
            l.setLoanEndDate(calendar.getTime());
            
            return loanRepository.save(l);
        }
        return null;
    }
    
    public Loan rejectLoan(String id, String rejectionReason) {
        Optional<Loan> loan = loanRepository.findById(id);
        if (loan.isPresent()) {
            Loan l = loan.get();
            l.setStatus("REJECTED");
            l.setRejectionReason(rejectionReason);
            return loanRepository.save(l);
        }
        return null;
    }
    
    public boolean deleteLoan(String id) {
        Optional<Loan> loan = loanRepository.findById(id);
        if (loan.isPresent()) {
            loanRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public void calculateMonthlyInstallment(Loan loan) {
        double principal = loan.getLoanAmount();
        double monthlyRate = loan.getInterestRate() / 100 / 12;
        int months = loan.getLoanTerm();
        
        if (monthlyRate == 0) {
            loan.setMonthlyInstallment(principal / months);
        } else {
            double installment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                                (Math.pow(1 + monthlyRate, months) - 1);
            loan.setMonthlyInstallment(Math.round(installment * 100.0) / 100.0);
        }
    }
    
    public void decrementRemainingInstallments(String loanId) {
        Optional<Loan> loan = loanRepository.findById(loanId);
        if (loan.isPresent()) {
            Loan l = loan.get();
            l.setRemainingInstallments(l.getRemainingInstallments() - 1);
            loanRepository.save(l);
        }
    }
}
