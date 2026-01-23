package com.loanmanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "repayments")
public class Repayment {
    
    @Id
    private String id;
    private String loanId;
    private String customerId;
    private double installmentAmount;
    private double amountPaid;
    private String status; // PENDING, PAID, OVERDUE
    private Date dueDate;
    private Date paidDate;
    private int installmentNumber;
    private double penalty;
    private String remarks;
    private Date createdAt;
    private Date updatedAt;
    
    // Constructors
    public Repayment() {
        this.status = "PENDING";
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.penalty = 0;
    }
    
    public Repayment(String loanId, String customerId, double installmentAmount, Date dueDate) {
        this();
        this.loanId = loanId;
        this.customerId = customerId;
        this.installmentAmount = installmentAmount;
        this.dueDate = dueDate;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getLoanId() {
        return loanId;
    }
    
    public void setLoanId(String loanId) {
        this.loanId = loanId;
    }
    
    public String getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }
    
    public double getInstallmentAmount() {
        return installmentAmount;
    }
    
    public void setInstallmentAmount(double installmentAmount) {
        this.installmentAmount = installmentAmount;
    }
    
    public double getAmountPaid() {
        return amountPaid;
    }
    
    public void setAmountPaid(double amountPaid) {
        this.amountPaid = amountPaid;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Date getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }
    
    public Date getPaidDate() {
        return paidDate;
    }
    
    public void setPaidDate(Date paidDate) {
        this.paidDate = paidDate;
    }
    
    public int getInstallmentNumber() {
        return installmentNumber;
    }
    
    public void setInstallmentNumber(int installmentNumber) {
        this.installmentNumber = installmentNumber;
    }
    
    public double getPenalty() {
        return penalty;
    }
    
    public void setPenalty(double penalty) {
        this.penalty = penalty;
    }
    
    public String getRemarks() {
        return remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
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
}
