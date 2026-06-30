package com.mtp.auth.queries.handlers;

import com.mtp.auth.cqrs.QueryHandler;
import com.mtp.auth.dtos.responses.UserResponseDto;
import com.mtp.auth.queries.GetUsersQuery;
import com.mtp.auth.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GetUsersQueryHandler implements QueryHandler<GetUsersQuery, List<UserResponseDto>> {

    private final UserRepository userRepository;

    public GetUsersQueryHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserResponseDto> handle(GetUsersQuery query) {
        return userRepository.findAll().stream()
                .map(u -> new UserResponseDto(
                        u.getId(),      
                        u.getUserName(),
                        u.getEmail() == null ? "" : u.getEmail()
                ))
                .collect(Collectors.toList());
    }
}
            