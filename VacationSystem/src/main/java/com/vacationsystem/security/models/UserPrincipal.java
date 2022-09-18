package com.vacationsystem.security.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserPrincipal{
    private long id;
    private String username;
    private boolean isAdmin;
}
