import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import CodeIcon from '@mui/icons-material/Code';

const SideBar = () => {
  return (
    <Box sx={{ width: '18%', bgcolor: '#edf4f9', padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button variant="outlined" color="inherit" sx={{ m: 2, p: 1, width: '90%', height: '15vh' }}>
        <TextFieldsIcon sx={{ fontSize: 'large' }} />
        <Typography variant="caption" display="block">TEXT</Typography>
      </Button>
      <Button variant="outlined" color="inherit" sx={{ m: 2, p: 1, width: '90%', height: '15vh' }}>
        <ImageIcon sx={{ fontSize: 'large' }} />
        <Typography variant="caption" display="block">IMAGE</Typography>
      </Button>
      <Button variant="outlined" color="inherit" sx={{ m: 2, p: 1, width: '90%', height: '15vh' }}>
        <OndemandVideoIcon sx={{ fontSize: 'large' }} />
        <Typography variant="caption" display="block">VIDEO</Typography>
      </Button>
      <Button variant="outlined" color="inherit" sx={{ m: 2, p: 1, width: '90%', height: '15vh' }}>
        <CodeIcon sx={{ fontSize: 'large' }} />
        <Typography variant="caption" display="block">CODE</Typography>
      </Button>
    </Box>
  );
}

export default SideBar;
