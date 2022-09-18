package com.vacationsystem.services;

import com.vacationsystem.dtos.user.*;
import com.vacationsystem.entities.Department;
import com.vacationsystem.entities.User;
import com.vacationsystem.exceptions.InvalidEmailException;
import com.vacationsystem.exceptions.UserNotFoundException;
import com.vacationsystem.repositories.DepartmentRepository;
import com.vacationsystem.repositories.UserRepository;
import com.vacationsystem.security.services.TokenService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final ModelMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, DepartmentRepository departmentRepository,
                           ModelMapper mapper, BCryptPasswordEncoder passwordEncoder, TokenService tokenService){
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        addSuperAdminAndDepartments();

        User user = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User with email " + loginRequestDto.getEmail() + " doesn't exist."));

        if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
            throw new UserNotFoundException("Invalid credentials.");
        }

        return createLoginResponseDto(user);
    }

    private void addSuperAdminAndDepartments() {
        User superAdmin = new User(1, "admin@gmail.com", passwordEncoder.encode("adminpass"), "Admin", "Adminov", 100, Boolean.TRUE, null, null, null);
        Department marketingDepartment = new Department(1, "Marketing");
        Department salesDepartment = new Department(2, "Sales");
        departmentRepository.save(marketingDepartment);
        departmentRepository.save(salesDepartment);
        userRepository.save(superAdmin);
    }

    private LoginResponseDto createLoginResponseDto(User user) {
        LoginResponseDto loginResponseDto = new LoginResponseDto();
        loginResponseDto.setToken(tokenService.generateToken(user));
        return loginResponseDto;
    }

    @Override
    public List<UserResponseDto> findAllUsers() {
        return StreamSupport.stream(userRepository.findAll().spliterator(), false)
                .map(e -> mapper.map(e, UserResponseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDto findById(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " does not exist."));
        return mapper.map(user, UserResponseDto.class);
    }

    @Override
    public UserResponseDto findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User with email " + email + " does not exist."));
        return mapper.map(user, UserResponseDto.class);
    }

    @Override
    public UserResponseDto create(UserCreateDto userCreateDto) {
        if (!verifyEmail(userCreateDto.getEmail())) {
            throw new InvalidEmailException("Invalid email.");
        }

        if (userRepository.existsByEmail(userCreateDto.getEmail())) {
            throw new InvalidEmailException("User with email " + userCreateDto.getEmail() + " is already registered.");
        }

        userCreateDto.setPassword(passwordEncoder.encode(userCreateDto.getPassword()));
        User user = mapper.map(userCreateDto, User.class);
        User createdUser = userRepository.save(user);
        return mapper.map(createdUser, UserResponseDto.class);
    }

    @Override
    public UserResponseDto editUser(UserEditDto dto, int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " does not exist."));

        if (!verifyEmail(dto.getEmail())) {
            throw new InvalidEmailException("Invalid email.");
        }
        Integer currentUserId = user.getId();
        UserCreateDto currentUser = mapper.map(user, UserCreateDto.class);
        currentUser.setEmail(dto.getEmail());
        currentUser.setFirstName(dto.getFirstName());
        currentUser.setLastName(dto.getLastName());
        currentUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        currentUser.setAvailableDays(dto.getAvailableDays());
        currentUser.setIsAdmin(dto.getIsAdmin());
        currentUser.setDepartment(dto.getDepartment());
        currentUser.setManager(dto.getManager());
        User newUser = mapper.map(currentUser, User.class);
        newUser.setId(currentUserId);
        userRepository.save(newUser);
        return mapper.map(newUser, UserResponseDto.class);
    }

    private Boolean verifyEmail(String email) {
        String regex = "^(.+)@(.+)$";
        return email.matches(regex);
    }

    @Override
    public UserDto deleteById(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " does not exist."));
        userRepository.deleteById(id);
        return mapper.map(user, UserDto.class);
    }
}