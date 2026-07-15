package com.mtp.api.repositories;

import com.mtp.api.models.ClientFamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientFamilyMemberRepository extends JpaRepository<ClientFamilyMember, Long> {
    List<ClientFamilyMember> findByClientId(Long clientId);
}
