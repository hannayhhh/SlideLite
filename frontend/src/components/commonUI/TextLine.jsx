import React from 'react';
import { TextField } from '@mui/material';

const TextLine = ({ label, value, onChange, onKeyDown, type = 'text', InputProps }) => {
  return (
    <TextField
      label={label}
      type = {type}
      variant="outlined"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      InputProps={InputProps}
      margin="normal"
      sx={{ mb: 2, width: '25%', maxWidth: 400 }}
    />
  );
};

export default TextLine;
