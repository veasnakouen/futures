package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "school_students")
@Data
@NoArgsConstructor
public class Student {
        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private String id;

        @org.hibernate.annotations.TenantId
        @Column(name = "tenant_id")
        private String tenantId;

        @Column(name = "first_name", nullable = false)
        private String firstName; // IDE Refresh: No 'midd' here!

        @Column(name = "last_name", nullable = false)
        private String lastName;

        @Column(name = "middle_name", nullable = true)
        private String middleName;

        @Enumerated(EnumType.STRING)
        private Gender gender;

        private LocalDate dateOfBirth;

        // @Column(nullable=false,name="citizenship")
        private String nationality;
        private String profilePicture;

        @Column(name = "image_url")
        private String imageUrl;

        private String email;
        private String studentPhone;
        @Embedded
        @AttributeOverrides({
                        @AttributeOverride(name = "street", column = @Column(name = "current_street")),
                        @AttributeOverride(name = "city", column = @Column(name = "current_city")),
                        @AttributeOverride(name = "state", column = @Column(name = "current_state")),
                        @AttributeOverride(name = "zipCode", column = @Column(name = "current_zip_code")),
                        @AttributeOverride(name = "country", column = @Column(name = "current_country")),
                        @AttributeOverride(name = "district", column = @Column(name = "current_district")),
                        @AttributeOverride(name = "commune", column = @Column(name = "current_commune")),
                        @AttributeOverride(name = "village", column = @Column(name = "current_village"))
        })

        private Address currentAddress;

        @Embedded
        @AttributeOverrides({
                        @AttributeOverride(name = "street", column = @Column(name = "permanent_street")),
                        @AttributeOverride(name = "city", column = @Column(name = "permanent_city")),
                        @AttributeOverride(name = "state", column = @Column(name = "permanent_state")),
                        @AttributeOverride(name = "zipCode", column = @Column(name = "permanent_zip_code")),
                        @AttributeOverride(name = "country", column = @Column(name = "permanent_country")),
                        @AttributeOverride(name = "district", column = @Column(name = "permanent_district")),
                        @AttributeOverride(name = "commune", column = @Column(name = "permanent_commune")),
                        @AttributeOverride(name = "village", column = @Column(name = "permanent_village"))
        })

        private Address permanentAddress;

        private LocalDate enrollmentDate;
        @Column(name = "clinic_patient_id")
        private String clinicPatientId;
        private Boolean isActive = true;
        private String studentCode;

        // External Navigation field
        private String userAccountId;
        
        @Column(name = "global_client_id")
        private Integer globalClientId;

        @Column(name = "is_id_poor")
        private Boolean isIdPoor = false;

        @Column(name = "id_poor_number")
        private String idPoorNumber;

        @Column(name = "brought_by_outreach_worker")
        private Boolean broughtByOutreachWorker = false;

        @Column(name = "outreach_worker_name")
        private String outreachWorkerName;

        @Column(name = "outreach_organization")
        private String outreachOrganization;

        // One-to-One Relationships
        @OneToOne(cascade = CascadeType.ALL)
        @JoinColumn(name = "medical_record_id")
        private MedicalRecord medicalRecord;

        @OneToOne(cascade = CascadeType.ALL)
        @JoinColumn(name = "locker_id")
        private Locker lockerAssignment;

        // Many-to-One Relationships
        @ManyToOne
        @JoinColumn(name = "classroom_id")
        private Classroom classroom;

        @ManyToOne
        @JoinColumn(name = "branch_id")
        private Branch branch;

        @ManyToOne
        @JoinColumn(name = "dormitory_id")
        private Dormitory dormitory;

        // One-to-Many Relationships
        @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<AttendanceRecord> attendanceRecords = new ArrayList<>();

        @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<FeeInvoice> feeInvoices = new ArrayList<>();

        @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<DisciplinaryRecord> disciplinaryRecords = new ArrayList<>();

        @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<StudentDocument> documents = new ArrayList<>();

        @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<ExamResult> examResults = new ArrayList<>();

        @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Enrollment> enrollments = new ArrayList<>();

        // Many-to-Many Relationships
        @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<StudentParent> studentParents = new ArrayList<>();

        @ManyToMany
        @JoinTable(name = "student_extracurriculars", joinColumns = @JoinColumn(name = "student_id"), inverseJoinColumns = @JoinColumn(name = "extracurricular_id"))
        private List<Extracurricular> extracurriculars = new ArrayList<>();

        @Column(name = "custom_attributes", columnDefinition = "NVARCHAR(MAX)")
        private String customAttributes;
}
