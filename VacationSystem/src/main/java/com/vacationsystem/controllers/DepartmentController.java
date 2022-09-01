package com.vacationsystem.controllers;

import com.vacationsystem.dtos.department.DepartmentCreateAndUpdateDto;
import com.vacationsystem.dtos.department.DepartmentDto;
import com.vacationsystem.services.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/departments")
public class DepartmentController {
    private final DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping()
    public ResponseEntity<DepartmentDto> createDepartment(@RequestBody DepartmentCreateAndUpdateDto departmentDto) throws URISyntaxException {
        DepartmentDto departmentResponseDto = departmentService.create(departmentDto);
        return ResponseEntity.created(new URI("/departments/" + departmentResponseDto.getId())).body(departmentResponseDto);
    }

    @GetMapping
    public ResponseEntity<List<DepartmentDto>> findAllDepartments() {
        List<DepartmentDto> departments = departmentService.findAllDepartments();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDto> findUserById(@PathVariable int id) {
        DepartmentDto department = departmentService.findById(id);
        return new ResponseEntity<>(department, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDto> updateDepartment(@PathVariable int id, @RequestBody DepartmentCreateAndUpdateDto updateDto) {
        DepartmentDto updated = departmentService.update(updateDto, id);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DepartmentDto> delete(@PathVariable int id) {
        DepartmentDto department = departmentService.deleteById(id);
        return new ResponseEntity<>(department, HttpStatus.OK);
    }
}
