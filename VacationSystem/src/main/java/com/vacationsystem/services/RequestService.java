package com.vacationsystem.services;

import com.vacationsystem.dtos.request.RequestCreateAndUpdateDto;
import com.vacationsystem.dtos.request.RequestDto;
import com.vacationsystem.dtos.request.RequestResponseDto;

import java.util.List;

public interface RequestService {
    RequestDto create(RequestCreateAndUpdateDto requestCreateDto);
    List<RequestResponseDto> findAllRequests();
    RequestResponseDto findById(int id);
    RequestDto update(RequestCreateAndUpdateDto requestUpdateDto, int id);
    RequestDto deleteById(int id);
    Integer getAllPaidLeaveDaysForCurrentUser(int id);
    Integer getAllUnpaidLeaveDaysForCurrentUser(int id);
    Integer getAllSickLeaveDaysForCurrentUser(int id);
}
