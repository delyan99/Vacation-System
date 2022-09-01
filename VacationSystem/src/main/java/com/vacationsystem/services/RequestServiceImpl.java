package com.vacationsystem.services;

import com.vacationsystem.dtos.request.RequestCreateAndUpdateDto;
import com.vacationsystem.dtos.request.RequestDto;
import com.vacationsystem.dtos.request.RequestResponseDto;
import com.vacationsystem.entities.Request;
import com.vacationsystem.exceptions.RequestNotFoundException;
import com.vacationsystem.repositories.RequestRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class RequestServiceImpl implements RequestService{
    private final RequestRepository requestRepository;
    private final ModelMapper mapper;

    @Autowired
    public RequestServiceImpl(RequestRepository requestRepository, ModelMapper mapper) {
        this.requestRepository = requestRepository;
        this.mapper = mapper;
    }

    @Override
    public RequestDto create(RequestCreateAndUpdateDto requestCreateDto) {
        Request request = mapper.map(requestCreateDto, Request.class);
        Request createdRequest = requestRepository.save(request);
        return mapper.map(createdRequest, RequestDto.class);
    }

    @Override
    public List<RequestResponseDto> findAllRequests() {
        return StreamSupport.stream(requestRepository.findAll().spliterator(), false)
                .map(e -> mapper.map(e, RequestResponseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public RequestResponseDto findById(int id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RequestNotFoundException("Request with id " + id + " does not exist."));
        return mapper.map(request, RequestResponseDto.class);
    }

    @Override
    public RequestDto update(RequestCreateAndUpdateDto requestUpdateDto, int id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RequestNotFoundException("Request with id " + id + " does not exist."));

        request.setStartDate(requestUpdateDto.getStartDate());
        request.setEndDate(requestUpdateDto.getEndDate());
        request.setDays(requestUpdateDto.getDays());
        request.setNote(requestUpdateDto.getNote());
        request.setType(requestUpdateDto.getType());
        request.setStatus(requestUpdateDto.getStatus());
        requestRepository.save(request);
        return mapper.map(request, RequestDto.class);
    }

    @Override
    public RequestDto deleteById(int id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RequestNotFoundException("Request with id " + id + " does not exist."));
        requestRepository.deleteById(id);
        return mapper.map(request, RequestDto.class);
    }

    @Override
    public Integer getAllPaidLeaveDaysForCurrentUser(int id) {
        int days = 0;
        List<Integer> allPaidLeaveDaysForCurrentUser = requestRepository.getAllPaidLeaveDaysForCurrentUser(id);
        for (Integer currentDays : allPaidLeaveDaysForCurrentUser) {
            if(currentDays != null) {
                days += currentDays;
            }
        }
        return days;
    }

    @Override
    public Integer getAllUnpaidLeaveDaysForCurrentUser(int id) {
        int days = 0;
        List<Integer> allUnpaidLeaveDaysForCurrentUser = requestRepository.getAllUnpaidLeaveDaysForCurrentUser(id);
        for (Integer currentDays : allUnpaidLeaveDaysForCurrentUser) {
            if(currentDays != null) {
                days += currentDays;
            }
        }
        return days;
    }

    @Override
    public Integer getAllSickLeaveDaysForCurrentUser(int id) {
        int days = 0;
        List<Integer> allSickLeaveDaysForCurrentUser = requestRepository.getAllSickLeaveDaysForCurrentUser(id);
        for (Integer currentDays : allSickLeaveDaysForCurrentUser) {
            if(currentDays != null) {
                days += currentDays;
            }
        }
        return days;
    }
}
