package com.vacationsystem.dtos.request;

import com.vacationsystem.entities.User;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestCreateAndUpdateDto {
    private String startDate;
    private String endDate;
    private Integer days;
    private String note;
    private String type;
    private String status;
    private User user;
}
