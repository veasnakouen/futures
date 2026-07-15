package com.mtp.stock.models.stubs;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "AspNetUsers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStub {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "Id", length = 128, columnDefinition = "nvarchar(128)")
    private String id;
    private String userName;
    private String email;
}
