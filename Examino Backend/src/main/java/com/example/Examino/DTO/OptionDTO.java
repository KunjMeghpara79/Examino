package com.example.Examino.DTO;

import lombok.Data;

@Data
public class OptionDTO {

    private String questionid;
    private String optiontext;
    private boolean correct;

}
