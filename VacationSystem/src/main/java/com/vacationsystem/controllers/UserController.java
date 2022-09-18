package com.vacationsystem.controllers;

import com.vacationsystem.dtos.user.*;
import com.vacationsystem.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody LoginRequestDto loginRequestDto){
        return userService.login(loginRequestDto);
    }

    @PostMapping()
    public ResponseEntity<UserResponseDto> createUser(@RequestBody UserCreateDto userCreateDto) throws URISyntaxException {
        UserResponseDto userResponseDto = userService.create(userCreateDto);
        return ResponseEntity.created(new URI("/users/" + userResponseDto.getId())).body(userResponseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> findUserById(@PathVariable int id) {
        UserResponseDto user = userService.findById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/getUserInfoByEmail/{email}")
    public ResponseEntity<UserResponseDto> findUserByEmail(@PathVariable String email) {
        UserResponseDto user = userService.findByEmail(email);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> findAllUsers() {
        List<UserResponseDto> all = userService.findAllUsers();
        return new ResponseEntity<>(all, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> editUser(@PathVariable int id, @RequestBody UserEditDto editDto) {
        UserResponseDto updated = userService.editUser(editDto, id);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserDto> delete(@PathVariable int id) {
        UserDto user = userService.deleteById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
