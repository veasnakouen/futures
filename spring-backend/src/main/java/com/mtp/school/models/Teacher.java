package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "school_teachers")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Teacher extends Employee {
    private String subject;
    private Address address;

    @OneToMany(mappedBy = "teacher")
    private List<Course> courses;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;
}
