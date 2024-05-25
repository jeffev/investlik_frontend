import React from "react";
import { TextField } from "@mui/material";

const NumericInput = ({ value, onChange, ...rest }) => {
    const handleChange = (e) => {
        let newValue = e.target.value.replace(",", ".");
        if (!isNaN(newValue) || newValue === "") {
            onChange(newValue);
        }
    };

    return (
        <TextField
            {...rest}
            value={value}
            onChange={handleChange}
        />
    );
};

export default NumericInput;