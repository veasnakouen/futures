package com.mtp.school.models;

import java.util.List;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "school_branches")
@Data
@NoArgsConstructor
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @org.hibernate.annotations.TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    private String branchName;

    private Address address;

    private String phoneNumber;

    private String email;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "branch")
    private List<Student> students;

    @OneToMany(mappedBy = "branch")
    private List<Teacher> teachers;

    @OneToMany(mappedBy = "branch")
    private List<Course> courses;

    @OneToMany(mappedBy = "branch")
    private List<Staff> staff;
}