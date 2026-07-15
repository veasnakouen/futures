package com.mtp.clinic.repositories;

import com.mtp.clinic.models.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderRepository extends JpaRepository<Provider, String> {
}
