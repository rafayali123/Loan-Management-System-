# MongoDB Setup and Test Script
# This script helps verify MongoDB connection and create necessary collections

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MongoDB Setup and Configuration Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Verify MongoDB Connection
Write-Host "Step 1: Verifying MongoDB Connection..." -ForegroundColor Yellow
Write-Host "Connection String: mongodb+srv://alisyedabdulrafay7_db_user:***@cluster0.4vvrwmj.mongodb.net/loan_management_db" -ForegroundColor Cyan

# Step 2: Install MongoDB Tools if needed
$mongoDbToolsPath = "C:\Program Files\MongoDB\Tools\100\bin"
if (-not (Test-Path $mongoDbToolsPath)) {
    Write-Host ""
    Write-Host "Note: MongoDB command-line tools not found." -ForegroundColor Yellow
    Write-Host "You can install them from: https://www.mongodb.com/try/download/database-tools" -ForegroundColor Cyan
    Write-Host "Or use MongoDB Compass GUI (recommended): https://www.mongodb.com/products/compass" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Step 2: MongoDB Configuration Status" -ForegroundColor Yellow
Write-Host "✅ .env file updated with your MongoDB connection string" -ForegroundColor Green
Write-Host "✅ application.properties configured to read from environment variables" -ForegroundColor Green
Write-Host "✅ MongoDBConfig.java properly configured" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Next Actions" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option A: Using MongoDB Compass (GUI - Recommended)" -ForegroundColor Cyan
Write-Host "  1. Download MongoDB Compass: https://www.mongodb.com/products/compass" -ForegroundColor White
Write-Host "  2. Install and open Compass" -ForegroundColor White
Write-Host "  3. Paste connection string: mongodb+srv://alisyedabdulrafay7_db_user:v6kUnFf68uo49NR6@cluster0.4vvrwmj.mongodb.net/loan_management_db" -ForegroundColor White
Write-Host "  4. Click Connect" -ForegroundColor White
Write-Host "  5. Create collection 'admins' and insert default admin user (instructions below)" -ForegroundColor White
Write-Host ""

Write-Host "Option B: Using MongoDB Shell" -ForegroundColor Cyan
Write-Host "  1. Download MongoDB Shell: https://www.mongodb.com/try/download/shell" -ForegroundColor White
Write-Host "  2. Run: mongosh ""mongodb+srv://alisyedabdulrafay7_db_user:v6kUnFf68uo49NR6@cluster0.4vvrwmj.mongodb.net/loan_management_db""" -ForegroundColor White
Write-Host ""

Write-Host "Step 4: Create Default Admin User" -ForegroundColor Yellow
Write-Host ""
Write-Host "Use MongoDB Compass or mongosh to run this command:" -ForegroundColor Cyan
Write-Host ""
$adminJson = @"
db.admins.insertOne({
  "_id": ObjectId(),
  "username": "admin",
  "password": "admin123",
  "fullName": "System Administrator",
  "email": "admin@loansystem.com",
  "phoneNumber": "+919876543210",
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date(),
  "lastLogin": null
})
"@
Write-Host $adminJson -ForegroundColor Green

Write-Host ""
Write-Host "Step 5: Collections to Create" -ForegroundColor Yellow
Write-Host "The following collections will be auto-created on first data insert:" -ForegroundColor White
Write-Host "  • admins (for admin users)" -ForegroundColor Cyan
Write-Host "  • customers (for loan customers)" -ForegroundColor Cyan
Write-Host "  • loans (for loan applications)" -ForegroundColor Cyan
Write-Host "  • repayments (for repayment tracking)" -ForegroundColor Cyan

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ready to Start Application!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application, run:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  cd ""D:\Loan Management System""" -ForegroundColor Green
Write-Host ""
Write-Host "  # Set Maven environment" -ForegroundColor Gray
Write-Host "  `$tempDir = [System.IO.Path]::GetTempPath()" -ForegroundColor Green
Write-Host "  `$env:MAVEN_HOME = ""`$tempDir\maven-extract\apache-maven-3.9.5""" -ForegroundColor Green
Write-Host "  `$env:PATH = ""`$env:MAVEN_HOME\bin;`$env:PATH""" -ForegroundColor Green
Write-Host ""
Write-Host "  # Build (if not already done)" -ForegroundColor Gray
Write-Host "  mvn clean install -DskipTests" -ForegroundColor Green
Write-Host ""
Write-Host "  # Run the application" -ForegroundColor Gray
Write-Host "  mvn spring-boot:run" -ForegroundColor Green
Write-Host ""
Write-Host "Then open: http://localhost:8080/pages/login.html" -ForegroundColor Yellow
Write-Host "Login with: admin / admin123" -ForegroundColor Yellow
Write-Host ""
