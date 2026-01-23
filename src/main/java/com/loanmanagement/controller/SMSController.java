package com.loanmanagement.controller;

import org.springframework.web.bind.annotation.*;

import com.loanmanagement.service.SmsService;

@RestController
@RequestMapping("/api/sms")


public class SMSController {

    private final SmsService smsService;

    public SMSController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send")
    public String sendSms(@RequestBody SmsRequest request) {

       try{
            smsService.sendSmsAsync(request.getPhoneNumber(), request.getMessage());
            return "SMS process initiated! It will be delivered shortly.";
       }
       catch(Exception ex){
         return "ERROR: " + ex.getMessage();
       }
    }

}
