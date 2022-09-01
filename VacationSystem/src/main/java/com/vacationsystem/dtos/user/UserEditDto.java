package com.vacationsystem.dtos.user;

import com.vacationsystem.entities.Department;
import com.vacationsystem.entities.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserEditDto {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Boolean isAdmin;
    private Integer availableDays;
    private Department department;
    private User manager;
}
