package com.mtp.billing.config; 

import org.springframework.context.annotation.Configuration; 
import jakarta.annotation.PostConstruct; 
import java.security.Security; 

@Configuration("billingTlsConfig") 
public class SecurityConfig { 
    @PostConstruct 
    public void init() { 
        String disabled = Security.getProperty("jdk.tls.disabledAlgorithms"); 
        if (disabled != null) { 
            disabled = disabled.replace("TLSv1, ", "").replace("TLSv1.1, ", "").replace("TLSv1,", "").replace("TLSv1.1,", ""); 
            Security.setProperty("jdk.tls.disabledAlgorithms", disabled); 
            System.out.println("Modified jdk.tls.disabledAlgorithms to support legacy SQL Servers: " + disabled);
        } 
    } 
}
