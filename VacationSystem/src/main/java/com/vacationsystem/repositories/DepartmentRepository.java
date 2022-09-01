package com.vacationsystem.repositories;

import com.vacationsystem.entities.Department;
import org.springframework.data.repository.CrudRepository;

public interface DepartmentRepository extends CrudRepository<Department, Integer> {
    Boolean existsByName(String name);
}
