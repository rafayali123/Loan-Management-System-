package com.loanmanagement.service;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class SmsService {

    private final String TOKEN = "apit-UbRoEoEeIxnTUg0k5vxT0PQJbyO9EdVm-cCzHR";
    private final String Appname = "MOCEAN";

    @Async("taskExecutor")
    public void sendSmsAsync(String mobileNumber, String message) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://rest.moceanapi.com/rest/2/sms";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(TOKEN);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("mocean-from", Appname);
        map.add("mocean-to", mobileNumber);
        map.add("mocean-text", message);
        map.add("mocean-resp-format", "json");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            System.out.println("Mocean Response: " + response.getBody());
            Thread.sleep(2000);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            System.err.println("Thread interrupted: " + ie.getMessage());
        } catch (Exception e) {
            System.err.println("Error for " + mobileNumber + ": " + e.getMessage());
        }
    }
}

