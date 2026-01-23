package com.loanmanagement.service;

import com.loanmanagement.model.Repayment;
import com.loanmanagement.repository.RepaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RepaymentService {
    
    @Autowired
    private RepaymentRepository repaymentRepository;
    
    @Autowired
    private LoanService loanService;
    
    public Repayment createRepayment(Repayment repayment) {
        return repaymentRepository.save(repayment);
    }
    
    public Optional<Repayment> getRepaymentById(String id) {
        return repaymentRepository.findById(id);
    }
    
    public List<Repayment> getAllRepayments() {
        return repaymentRepository.findAll();
    }
    
    public List<Repayment> getRepaymentsByLoanId(String loanId) {
        return repaymentRepository.findByLoanId(loanId);
    }
    
    public List<Repayment> getRepaymentsByCustomerId(String customerId) {
        return repaymentRepository.findByCustomerId(customerId);
    }
    
    public List<Repayment> getPendingRepayments() {
        return repaymentRepository.findByStatus("PENDING");
    }
    
    public List<Repayment> getOverdueRepayments() {
        return repaymentRepository.findByStatus("OVERDUE");
    }
    
    public List<Repayment> getPaidRepayments() {
        return repaymentRepository.findByStatus("PAID");
    }
    
    public Repayment markAsPaid(String repaymentId, double amountPaid) {
        Optional<Repayment> repayment = repaymentRepository.findById(repaymentId);
        if (repayment.isPresent()) {
            Repayment r = repayment.get();
            r.setStatus("PAID");
            r.setAmountPaid(amountPaid);
            r.setPaidDate(new Date());
            
            // Decrement remaining installments in loan
            loanService.decrementRemainingInstallments(r.getLoanId());
            
            return repaymentRepository.save(r);
        }
        return null;
    }
    
    public Repayment markAsOverdue(String repaymentId) {
        Optional<Repayment> repayment = repaymentRepository.findById(repaymentId);
        if (repayment.isPresent()) {
            Repayment r = repayment.get();
            r.setStatus("OVERDUE");
            
            // Calculate penalty (5% of installment amount if overdue)
            double penalty = r.getInstallmentAmount() * 0.05;
            r.setPenalty(penalty);
            
            return repaymentRepository.save(r);
        }
        return null;
    }
    
    public Repayment updateRepayment(String id, Repayment repayment) {
        Optional<Repayment> existing = repaymentRepository.findById(id);
        if (existing.isPresent()) {
            repayment.setId(id);
            repayment.setCreatedAt(existing.get().getCreatedAt());
            return repaymentRepository.save(repayment);
        }
        return null;
    }
    
    public boolean deleteRepayment(String id) {
        Optional<Repayment> repayment = repaymentRepository.findById(id);
        if (repayment.isPresent()) {
            repaymentRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<Repayment> getRepaymentsByLoanIdAndStatus(String loanId, String status) {
        return repaymentRepository.findByLoanIdAndStatus(loanId, status);
    }
    
    public void createRepaymentSchedule(String loanId, List<Repayment> repayments) {
        for (Repayment repayment : repayments) {
            repayment.setLoanId(loanId);
            createRepayment(repayment);
        }
    }
}
