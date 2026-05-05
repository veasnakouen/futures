package com.mtp.api.controllers;

import com.mtp.api.exceptions.RateLimitExceededException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests for the global error handler — verifies that all error responses
 * follow the standardized {status, error, message, path} JSON shape.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    @DisplayName("Unauthenticated request — error response has standard JSON shape")
    void unauthenticated_returnsStandardErrorShape() throws Exception {
        mvc.perform(get("/api/employees"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").exists())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("Non-existent endpoint — returns 401 (blocked by auth, not 404)")
    void nonExistentEndpoint_returns401() throws Exception {
        mvc.perform(get("/api/this-does-not-exist"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Actuator health endpoint — always accessible without auth")
    void actuatorHealth_isPublic() throws Exception {
        mvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }
}
