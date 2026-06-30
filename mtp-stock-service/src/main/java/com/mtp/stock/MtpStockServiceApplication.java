package com.mtp.stock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MtpStockServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MtpStockServiceApplication.class, args);
    }
}
