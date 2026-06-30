package com.mtp.auth.commands;

import com.mtp.auth.cqrs.Command;
import com.mtp.auth.dtos.requests.RefreshTokenRequestDto;
import com.mtp.auth.dtos.responses.AuthResponseDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefreshTokenCommand implements Command<AuthResponseDto> {
    private final RefreshTokenRequestDto requestDto;
}
