package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "EmployeeCourses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Size(max = 255)
    private String title;

    @NotNull
    @Size(max = 255)
    private String provider;

    @NotNull
    @Size(max = 50)
    private String duration;

    @NotNull
    @Size(max = 50)
    private String difficulty; // Beginner, Intermediate, Advanced

    @Column(columnDefinition = "NVARCHAR(MAX)")
    @JdbcTypeCode(SqlTypes.LONGNVARCHAR)
    private String description;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    @JdbcTypeCode(SqlTypes.LONGNVARCHAR)
    private String chapters; // Serialized string of chapters

    @Column(columnDefinition = "NVARCHAR(MAX)")
    @JdbcTypeCode(SqlTypes.LONGNVARCHAR)
    private String quiz; // Serialized JSON quiz questions
}
