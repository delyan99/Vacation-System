package com.vacationsystem.services;

import com.vacationsystem.dtos.user.*;

import java.util.List;

public interface UserService {
    LoginResponseDto login (LoginRequestDto loginRequestDto);
    UserResponseDto editUser(UserEditDto dto, int id);
    List<UserResponseDto> findAllUsers();
    UserResponseDto findById(int id);
    UserResponseDto findByEmail(String email);
    UserResponseDto create(UserCreateDto userCreateDto);
    UserDto deleteById(int id);
}
