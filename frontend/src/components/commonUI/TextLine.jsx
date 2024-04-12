import React from 'react';
import { TextField } from '@mui/material';

const TextLine = ({ label, value, onChange, onKeyDown }) => {
  return (
    <TextField
      label={label}
      type = 'text'
      variant="outlined"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      margin="normal"
      style={{ width: '25%', maxWidth: 400 }}
      required
    />
  );
};

export default TextLine;
