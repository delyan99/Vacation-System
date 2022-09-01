package com.vacationsystem.repositories;

import com.vacationsystem.entities.Request;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RequestRepository extends CrudRepository<Request, Integer> {

    @Query("SELECT r.days FROM Request r WHERE r.user.id = :userId and r.type ='Paid Leave' and r.status='Approved'")
    List<Integer> getAllPaidLeaveDaysForCurrentUser(@Param("userId") Integer userId);

    @Query("SELECT r.days FROM Request r WHERE r.user.id = :userId and r.type ='Unpaid Leave' and r.status='Approved'")
    List<Integer> getAllUnpaidLeaveDaysForCurrentUser(@Param("userId") Integer userId);

    @Query("SELECT r.days FROM Request r WHERE r.user.id = :userId and r.type ='Sick Leave' and r.status='Approved'")
    List<Integer> getAllSickLeaveDaysForCurrentUser(@Param("userId") Integer userId);
}
