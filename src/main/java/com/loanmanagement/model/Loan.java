package com.loanmanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "loans")
public class Loan {
    
    @Id
    private String id;
    private String customerId;
    private String customerName;
    private String customerPhoneNumber;
    private double loanAmount;
    private double interestRate;
    private int loanTerm; // in months
    private String loanType;
    private String purpose;
    private String status; // PENDING, APPROVED, REJECTED, CLOSED
    private double monthlyInstallment;
    private int remainingInstallments;
    private Date applicationDate;
    private Date approvalDate;
    private Date loanStartDate;
    private Date loanEndDate;
    private Date createdAt;
    private Date updatedAt;
    private String rejectionReason;
    private String approvedBy;
    
    // Constructors
    public Loan() {
        this.status = "PENDING";
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.applicationDate = new Date();
    }
    
    public Loan(String customerId, double loanAmount, int loanTerm, String loanType) {
        this();
        this.customerId = customerId;
        this.loanAmount = loanAmount;
        this.loanTerm = loanTerm;
        this.loanType = loanType;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public String getCustomerPhoneNumber() {
        return customerPhoneNumber;
    }
    
    public void setCustomerPhoneNumber(String customerPhoneNumber) {
        this.customerPhoneNumber = customerPhoneNumber;
    }
    
    public double getLoanAmount() {
        return loanAmount;
    }
    
    public void setLoanAmount(double loanAmount) {
        this.loanAmount = loanAmount;
    }
    
    public double getInterestRate() {
        return interestRate;
    }
    
    public void setInterestRate(double interestRate) {
        this.interestRate = interestRate;
    }
    
    public int getLoanTerm() {
        return loanTerm;
    }
    
    public void setLoanTerm(int loanTerm) {
        this.loanTerm = loanTerm;
    }
    
    public String getLoanType() {
        return loanType;
    }
    
    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }
    
    public String getPurpose() {
        return purpose;
    }
    
    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public double getMonthlyInstallment() {
        return monthlyInstallment;
    }
    
    public void setMonthlyInstallment(double monthlyInstallment) {
        this.monthlyInstallment = monthlyInstallment;
    }
    
    public int getRemainingInstallments() {
        return remainingInstallments;
    }
    
    public void setRemainingInstallments(int remainingInstallments) {
        this.remainingInstallments = remainingInstallments;
    }
    
    public Date getApplicationDate() {
        return applicationDate;
    }
    
    public void setApplicationDate(Date applicationDate) {
        this.applicationDate = applicationDate;
    }
    
    public Date getApprovalDate() {
        return approvalDate;
    }
    
    public void setApprovalDate(Date approvalDate) {
        this.approvalDate = approvalDate;
    }
    
    public Date getLoanStartDate() {
        return loanStartDate;
    }
    
    public void setLoanStartDate(Date loanStartDate) {
        this.loanStartDate = loanStartDate;
    }
    
    public Date getLoanEndDate() {
        return loanEndDate;
    }
    
    public void setLoanEndDate(Date loanEndDate) {
        this.loanEndDate = loanEndDate;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    
    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getRejectionReason() {
        return rejectionReason;
    }
    
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
    
    public String getApprovedBy() {
        return approvedBy;
    }
    
    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }
}
