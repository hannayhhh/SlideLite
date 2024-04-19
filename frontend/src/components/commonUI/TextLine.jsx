import React from 'react';
import { TextField, useMediaQuery, useTheme } from '@mui/material';

const TextLine = ({ label, value, onChange, onKeyDown, type = 'text', InputProps }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
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
      sx={{ width: matches ? '80%' : '25%', maxWidth: 400, height: 45, mt: 2 }}
    />
  );
};

export default TextLine;
