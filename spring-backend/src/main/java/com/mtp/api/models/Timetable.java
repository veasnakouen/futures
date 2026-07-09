package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "Timetables")
@SQLDelete(sql = "UPDATE Timetables SET is_deleted = true WHERE id=?")
@SQLRestriction("is_deleted = false")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Timetable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String onDutyTime;

    @Column(nullable = false)
    private String offDutyTime;

    private Integer lateTime;
    
    private Integer leaveEarlyTime;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;
}
