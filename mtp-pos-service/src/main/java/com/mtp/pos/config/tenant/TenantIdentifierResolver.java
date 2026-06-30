package com.mtp.pos.config.tenant;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;

@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver<String> {

    @Override
    public String resolveCurrentTenantIdentifier() {
        String tenant = TenantContext.getCurrentTenant();
        if (tenant == null) {
            return "default-tenant";
        }
        return tenant;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}
