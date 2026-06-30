package com.mtp.hotel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MtpHotelServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MtpHotelServiceApplication.class, args);
    }
}
