package com.mtp.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication(scanBasePackages = "com.mtp")
@org.springframework.boot.autoconfigure.domain.EntityScan("com.mtp")
@org.springframework.data.jpa.repository.config.EnableJpaRepositories("com.mtp")
@org.springframework.cache.annotation.EnableCaching
@org.springframework.scheduling.annotation.EnableAsync
@org.springframework.scheduling.annotation.EnableScheduling
public class ApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

	@Bean
	public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatCustomizer() {
		return factory -> factory.addConnectorCustomizers(connector -> {
			connector.setProperty("maxHttpHeaderSize", "8388608");
			connector.setProperty("relaxedPathChars", "<>[\\]^`{|}");
			connector.setProperty("relaxedQueryChars", "<>[\\]^`{|}");
			connector.setProperty("maxParameterCount", "10000");
			connector.setURIEncoding("UTF-8");
		});
	}
}
