package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "SocialCares")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialCare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Integer clientId;

    private boolean socialSupportNeeded;
    private boolean meetingFuture;
    private boolean problem;
}
