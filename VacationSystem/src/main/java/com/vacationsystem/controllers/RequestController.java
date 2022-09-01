package com.vacationsystem.controllers;

import com.vacationsystem.dtos.request.RequestCreateAndUpdateDto;
import com.vacationsystem.dtos.request.RequestDto;
import com.vacationsystem.dtos.request.RequestResponseDto;
import com.vacationsystem.services.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/requests")
public class RequestController {
    private final RequestService requestService;

    @Autowired
    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping()
    public ResponseEntity<RequestDto> createRequest(@RequestBody RequestCreateAndUpdateDto requestDto) throws URISyntaxException {
        RequestDto requestResponseDto = requestService.create(requestDto);
        return ResponseEntity.created(new URI("/requests/" + requestResponseDto.getId())).body(requestResponseDto);
    }

    @GetMapping
    public ResponseEntity<List<RequestResponseDto>> findAllRequests() {
        List<RequestResponseDto> requests = requestService.findAllRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestResponseDto> findRequestById(@PathVariable int id) {
        RequestResponseDto request = requestService.findById(id);
        return new ResponseEntity<>(request, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RequestDto> updateRequest(@PathVariable int id, @RequestBody RequestCreateAndUpdateDto updateDto) {
        RequestDto updated = requestService.update(updateDto, id);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<RequestDto> delete(@PathVariable int id) {
        RequestDto request = requestService.deleteById(id);
        return new ResponseEntity<>(request, HttpStatus.OK);
    }

    @GetMapping("/paidLeaveDays/{id}")
    public ResponseEntity<Integer> getAllPaidLaveDaysForCurrentUser(@PathVariable int id) {
        Integer allPaidLeaveDaysForCurrentUser = requestService.getAllPaidLeaveDaysForCurrentUser(id);
        return new ResponseEntity<>(allPaidLeaveDaysForCurrentUser, HttpStatus.OK);
    }

    @GetMapping("/unpaidLeaveDays/{id}")
    public ResponseEntity<Integer> getAllUnpaidLaveDaysForCurrentUser(@PathVariable int id) {
        Integer allUnpaidLeaveDaysForCurrentUser = requestService.getAllUnpaidLeaveDaysForCurrentUser(id);
        return new ResponseEntity<>(allUnpaidLeaveDaysForCurrentUser, HttpStatus.OK);
    }

    @GetMapping("/sickLeaveDays/{id}")
    public ResponseEntity<Integer> getAllSickLaveDaysForCurrentUser(@PathVariable int id) {
        Integer allSickLeaveDaysForCurrentUser = requestService.getAllSickLeaveDaysForCurrentUser(id);
        return new ResponseEntity<>(allSickLeaveDaysForCurrentUser, HttpStatus.OK);
    }
}
