package com.mtp.auth.commands;

import com.mtp.auth.cqrs.Command;
import com.mtp.auth.dtos.requests.LoginRequestDto;
import com.mtp.auth.dtos.responses.AuthResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginCommand implements Command<AuthResponseDto> {
    private final LoginRequestDto requestDto;
    private final HttpServletRequest servletRequest;
}
