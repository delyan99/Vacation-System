package com.vacationsystem.dtos.user;

import com.vacationsystem.entities.User;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto extends UserCreateDto {
    private Integer id;
    private Set<User> employees;
}
