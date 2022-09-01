package com.vacationsystem.services;

import com.vacationsystem.dtos.department.DepartmentCreateAndUpdateDto;
import com.vacationsystem.dtos.department.DepartmentDto;
import com.vacationsystem.entities.Department;
import com.vacationsystem.exceptions.DepartmentNotFoundException;
import com.vacationsystem.exceptions.InvalidNameException;
import com.vacationsystem.repositories.DepartmentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class DepartmentServiceImpl implements DepartmentService{
    private final DepartmentRepository departmentRepository;
    private final ModelMapper mapper;

    @Autowired
    public DepartmentServiceImpl(DepartmentRepository departmentRepository, ModelMapper mapper) {
        this.departmentRepository = departmentRepository;
        this.mapper = mapper;
    }

    @Override
    public DepartmentDto create(DepartmentCreateAndUpdateDto departmentCreateDto) {
        if (departmentRepository.existsByName(departmentCreateDto.getName())) {
            throw new InvalidNameException("Department with name " + departmentCreateDto.getName() + " is already registered.");
        }
        Department department = mapper.map(departmentCreateDto, Department.class);
        Department createdDepartment = departmentRepository.save(department);
        return mapper.map(createdDepartment, DepartmentDto.class);
    }

    @Override
    public List<DepartmentDto> findAllDepartments() {
        return StreamSupport.stream(departmentRepository.findAll().spliterator(), false)
                .map(e -> mapper.map(e, DepartmentDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto findById(int id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department with id " + id + " does not exist."));
        return mapper.map(department, DepartmentDto.class);
    }

    @Override
    public DepartmentDto update(DepartmentCreateAndUpdateDto departmentUpdateDto, int id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department with id " + id + " does not exist."));

        department.setName(departmentUpdateDto.getName());
        departmentRepository.save(department);
        return mapper.map(department, DepartmentDto.class);
    }

    @Override
    public DepartmentDto deleteById(int id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department with id " + id + " does not exist."));
        departmentRepository.deleteById(id);
        return mapper.map(department, DepartmentDto.class);
    }
}
