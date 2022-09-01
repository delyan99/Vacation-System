package com.vacationsystem.dtos.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestDto {
    private Integer id;
    private String startDate;
    private String endDate;
    private Integer days;
    private String note;
    private String type;
    private String status;
    private Integer userId;
}
