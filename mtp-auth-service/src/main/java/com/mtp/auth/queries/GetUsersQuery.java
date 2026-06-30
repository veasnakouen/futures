package com.mtp.auth.queries;

import com.mtp.auth.cqrs.Query;
import com.mtp.auth.dtos.responses.UserResponseDto;
import java.util.List;

public class GetUsersQuery implements Query<List<UserResponseDto>> {
    // Empty class, represents a query with no parameters for now.
    // If pagination or filtering is added later, fields can be added here.
}
