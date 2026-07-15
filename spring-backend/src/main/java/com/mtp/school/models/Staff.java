package com.mtp.school.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity(name = "SchoolStaff")
@Table(name = "school_staff")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Staff extends Employee {
    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    private String position;
}
