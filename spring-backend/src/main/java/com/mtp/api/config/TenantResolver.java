package com.mtp.api.config;

import org.hibernate.cfg.AvailableSettings;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.stereotype.Component;

/**
 * Provides the current tenant identifier for Hibernate multi-tenancy.
 * In the monolith mode, the sub-module entities (clinic, school, billing, stock)
 * use @TenantId annotation which activates Hibernate's multi-tenancy.
 * This resolver reads from TenantContext (set by TenantFilter) and falls
 * back to "default" when no tenant is set (e.g., during startup, schema validation).
 */
@Component
public class TenantResolver implements CurrentTenantIdentifierResolver<String>, HibernatePropertiesCustomizer {

    private static final String DEFAULT_TENANT = "default";

    // Thread-local to store current tenant (set by com.mtp.api.security.TenantFilter)
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();

    public static void setCurrentTenant(String tenantId) {
        currentTenant.set(tenantId);
    }

    public static void clear() {
        currentTenant.remove();
    }

    @Override
    public String resolveCurrentTenantIdentifier() {
        String tenant = currentTenant.get();
        return (tenant != null && !tenant.isBlank()) ? tenant : DEFAULT_TENANT;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        // Allow fallback to default tenant without throwing exceptions
        return false;
    }

    @Override
    public void customize(java.util.Map<String, Object> hibernateProperties) {
        hibernateProperties.put(AvailableSettings.MULTI_TENANT_IDENTIFIER_RESOLVER, this);
    }
}
