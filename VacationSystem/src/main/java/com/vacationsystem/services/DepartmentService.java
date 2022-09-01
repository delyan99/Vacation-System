package com.vacationsystem.services;

import com.vacationsystem.dtos.department.DepartmentCreateAndUpdateDto;
import com.vacationsystem.dtos.department.DepartmentDto;

import java.util.List;

public interface DepartmentService {
    DepartmentDto create(DepartmentCreateAndUpdateDto departmentCreateDto);
    List<DepartmentDto> findAllDepartments();
    DepartmentDto findById(int id);
    DepartmentDto update(DepartmentCreateAndUpdateDto departmentUpdateDto, int id);
    DepartmentDto deleteById(int id);
}
