package com.mtp.api.specifications;

import com.mtp.api.models.Client;
import org.springframework.data.jpa.domain.Specification;

public class ClientSpecifications {

    public static Specification<Client> hasBranch(String branch) {
        return (root, query, cb) -> branch == null ? null : cb.equal(root.get("branch"), branch);
    }

    public static Specification<Client> hasStatus(String status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Client> hasGender(String gender) {
        return (root, query, cb) -> gender == null ? null : cb.equal(root.get("gender"), gender);
    }

    public static Specification<Client> searchName(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isEmpty())
                return null;
            String pattern = "%" + name.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("firstName")), pattern),
                    cb.like(cb.lower(root.get("lastName")), pattern));
        };
    }
}
