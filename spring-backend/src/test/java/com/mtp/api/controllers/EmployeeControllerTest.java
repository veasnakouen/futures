package com.mtp.api.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for EmployeeController.
 *
 * These tests run against the full Spring context (not mocked)
 * to verify the complete request → controller → response chain,
 * including security filters, validation, and error handling.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class EmployeeControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    // --- Security Tests ---

    @Test
    @DisplayName("GET /employees — should return 401 when not authenticated")
    void getEmployees_unauthenticated_returns401() throws Exception {
        mvc.perform(get("/api/employees"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /employees — should return 200 with ADMIN role")
    @WithMockUser(roles = "ADMIN")
    void getEmployees_authenticated_returns200() throws Exception {
        mvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE));
    }

    // --- Validation Tests ---

    @Test
    @DisplayName("POST /employees — should return 400 when firstName is blank")
    @WithMockUser(roles = "ADMIN")
    void createEmployee_blankFirstName_returns400() throws Exception {
        EmployeeController.EmployeeDTO dto = new EmployeeController.EmployeeDTO();
        // Intentionally leave firstNameEnglish blank — should fail @NotBlank
        dto.setLastNameEnglish("Doe");
        dto.setIdNo("MTP-TEST-001");

        mvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("firstNameEnglish")));
    }

    @Test
    @DisplayName("POST /employees — should return 400 when email is invalid")
    @WithMockUser(roles = "ADMIN")
    void createEmployee_invalidEmail_returns400() throws Exception {
        EmployeeController.EmployeeDTO dto = new EmployeeController.EmployeeDTO();
        dto.setFirstNameEnglish("John");
        dto.setLastNameEnglish("Doe");
        dto.setIdNo("MTP-TEST-002");
        dto.setEmail("not-a-valid-email"); // Should fail @Email

        mvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }

    // --- Authorization Tests ---

    @Test
    @DisplayName("DELETE /employees/{id} — should return 404 for non-existent ID")
    @WithMockUser(roles = "ADMIN")
    void deleteEmployee_nonExistent_returns404() throws Exception {
        mvc.perform(delete("/api/employees/999999"))
                .andExpect(status().isNotFound());
    }
}
