package com.mtp.school;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient

public class MtpSchoolServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MtpSchoolServiceApplication.class, args);
    }
}
