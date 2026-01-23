package com.loanmanagement.service;

import com.loanmanagement.model.Admin;
import com.loanmanagement.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.Optional;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
    
    public Optional<Admin> getAdminById(String id) {
        return adminRepository.findById(id);
    }
    
    public Optional<Admin> getAdminByUsername(String username) {
        return adminRepository.findByUsername(username);
    }
    
    public Optional<Admin> getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }
    
    public Optional<Admin> authenticateAdmin(String username, String password) {
        return adminRepository.findByUsernameAndPassword(username, password);
    }
    
    public Admin updateAdmin(String id, Admin admin) {
        Optional<Admin> existing = adminRepository.findById(id);
        if (existing.isPresent()) {
            admin.setId(id);
            admin.setCreatedAt(existing.get().getCreatedAt());
            admin.setUpdatedAt(new Date());
            return adminRepository.save(admin);
        }
        return null;
    }
    
    public Admin updateLastLogin(String id) {
        Optional<Admin> existing = adminRepository.findById(id);
        if (existing.isPresent()) {
            Admin admin = existing.get();
            admin.setLastLoginAt(new Date());
            return adminRepository.save(admin);
        }
        return null;
    }
    
    public boolean deleteAdmin(String id) {
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isPresent()) {
            adminRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public void activateAdmin(String id) {
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isPresent()) {
            Admin a = admin.get();
            a.setActive(true);
            a.setUpdatedAt(new Date());
            adminRepository.save(a);
        }
    }
    
    public void deactivateAdmin(String id) {
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isPresent()) {
            Admin a = admin.get();
            a.setActive(false);
            a.setUpdatedAt(new Date());
            adminRepository.save(a);
        }
    }
}
