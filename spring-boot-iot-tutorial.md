# Full IoT Tutorial with Java Spring Boot

> A comprehensive, hands-on guide to building a production-ready IoT backend platform from scratch — covering device management, MQTT messaging, real-time telemetry, alerting, and dashboards.

---

## Table of Contents

1. [IoT Architecture Overview](#1-iot-architecture-overview)
2. [Prerequisites & Project Setup](#2-prerequisites--project-setup)
3. [Device Management Service](#3-device-management-service)
4. [MQTT Broker Integration](#4-mqtt-broker-integration)
5. [Telemetry Ingestion Service](#5-telemetry-ingestion-service)
6. [Real-Time Data with WebSocket & SSE](#6-real-time-data-with-websocket--sse)
7. [Time-Series Storage with InfluxDB](#7-time-series-storage-with-influxdb)
8. [Alerting & Rule Engine](#8-alerting--rule-engine)
9. [REST API for Dashboard](#9-rest-api-for-dashboard)
10. [Device Authentication & Security](#10-device-authentication--security)
11. [OTA Firmware Updates](#11-ota-firmware-updates)
12. [Scheduled Tasks & Data Aggregation](#12-scheduled-tasks--data-aggregation)
13. [Kafka for Scalable Event Streaming](#13-kafka-for-scalable-event-streaming)
14. [Simulating IoT Devices](#14-simulating-iot-devices)
15. [Containerization with Docker Compose](#15-containerization-with-docker-compose)
16. [Summary & Next Steps](#16-summary--next-steps)

---

## 1. IoT Architecture Overview

### What We're Building

A full IoT platform that can:
- Register and manage physical devices
- Receive telemetry (temperature, humidity, GPS, etc.) from devices via **MQTT**
- Store time-series data in **InfluxDB**
- Evaluate alert rules and trigger notifications
- Stream live sensor data to dashboards via **WebSocket**
- Handle firmware OTA updates
- Scale with **Kafka** event streaming

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        IoT Devices / Sensors                        │
│         (ESP32, Raspberry Pi, Arduino, Simulators)                  │
└──────────────┬──────────────────────────┬───────────────────────────┘
               │  MQTT publish            │  HTTP (OTA / REST)
               ▼                          ▼
┌──────────────────────┐      ┌───────────────────────────┐
│   MQTT Broker        │      │   Spring Boot REST API     │
│   (Mosquitto :1883)  │      │   (api-server :8080)       │
└──────────┬───────────┘      └───────────────────────────┘
           │ subscribe                  │
           ▼                           ▼
┌──────────────────────────────────────────────────────────┐
│                 Spring Boot IoT Platform                  │
│  ┌─────────────────┐   ┌──────────────────────────────┐  │
│  │ MQTT Listener   │   │  Device Management Service   │  │
│  │ (Telemetry      │   │  (Registration, Auth, OTA)   │  │
│  │  Ingestion)     │   └──────────────────────────────┘  │
│  └────────┬────────┘                                      │
│           │                                               │
│  ┌────────▼────────┐   ┌──────────────────────────────┐  │
│  │ Kafka Producer  │   │    Alert / Rule Engine        │  │
│  └────────┬────────┘   └──────────────────────────────┘  │
│           │                                               │
│  ┌────────▼────────┐   ┌──────────────────────────────┐  │
│  │ Kafka Consumer  │──▶│  WebSocket / SSE Publisher   │  │
│  └────────┬────────┘   └───────────────────┬──────────┘  │
│           │                                │              │
│  ┌────────▼────────┐                       ▼              │
│  │  InfluxDB Store │              Dashboard Clients        │
│  └─────────────────┘                                      │
└──────────────────────────────────────────────────────────┘
         │
┌────────▼─────────────────────────────┐
│  PostgreSQL (devices, users, alerts)  │
│  Redis (sessions, rate limits, cache) │
└──────────────────────────────────────┘
```

### MQTT Topic Convention

```
iot/{tenant}/{deviceId}/telemetry      → sensor data
iot/{tenant}/{deviceId}/status         → online/offline heartbeat
iot/{tenant}/{deviceId}/command        → commands TO device
iot/{tenant}/{deviceId}/ota/response   → OTA status from device
```

---

## 2. Prerequisites & Project Setup

### Requirements

- Java 21+
- Maven 3.9+
- Docker & Docker Compose
- MQTT client tool: [MQTTX](https://mqttx.app/) (GUI) or `mosquitto_pub` (CLI)

### Project Structure

```
iot-platform/
├── src/
│   └── main/
│       ├── java/com/demo/iot/
│       │   ├── IotPlatformApplication.java
│       │   ├── config/
│       │   │   ├── MqttConfig.java
│       │   │   ├── InfluxDbConfig.java
│       │   │   ├── WebSocketConfig.java
│       │   │   ├── KafkaConfig.java
│       │   │   └── SecurityConfig.java
│       │   ├── device/
│       │   │   ├── Device.java
│       │   │   ├── DeviceRepository.java
│       │   │   ├── DeviceService.java
│       │   │   └── DeviceController.java
│       │   ├── telemetry/
│       │   │   ├── TelemetryPayload.java
│       │   │   ├── MqttTelemetryListener.java
│       │   │   ├── TelemetryService.java
│       │   │   └── TelemetryController.java
│       │   ├── alert/
│       │   │   ├── AlertRule.java
│       │   │   ├── AlertEvent.java
│       │   │   ├── AlertRuleRepository.java
│       │   │   └── AlertRuleEngine.java
│       │   ├── websocket/
│       │   │   └── TelemetryWebSocketHandler.java
│       │   ├── ota/
│       │   │   ├── FirmwareVersion.java
│       │   │   └── OtaService.java
│       │   └── scheduler/
│       │       └── DataAggregationScheduler.java
│       └── resources/
│           └── application.yml
├── docker-compose.yml
└── pom.xml
```

### `pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.demo</groupId>
  <artifactId>iot-platform</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.0</version>
  </parent>

  <properties>
    <java.version>21</java.version>
  </properties>

  <dependencies>
    <!-- Web -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- JPA + PostgreSQL -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>

    <!-- MQTT (Paho) -->
    <dependency>
      <groupId>org.springframework.integration</groupId>
      <artifactId>spring-integration-mqtt</artifactId>
    </dependency>

    <!-- WebSocket -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>

    <!-- Kafka -->
    <dependency>
      <groupId>org.springframework.kafka</groupId>
      <artifactId>spring-kafka</artifactId>
    </dependency>

    <!-- InfluxDB Client -->
    <dependency>
      <groupId>com.influxdb</groupId>
      <artifactId>influxdb-client-java</artifactId>
      <version>7.1.0</version>
    </dependency>

    <!-- Redis -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <!-- Security + JWT -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-api</artifactId>
      <version>0.11.5</version>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-impl</artifactId>
      <version>0.11.5</version>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-jackson</artifactId>
      <version>0.11.5</version>
      <scope>runtime</scope>
    </dependency>

    <!-- Validation -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Actuator -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

    <!-- Lombok -->
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>

    <!-- Jackson -->
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
    </dependency>
  </dependencies>
</project>
```

### `application.yml`

```yaml
server:
  port: 8080

spring:
  application:
    name: iot-platform

  datasource:
    url: jdbc:postgresql://localhost:5432/iotdb
    username: postgres
    password: secret
    hikari:
      maximum-pool-size: 20

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

  data:
    redis:
      host: localhost
      port: 6379
      timeout: 2000ms

  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: iot-platform-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*"

# MQTT
mqtt:
  broker-url: tcp://localhost:1883
  client-id: iot-platform-server
  username: admin
  password: admin
  qos: 1
  topic-prefix: "iot/#"

# InfluxDB
influxdb:
  url: http://localhost:8086
  token: my-super-secret-token
  org: iot-org
  bucket: telemetry

# JWT
jwt:
  secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
  expiration-ms: 86400000

# Alert thresholds (can be moved to DB)
alert:
  check-interval-ms: 5000
```

---

## 3. Device Management Service

### Device Entity

```java
// Device.java
package com.demo.iot.device;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "devices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String deviceKey;          // unique identifier sent by device

    @Column(nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    private DeviceType type;           // SENSOR, ACTUATOR, GATEWAY

    @Enumerated(EnumType.STRING)
    private DeviceStatus status;       // ACTIVE, INACTIVE, BLOCKED

    private String tenantId;

    private String location;           // e.g. "Building A - Floor 2"
    private Double latitude;
    private Double longitude;

    private String firmwareVersion;

    private String apiKey;             // hashed secret for device auth

    private Instant lastSeenAt;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
```

### Enums

```java
// DeviceType.java
public enum DeviceType {
    TEMPERATURE_SENSOR,
    HUMIDITY_SENSOR,
    PRESSURE_SENSOR,
    GPS_TRACKER,
    SMART_METER,
    ACTUATOR,
    GATEWAY,
    GENERIC
}

// DeviceStatus.java
public enum DeviceStatus {
    ACTIVE, INACTIVE, BLOCKED, PENDING
}
```

### Repository

```java
// DeviceRepository.java
package com.demo.iot.device;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {

    Optional<Device> findByDeviceKey(String deviceKey);
    Optional<Device> findByApiKey(String apiKey);

    List<Device> findByTenantId(String tenantId);
    List<Device> findByStatus(DeviceStatus status);

    @Modifying
    @Query("UPDATE Device d SET d.lastSeenAt = :time, d.status = 'ACTIVE' WHERE d.deviceKey = :key")
    void updateLastSeen(String key, Instant time);

    @Query("SELECT d FROM Device d WHERE d.lastSeenAt < :cutoff AND d.status = 'ACTIVE'")
    List<Device> findStaleDevices(Instant cutoff);
}
```

### DTOs

```java
// DeviceRequest.java
package com.demo.iot.device;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class DeviceRequest {
    @NotBlank private String name;
    private String description;
    @NotNull  private DeviceType type;
    @NotBlank private String tenantId;
    private String location;
    private Double latitude;
    private Double longitude;
}

// DeviceResponse.java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceResponse {
    private String id;
    private String deviceKey;
    private String name;
    private String description;
    private DeviceType type;
    private DeviceStatus status;
    private String tenantId;
    private String location;
    private Double latitude;
    private Double longitude;
    private String firmwareVersion;
    private String lastSeenAt;
    private String createdAt;
}
```

### Service

```java
// DeviceService.java
package com.demo.iot.device;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;

    @Transactional
    public DeviceResponse registerDevice(DeviceRequest request) {
        String deviceKey = "DEV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String apiKey    = UUID.randomUUID().toString().replace("-", "");

        Device device = Device.builder()
                .deviceKey(deviceKey)
                .name(request.getName())
                .description(request.getDescription())
                .type(request.getType())
                .status(DeviceStatus.ACTIVE)
                .tenantId(request.getTenantId())
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .firmwareVersion("1.0.0")
                .apiKey(apiKey)
                .build();

        return toResponse(deviceRepository.save(device));
    }

    public DeviceResponse getDevice(UUID id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found: " + id));
        return toResponse(device);
    }

    public List<DeviceResponse> getDevicesByTenant(String tenantId) {
        return deviceRepository.findByTenantId(tenantId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void markDeviceOnline(String deviceKey) {
        deviceRepository.updateLastSeen(deviceKey, Instant.now());
    }

    @Transactional
    public void blockDevice(UUID id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        device.setStatus(DeviceStatus.BLOCKED);
        deviceRepository.save(device);
    }

    public boolean validateApiKey(String deviceKey, String apiKey) {
        return deviceRepository.findByDeviceKey(deviceKey)
                .map(d -> d.getApiKey().equals(apiKey))
                .orElse(false);
    }

    private DeviceResponse toResponse(Device d) {
        return DeviceResponse.builder()
                .id(d.getId().toString())
                .deviceKey(d.getDeviceKey())
                .name(d.getName())
                .description(d.getDescription())
                .type(d.getType())
                .status(d.getStatus())
                .tenantId(d.getTenantId())
                .location(d.getLocation())
                .latitude(d.getLatitude())
                .longitude(d.getLongitude())
                .firmwareVersion(d.getFirmwareVersion())
                .lastSeenAt(d.getLastSeenAt() != null ? d.getLastSeenAt().toString() : null)
                .createdAt(d.getCreatedAt().toString())
                .build();
    }
}
```

### Controller

```java
// DeviceController.java
package com.demo.iot.device;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping
    public ResponseEntity<DeviceResponse> register(@Valid @RequestBody DeviceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deviceService.registerDevice(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(deviceService.getDevice(id));
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<DeviceResponse>> getByTenant(@PathVariable String tenantId) {
        return ResponseEntity.ok(deviceService.getDevicesByTenant(tenantId));
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<Void> block(@PathVariable UUID id) {
        deviceService.blockDevice(id);
        return ResponseEntity.ok().build();
    }
}
```

---

## 4. MQTT Broker Integration

### MQTT Configuration

```java
// MqttConfig.java
package com.demo.iot.config;

import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

@Configuration
public class MqttConfig {

    @Value("${mqtt.broker-url}")
    private String brokerUrl;

    @Value("${mqtt.client-id}")
    private String clientId;

    @Value("${mqtt.username}")
    private String username;

    @Value("${mqtt.password}")
    private String password;

    @Value("${mqtt.topic-prefix}")
    private String topicPrefix;

    @Bean
    public DefaultMqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{brokerUrl});
        options.setUserName(username);
        options.setPassword(password.toCharArray());
        options.setAutomaticReconnect(true);
        options.setCleanSession(false);
        options.setKeepAliveInterval(60);
        factory.setConnectionOptions(options);
        return factory;
    }

    // ─── Inbound (subscribe) ──────────────────────────────────────

    @Bean
    public MessageChannel mqttInboundChannel() {
        return new DirectChannel();
    }

    @Bean
    public MqttPahoMessageDrivenChannelAdapter mqttInboundAdapter() {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(
                        clientId + "-inbound", mqttClientFactory(), topicPrefix);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInboundChannel());
        return adapter;
    }

    // ─── Outbound (publish) ───────────────────────────────────────

    @Bean
    public MessageChannel mqttOutboundChannel() {
        return new DirectChannel();
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttOutboundChannel")
    public MessageHandler mqttOutboundHandler() {
        MqttPahoMessageHandler handler =
                new MqttPahoMessageHandler(clientId + "-outbound", mqttClientFactory());
        handler.setAsync(true);
        handler.setDefaultQos(1);
        return handler;
    }
}
```

### MQTT Publisher Gateway

```java
// MqttGateway.java
package com.demo.iot.config;

import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.handler.annotation.Header;

@MessagingGateway(defaultRequestChannel = "mqttOutboundChannel")
public interface MqttGateway {
    void publish(@Header(MqttHeaders.TOPIC) String topic, String payload);
    void publish(@Header(MqttHeaders.TOPIC) String topic,
                 @Header(MqttHeaders.QOS) int qos,
                 String payload);
}
```

---

## 5. Telemetry Ingestion Service

### Telemetry Payload Model

```java
// TelemetryPayload.java
package com.demo.iot.telemetry;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.time.Instant;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TelemetryPayload {
    private String deviceKey;
    private String tenantId;
    private Instant timestamp;            // device-reported time; null → use server time
    private Map<String, Object> fields;   // e.g. {"temperature": 25.4, "humidity": 60}
    private Map<String, String> tags;     // e.g. {"unit": "celsius", "floor": "2"}
}
```

Example JSON a device sends via MQTT:

```json
{
  "deviceKey": "DEV-A1B2C3D4",
  "tenantId": "tenant-001",
  "timestamp": "2024-06-15T08:30:00Z",
  "fields": {
    "temperature": 25.4,
    "humidity": 60.2,
    "battery": 87
  },
  "tags": {
    "unit": "celsius",
    "location": "room-101"
  }
}
```

### MQTT Listener

```java
// MqttTelemetryListener.java
package com.demo.iot.telemetry;

import com.demo.iot.device.DeviceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MqttTelemetryListener {

    private final TelemetryService telemetryService;
    private final DeviceService deviceService;
    private final ObjectMapper objectMapper;

    @ServiceActivator(inputChannel = "mqttInboundChannel")
    public void handleMqttMessage(Message<String> message) {
        String topic   = (String) message.getHeaders().get("mqtt_receivedTopic");
        String payload = message.getPayload();

        log.debug("MQTT message on topic [{}]: {}", topic, payload);

        try {
            if (topic == null) return;

            // Topic format: iot/{tenant}/{deviceId}/telemetry
            String[] parts = topic.split("/");
            if (parts.length < 4) return;

            String messageType = parts[3]; // telemetry | status | ota/response

            switch (messageType) {
                case "telemetry"  -> handleTelemetry(payload);
                case "status"     -> handleStatus(parts[2], payload);
                default           -> log.warn("Unknown message type: {}", messageType);
            }

        } catch (Exception e) {
            log.error("Failed to process MQTT message on {}: {}", topic, e.getMessage());
        }
    }

    private void handleTelemetry(String payload) throws Exception {
        TelemetryPayload telemetry = objectMapper.readValue(payload, TelemetryPayload.class);
        telemetryService.ingest(telemetry);
    }

    private void handleStatus(String deviceKey, String payload) {
        deviceService.markDeviceOnline(deviceKey);
        log.info("Device [{}] sent status update", deviceKey);
    }
}
```

### Telemetry Service

```java
// TelemetryService.java
package com.demo.iot.telemetry;

import com.demo.iot.alert.AlertRuleEngine;
import com.demo.iot.kafka.TelemetryKafkaProducer;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class TelemetryService {

    private final WriteApiBlocking influxWriteApi;
    private final AlertRuleEngine alertRuleEngine;
    private final TelemetryKafkaProducer kafkaProducer;

    public void ingest(TelemetryPayload payload) {
        Instant ts = payload.getTimestamp() != null ? payload.getTimestamp() : Instant.now();

        // Build InfluxDB data point
        Point point = Point.measurement("telemetry")
                .time(ts, WritePrecision.MS)
                .addTag("deviceKey", payload.getDeviceKey())
                .addTag("tenantId",  payload.getTenantId());

        // Add custom tags from device
        if (payload.getTags() != null) {
            payload.getTags().forEach(point::addTag);
        }

        // Add all measurement fields
        if (payload.getFields() != null) {
            payload.getFields().forEach((k, v) -> {
                if (v instanceof Number n) point.addField(k, n.doubleValue());
                else if (v instanceof Boolean b) point.addField(k, b);
                else point.addField(k, v.toString());
            });
        }

        // Write to InfluxDB
        try {
            influxWriteApi.writePoint(point);
            log.debug("Telemetry written to InfluxDB for device: {}", payload.getDeviceKey());
        } catch (Exception e) {
            log.error("InfluxDB write error: {}", e.getMessage());
        }

        // Publish to Kafka for downstream consumers (WebSocket, alerting, ML, etc.)
        kafkaProducer.publishTelemetry(payload);

        // Evaluate alert rules synchronously (or async via Kafka consumer)
        alertRuleEngine.evaluate(payload);
    }
}
```

---

## 6. Real-Time Data with WebSocket & SSE

### WebSocket Configuration

```java
// WebSocketConfig.java
package com.demo.iot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final TelemetryWebSocketHandler telemetryWebSocketHandler;

    public WebSocketConfig(TelemetryWebSocketHandler handler) {
        this.telemetryWebSocketHandler = handler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(telemetryWebSocketHandler, "/ws/telemetry")
                .setAllowedOrigins("*");
    }
}
```

### WebSocket Handler

```java
// TelemetryWebSocketHandler.java
package com.demo.iot.websocket;

import com.demo.iot.telemetry.TelemetryPayload;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class TelemetryWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;

    // sessionId → WebSocketSession
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    // deviceKey → Set of sessionIds subscribed to it
    private final Map<String, Set<String>> subscriptions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.put(session.getId(), session);
        log.info("WebSocket connected: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Client sends: {"action":"subscribe","deviceKey":"DEV-A1B2C3D4"}
        Map<?, ?> msg = objectMapper.readValue(message.getPayload(), Map.class);
        String action    = (String) msg.get("action");
        String deviceKey = (String) msg.get("deviceKey");

        if ("subscribe".equals(action) && deviceKey != null) {
            subscriptions.computeIfAbsent(deviceKey, k -> ConcurrentHashMap.newKeySet())
                         .add(session.getId());
            session.sendMessage(new TextMessage("{\"status\":\"subscribed\",\"deviceKey\":\"" + deviceKey + "\"}"));
            log.info("Session {} subscribed to device {}", session.getId(), deviceKey);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session.getId());
        subscriptions.values().forEach(s -> s.remove(session.getId()));
        log.info("WebSocket disconnected: {}", session.getId());
    }

    /** Called by Kafka consumer to broadcast telemetry to subscribed clients */
    public void broadcast(TelemetryPayload payload) {
        Set<String> sessionIds = subscriptions.getOrDefault(payload.getDeviceKey(), Set.of());
        if (sessionIds.isEmpty()) return;

        try {
            String json = objectMapper.writeValueAsString(payload);
            for (String sessionId : sessionIds) {
                WebSocketSession session = sessions.get(sessionId);
                if (session != null && session.isOpen()) {
                    synchronized (session) {
                        session.sendMessage(new TextMessage(json));
                    }
                }
            }
        } catch (Exception e) {
            log.error("WebSocket broadcast error: {}", e.getMessage());
        }
    }
}
```

### Server-Sent Events (SSE) – Alternative to WebSocket

```java
// SseTelemetryController.java
package com.demo.iot.telemetry;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
@RequestMapping("/api/stream")
public class SseTelemetryController {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    @GetMapping(value = "/{deviceKey}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@PathVariable String deviceKey) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(deviceKey, emitter);

        emitter.onCompletion(() -> emitters.remove(deviceKey));
        emitter.onTimeout(()    -> emitters.remove(deviceKey));
        emitter.onError(e       -> emitters.remove(deviceKey));

        return emitter;
    }

    /** Called by TelemetryService or Kafka consumer */
    public void push(TelemetryPayload payload) {
        SseEmitter emitter = emitters.get(payload.getDeviceKey());
        if (emitter == null) return;
        try {
            emitter.send(SseEmitter.event()
                    .name("telemetry")
                    .data(payload));
        } catch (Exception e) {
            emitters.remove(payload.getDeviceKey());
        }
    }
}
```

---

## 7. Time-Series Storage with InfluxDB

### InfluxDB Configuration

```java
// InfluxDbConfig.java
package com.demo.iot.config;

import com.influxdb.client.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;

@Configuration
public class InfluxDbConfig {

    @Value("${influxdb.url}")     private String url;
    @Value("${influxdb.token}")   private String token;
    @Value("${influxdb.org}")     private String org;
    @Value("${influxdb.bucket}")  private String bucket;

    @Bean
    public InfluxDBClient influxDBClient() {
        return InfluxDBClientFactory.create(url, token.toCharArray(), org, bucket);
    }

    @Bean
    public WriteApiBlocking writeApiBlocking(InfluxDBClient client) {
        return client.getWriteApiBlocking();
    }

    @Bean
    public QueryApi queryApi(InfluxDBClient client) {
        return client.getQueryApi();
    }
}
```

### Querying Historical Telemetry

```java
// TelemetryQueryService.java
package com.demo.iot.telemetry;

import com.influxdb.client.QueryApi;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TelemetryQueryService {

    private final QueryApi queryApi;

    @Value("${influxdb.org}")   private String org;
    @Value("${influxdb.bucket}") private String bucket;

    /**
     * Query telemetry for a device over the last N hours.
     * Returns a list of data points: [{time, field, value}, ...]
     */
    public List<Map<String, Object>> query(String deviceKey, String field, int hours) {
        String flux = String.format("""
            from(bucket: "%s")
              |> range(start: -%dh)
              |> filter(fn: (r) => r._measurement == "telemetry")
              |> filter(fn: (r) => r.deviceKey == "%s")
              |> filter(fn: (r) => r._field == "%s")
              |> sort(columns: ["_time"])
            """, bucket, hours, deviceKey, field);

        List<FluxTable> tables = queryApi.query(flux, org);
        List<Map<String, Object>> result = new ArrayList<>();

        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("time",  record.getTime());
                row.put("field", record.getField());
                row.put("value", record.getValue());
                result.add(row);
            }
        }
        return result;
    }

    /**
     * Get the latest telemetry reading for a device.
     */
    public Map<String, Object> getLatest(String deviceKey) {
        String flux = String.format("""
            from(bucket: "%s")
              |> range(start: -24h)
              |> filter(fn: (r) => r._measurement == "telemetry")
              |> filter(fn: (r) => r.deviceKey == "%s")
              |> last()
            """, bucket, deviceKey);

        List<FluxTable> tables = queryApi.query(flux, org);
        Map<String, Object> result = new LinkedHashMap<>();

        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                result.put(record.getField(), record.getValue());
            }
        }
        return result;
    }

    /**
     * Aggregate — get hourly averages for a field.
     */
    public List<Map<String, Object>> aggregate(String deviceKey, String field, int hours) {
        String flux = String.format("""
            from(bucket: "%s")
              |> range(start: -%dh)
              |> filter(fn: (r) => r._measurement == "telemetry")
              |> filter(fn: (r) => r.deviceKey == "%s")
              |> filter(fn: (r) => r._field == "%s")
              |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
              |> yield(name: "mean")
            """, bucket, hours, deviceKey, field);

        List<FluxTable> tables = queryApi.query(flux, org);
        List<Map<String, Object>> result = new ArrayList<>();

        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("time",  record.getTime());
                row.put("value", record.getValue());
                result.add(row);
            }
        }
        return result;
    }
}
```

---

## 8. Alerting & Rule Engine

### Alert Rule Entity

```java
// AlertRule.java
package com.demo.iot.alert;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "alert_rules")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AlertRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String deviceKey;
    private String tenantId;
    private String field;               // e.g. "temperature"

    @Enumerated(EnumType.STRING)
    private AlertCondition condition;   // GREATER_THAN, LESS_THAN, EQUAL_TO, NOT_EQUAL_TO

    private Double threshold;

    private String message;             // "Temperature exceeded safe limit!"
    private String notifyEmail;
    private boolean enabled;
}
```

### Alert Condition Enum

```java
// AlertCondition.java
public enum AlertCondition {
    GREATER_THAN,
    LESS_THAN,
    EQUAL_TO,
    NOT_EQUAL_TO
}
```

### Alert Event

```java
// AlertEvent.java
package com.demo.iot.alert;

import lombok.*;
import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AlertEvent {
    private String ruleId;
    private String deviceKey;
    private String tenantId;
    private String field;
    private double actualValue;
    private double threshold;
    private AlertCondition condition;
    private String message;
    private Instant triggeredAt;
}
```

### Alert Rule Engine

```java
// AlertRuleEngine.java
package com.demo.iot.alert;

import com.demo.iot.telemetry.TelemetryPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class AlertRuleEngine {

    private final AlertRuleRepository alertRuleRepository;
    private final KafkaTemplate<String, AlertEvent> kafkaTemplate;

    public void evaluate(TelemetryPayload payload) {
        List<AlertRule> rules = alertRuleRepository
                .findByDeviceKeyAndEnabled(payload.getDeviceKey(), true);

        for (AlertRule rule : rules) {
            Object raw = payload.getFields().get(rule.getField());
            if (raw == null) continue;

            double actual = ((Number) raw).doubleValue();

            boolean triggered = switch (rule.getCondition()) {
                case GREATER_THAN -> actual > rule.getThreshold();
                case LESS_THAN    -> actual < rule.getThreshold();
                case EQUAL_TO     -> actual == rule.getThreshold();
                case NOT_EQUAL_TO -> actual != rule.getThreshold();
            };

            if (triggered) {
                AlertEvent event = AlertEvent.builder()
                        .ruleId(rule.getId().toString())
                        .deviceKey(rule.getDeviceKey())
                        .tenantId(rule.getTenantId())
                        .field(rule.getField())
                        .actualValue(actual)
                        .threshold(rule.getThreshold())
                        .condition(rule.getCondition())
                        .message(rule.getMessage())
                        .triggeredAt(Instant.now())
                        .build();

                log.warn("ALERT TRIGGERED: device={} field={} value={} threshold={}",
                        rule.getDeviceKey(), rule.getField(), actual, rule.getThreshold());

                // Publish to Kafka topic for notification service
                kafkaTemplate.send("device-alerts", event);
            }
        }
    }
}
```

### Alert Rule Repository

```java
// AlertRuleRepository.java
package com.demo.iot.alert;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AlertRuleRepository extends JpaRepository<AlertRule, UUID> {
    List<AlertRule> findByDeviceKeyAndEnabled(String deviceKey, boolean enabled);
    List<AlertRule> findByTenantId(String tenantId);
}
```

### Notification Consumer (listens to alert topic)

```java
// AlertNotificationConsumer.java
package com.demo.iot.alert;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AlertNotificationConsumer {

    @KafkaListener(topics = "device-alerts", groupId = "alert-notification-group")
    public void handleAlert(AlertEvent event) {
        log.error("🚨 ALERT: [{}] {} {} {} (actual: {})",
                event.getDeviceKey(),
                event.getField(),
                event.getCondition(),
                event.getThreshold(),
                event.getActualValue());

        // Integrate with email (Spring Mail), Slack webhook, SMS (Twilio), etc.
        sendEmailNotification(event);
    }

    private void sendEmailNotification(AlertEvent event) {
        // Use JavaMailSender or any notification library
        log.info("Sending alert email for device: {}", event.getDeviceKey());
    }
}
```

---

## 9. REST API for Dashboard

```java
// TelemetryController.java
package com.demo.iot.telemetry;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/telemetry")
@RequiredArgsConstructor
public class TelemetryController {

    private final TelemetryQueryService queryService;

    /** GET /api/telemetry/{deviceKey}/latest */
    @GetMapping("/{deviceKey}/latest")
    public ResponseEntity<Map<String, Object>> getLatest(@PathVariable String deviceKey) {
        return ResponseEntity.ok(queryService.getLatest(deviceKey));
    }

    /** GET /api/telemetry/{deviceKey}/history?field=temperature&hours=24 */
    @GetMapping("/{deviceKey}/history")
    public ResponseEntity<List<Map<String, Object>>> getHistory(
            @PathVariable String deviceKey,
            @RequestParam String field,
            @RequestParam(defaultValue = "24") int hours) {
        return ResponseEntity.ok(queryService.query(deviceKey, field, hours));
    }

    /** GET /api/telemetry/{deviceKey}/aggregate?field=temperature&hours=48 */
    @GetMapping("/{deviceKey}/aggregate")
    public ResponseEntity<List<Map<String, Object>>> getAggregated(
            @PathVariable String deviceKey,
            @RequestParam String field,
            @RequestParam(defaultValue = "48") int hours) {
        return ResponseEntity.ok(queryService.aggregate(deviceKey, field, hours));
    }
}
```

### Alert Rule REST API

```java
// AlertRuleController.java
package com.demo.iot.alert;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/alert-rules")
@RequiredArgsConstructor
public class AlertRuleController {

    private final AlertRuleRepository alertRuleRepository;

    @PostMapping
    public ResponseEntity<AlertRule> create(@RequestBody AlertRule rule) {
        rule.setEnabled(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(alertRuleRepository.save(rule));
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<AlertRule>> getByTenant(@PathVariable String tenantId) {
        return ResponseEntity.ok(alertRuleRepository.findByTenantId(tenantId));
    }

    @PutMapping("/{id}/disable")
    public ResponseEntity<Void> disable(@PathVariable UUID id) {
        alertRuleRepository.findById(id).ifPresent(r -> {
            r.setEnabled(false);
            alertRuleRepository.save(r);
        });
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        alertRuleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 10. Device Authentication & Security

### Devices authenticate with an `X-API-Key` header. Users authenticate with JWT.

### Security Configuration

```java
// SecurityConfig.java
package com.demo.iot.config;

import com.demo.iot.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final DeviceApiKeyFilter deviceApiKeyFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(c -> c.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        // Device-only endpoints (API key auth)
                        .requestMatchers("/api/device/**").hasAuthority("DEVICE")
                        // Admin dashboard
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // All other endpoints need user JWT
                        .anyRequest().authenticated()
                )
                // Device API key filter runs before JWT filter
                .addFilterBefore(deviceApiKeyFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
```

### Device API Key Filter

```java
// DeviceApiKeyFilter.java
package com.demo.iot.security;

import com.demo.iot.device.DeviceService;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DeviceApiKeyFilter extends OncePerRequestFilter {

    private final DeviceService deviceService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String apiKey   = request.getHeader("X-API-Key");
        String deviceKey = request.getHeader("X-Device-Key");

        if (apiKey != null && deviceKey != null) {
            boolean valid = deviceService.validateApiKey(deviceKey, apiKey);
            if (valid) {
                var auth = new UsernamePasswordAuthenticationToken(
                        deviceKey, null,
                        List.of(new SimpleGrantedAuthority("DEVICE")));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        chain.doFilter(request, response);
    }
}
```

---

## 11. OTA Firmware Updates

### Firmware Entity

```java
// FirmwareVersion.java
package com.demo.iot.ota;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "firmware_versions")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FirmwareVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String version;       // e.g. "2.1.4"
    private String deviceType;    // targets which DeviceType
    private String downloadUrl;   // S3 or local storage URL
    private String checksum;      // MD5/SHA256 of the firmware file
    private boolean stable;

    @CreationTimestamp
    private Instant uploadedAt;
}
```

### OTA Service

```java
// OtaService.java
package com.demo.iot.ota;

import com.demo.iot.config.MqttGateway;
import com.demo.iot.device.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtaService {

    private final FirmwareVersionRepository firmwareRepo;
    private final DeviceRepository deviceRepository;
    private final MqttGateway mqttGateway;
    private final ObjectMapper objectMapper;

    /**
     * Push an OTA update command to a device via MQTT.
     * Device downloads from downloadUrl and reboots.
     */
    public void pushUpdate(UUID deviceId, UUID firmwareId) throws Exception {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        FirmwareVersion fw = firmwareRepo.findById(firmwareId)
                .orElseThrow(() -> new RuntimeException("Firmware not found"));

        Map<String, String> command = Map.of(
                "action",      "ota_update",
                "version",     fw.getVersion(),
                "downloadUrl", fw.getDownloadUrl(),
                "checksum",    fw.getChecksum()
        );

        String topic   = String.format("iot/%s/%s/command", device.getTenantId(), device.getDeviceKey());
        String payload = objectMapper.writeValueAsString(command);

        mqttGateway.publish(topic, payload);

        log.info("OTA update pushed to device {} → firmware {}", device.getDeviceKey(), fw.getVersion());
    }
}
```

### OTA Controller

```java
// OtaController.java
package com.demo.iot.ota;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/ota")
@RequiredArgsConstructor
public class OtaController {

    private final OtaService otaService;
    private final FirmwareVersionRepository firmwareRepo;

    @PostMapping("/push/{deviceId}/{firmwareId}")
    public ResponseEntity<String> push(@PathVariable UUID deviceId,
                                       @PathVariable UUID firmwareId) throws Exception {
        otaService.pushUpdate(deviceId, firmwareId);
        return ResponseEntity.ok("OTA update command sent");
    }

    @PostMapping("/firmware")
    public ResponseEntity<FirmwareVersion> uploadFirmware(@RequestBody FirmwareVersion fw) {
        return ResponseEntity.ok(firmwareRepo.save(fw));
    }
}
```

---

## 12. Scheduled Tasks & Data Aggregation

```java
// DataAggregationScheduler.java
package com.demo.iot.scheduler;

import com.demo.iot.device.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class DataAggregationScheduler {

    private final DeviceRepository deviceRepository;

    /**
     * Every 5 minutes: mark devices as INACTIVE if they haven't sent data in 10 minutes.
     */
    @Scheduled(fixedDelay = 300_000)
    public void detectOfflineDevices() {
        Instant cutoff = Instant.now().minus(10, ChronoUnit.MINUTES);
        List<Device> stale = deviceRepository.findStaleDevices(cutoff);

        for (Device device : stale) {
            device.setStatus(DeviceStatus.INACTIVE);
            log.warn("Device marked INACTIVE (no heartbeat): {}", device.getDeviceKey());
        }
        deviceRepository.saveAll(stale);
    }

    /**
     * Every hour: log a summary of active vs inactive devices.
     */
    @Scheduled(cron = "0 0 * * * *")  // top of every hour
    public void hourlyHealthReport() {
        long active   = deviceRepository.findByStatus(DeviceStatus.ACTIVE).size();
        long inactive = deviceRepository.findByStatus(DeviceStatus.INACTIVE).size();
        log.info("Device Health Report — Active: {}, Inactive: {}", active, inactive);
    }

    /**
     * Daily at midnight: clean up very old telemetry in PostgreSQL if any log table exists.
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void dailyMaintenance() {
        log.info("Running daily maintenance tasks...");
        // e.g. purge old alert history, compress logs, archive records
    }
}
```

---

## 13. Kafka for Scalable Event Streaming

### Kafka Configuration

```java
// KafkaConfig.java
package com.demo.iot.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean public NewTopic telemetryTopic() {
        return TopicBuilder.name("device-telemetry").partitions(6).replicas(1).build();
    }

    @Bean public NewTopic alertTopic() {
        return TopicBuilder.name("device-alerts").partitions(3).replicas(1).build();
    }

    @Bean public NewTopic commandTopic() {
        return TopicBuilder.name("device-commands").partitions(3).replicas(1).build();
    }
}
```

### Telemetry Kafka Producer

```java
// TelemetryKafkaProducer.java
package com.demo.iot.kafka;

import com.demo.iot.telemetry.TelemetryPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TelemetryKafkaProducer {

    private final KafkaTemplate<String, TelemetryPayload> kafkaTemplate;

    public void publishTelemetry(TelemetryPayload payload) {
        kafkaTemplate.send("device-telemetry", payload.getDeviceKey(), payload)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to send telemetry to Kafka: {}", ex.getMessage());
                    }
                });
    }
}
```

### Telemetry Kafka Consumer (WebSocket fan-out)

```java
// TelemetryKafkaConsumer.java
package com.demo.iot.kafka;

import com.demo.iot.telemetry.TelemetryPayload;
import com.demo.iot.telemetry.SseTelemetryController;
import com.demo.iot.websocket.TelemetryWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TelemetryKafkaConsumer {

    private final TelemetryWebSocketHandler webSocketHandler;
    private final SseTelemetryController sseController;

    @KafkaListener(topics = "device-telemetry", groupId = "websocket-fanout-group")
    public void consume(TelemetryPayload payload) {
        log.debug("Kafka → WebSocket fanout for device: {}", payload.getDeviceKey());
        webSocketHandler.broadcast(payload);
        sseController.push(payload);
    }
}
```

---

## 14. Simulating IoT Devices

A Java-based device simulator that publishes MQTT messages, for testing the platform without real hardware.

### Device Simulator

```java
// DeviceSimulator.java
package com.demo.iot.simulator;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.paho.client.mqttv3.*;

import java.time.Instant;
import java.util.Map;
import java.util.Random;

/**
 * Run this as a standalone main class to simulate a temperature/humidity sensor.
 * Dependencies: org.eclipse.paho:org.eclipse.paho.client.mqttv3:1.2.5
 */
public class DeviceSimulator {

    private static final String BROKER_URL = "tcp://localhost:1883";
    private static final String DEVICE_KEY = "DEV-A1B2C3D4";
    private static final String TENANT_ID  = "tenant-001";
    private static final String API_KEY    = "your-device-api-key";

    private static final Random random = new Random();
    private static final ObjectMapper mapper = new ObjectMapper();

    public static void main(String[] args) throws Exception {
        MqttClient client = new MqttClient(BROKER_URL, "simulator-" + DEVICE_KEY);
        MqttConnectOptions options = new MqttConnectOptions();
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        client.connect(options);

        System.out.println("Simulator connected. Publishing every 5 seconds...");

        while (true) {
            publishTelemetry(client);
            publishStatus(client);
            Thread.sleep(5000);
        }
    }

    private static void publishTelemetry(MqttClient client) throws Exception {
        Map<String, Object> payload = Map.of(
                "deviceKey", DEVICE_KEY,
                "tenantId",  TENANT_ID,
                "timestamp", Instant.now().toString(),
                "fields", Map.of(
                        "temperature", 20.0 + random.nextDouble() * 15,   // 20–35 °C
                        "humidity",    40.0 + random.nextDouble() * 40,   // 40–80 %
                        "battery",     70 + random.nextInt(30)            // 70–100 %
                ),
                "tags", Map.of(
                        "unit",     "celsius",
                        "location", "room-101"
                )
        );

        String topic = String.format("iot/%s/%s/telemetry", TENANT_ID, DEVICE_KEY);
        String json  = mapper.writeValueAsString(payload);
        client.publish(topic, new MqttMessage(json.getBytes()));
        System.out.println("Published telemetry: " + json);
    }

    private static void publishStatus(MqttClient client) throws Exception {
        String topic   = String.format("iot/%s/%s/status", TENANT_ID, DEVICE_KEY);
        String payload = "{\"status\":\"online\",\"apiKey\":\"" + API_KEY + "\"}";
        client.publish(topic, new MqttMessage(payload.getBytes()));
    }
}
```

### MQTT CLI Testing

```bash
# Subscribe to all IoT messages
mosquitto_sub -h localhost -p 1883 -t "iot/#" -v

# Manually publish telemetry
mosquitto_pub -h localhost -p 1883 \
  -t "iot/tenant-001/DEV-A1B2C3D4/telemetry" \
  -m '{"deviceKey":"DEV-A1B2C3D4","tenantId":"tenant-001","fields":{"temperature":42.5}}'
```

---

## 15. Containerization with Docker Compose

### `docker-compose.yml`

```yaml
version: '3.9'

services:

  # ─── MQTT Broker ─────────────────────────────────────────────
  mosquitto:
    image: eclipse-mosquitto:2
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf
    restart: unless-stopped

  # ─── PostgreSQL ───────────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: iotdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

  # ─── InfluxDB (time-series) ───────────────────────────────────
  influxdb:
    image: influxdb:2.7
    environment:
      DOCKER_INFLUXDB_INIT_MODE: setup
      DOCKER_INFLUXDB_INIT_USERNAME: admin
      DOCKER_INFLUXDB_INIT_PASSWORD: adminpassword
      DOCKER_INFLUXDB_INIT_ORG: iot-org
      DOCKER_INFLUXDB_INIT_BUCKET: telemetry
      DOCKER_INFLUXDB_INIT_ADMIN_TOKEN: my-super-secret-token
    ports:
      - "8086:8086"
    volumes:
      - influxdb-data:/var/lib/influxdb2
    restart: unless-stopped

  # ─── Redis ───────────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

  # ─── Zookeeper + Kafka ────────────────────────────────────────
  zookeeper:
    image: confluentinc/cp-zookeeper:7.6.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:7.6.0
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    ports:
      - "29092:29092"

  # ─── Spring Boot IoT Platform ─────────────────────────────────
  iot-platform:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - influxdb
      - mosquitto
      - kafka
      - redis
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/iotdb
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: secret
      MQTT_BROKER_URL: tcp://mosquitto:1883
      INFLUXDB_URL: http://influxdb:8086
      INFLUXDB_TOKEN: my-super-secret-token
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
      SPRING_DATA_REDIS_HOST: redis
    restart: unless-stopped

volumes:
  postgres-data:
  influxdb-data:
```

### `mosquitto.conf`

```
listener 1883
allow_anonymous true

# For production, use:
# password_file /mosquitto/config/pwfile
# allow_anonymous false
```

### `Dockerfile`

```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw -q package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Run Everything

```bash
# Start all infrastructure + the app
docker-compose up --build

# Watch logs for a specific service
docker-compose logs -f iot-platform

# Stop and remove volumes
docker-compose down -v
```

---

## 16. Summary & Next Steps

### What We Built

| Component | Technology | Purpose |
|---|---|---|
| MQTT Broker | Eclipse Mosquitto | Device-to-cloud messaging |
| IoT Platform | Spring Boot 3.3 | Core backend service |
| Device Registry | JPA + PostgreSQL | Register & manage devices |
| Telemetry Ingestion | MQTT Listener | Receive sensor data |
| Time-Series Storage | InfluxDB 2.7 | Store & query telemetry |
| Real-Time Streaming | WebSocket + SSE | Push data to dashboards |
| Event Streaming | Apache Kafka | Scalable fan-out & decoupling |
| Alert Engine | Rule Engine + Kafka | Threshold-based alerting |
| OTA Updates | MQTT Commands | Remote firmware updates |
| Scheduling | Spring Scheduler | Maintenance & health checks |
| Security | JWT + API Key | User & device authentication |
| Cache | Redis | Session, rate-limiting, cache |

### Sample API Calls

```bash
# 1. Register a device
curl -X POST http://localhost:8080/api/devices \
  -H "Content-Type: application/json" \
  -d '{"name":"Temp Sensor 1","type":"TEMPERATURE_SENSOR","tenantId":"tenant-001","location":"Room 101"}'

# 2. Get latest telemetry
curl http://localhost:8080/api/telemetry/DEV-A1B2C3D4/latest

# 3. Get temperature history (last 24h)
curl "http://localhost:8080/api/telemetry/DEV-A1B2C3D4/history?field=temperature&hours=24"

# 4. Create an alert rule
curl -X POST http://localhost:8080/api/alert-rules \
  -H "Content-Type: application/json" \
  -d '{"deviceKey":"DEV-A1B2C3D4","field":"temperature","condition":"GREATER_THAN","threshold":35,"message":"Too hot!","tenantId":"tenant-001"}'

# 5. WebSocket (JavaScript)
# const ws = new WebSocket("ws://localhost:8080/ws/telemetry");
# ws.send(JSON.stringify({action:"subscribe", deviceKey:"DEV-A1B2C3D4"}));
# ws.onmessage = e => console.log(JSON.parse(e.data));
```

### Recommended Next Steps

1. **Grafana Dashboard** — Connect Grafana to InfluxDB for beautiful real-time charts and device dashboards.
2. **Device Provisioning** — Auto-provision devices using X.509 certificates via MQTT TLS.
3. **Multi-Tenant Isolation** — Enforce tenant boundaries at the data layer with row-level security in PostgreSQL.
4. **Edge Computing** — Add an MQTT bridge (Mosquitto → Cloud) so field devices connect to a local edge server.
5. **Digital Twin** — Maintain a real-time mirror of each device's state in Redis for instant reads.
6. **Machine Learning** — Feed InfluxDB data into a Python anomaly detection model via Kafka.
7. **gRPC Support** — Replace REST with gRPC for high-frequency telemetry from resource-constrained devices.
8. **Kubernetes** — Deploy on K8s with HPA (Horizontal Pod Autoscaler) for the telemetry ingestion service.

---

*Happy building! 🚀*
