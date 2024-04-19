import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Select, MenuItem, Typography } from '@mui/material';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import useSlideManager from '../../hook/useSlideManager';

function FontDialog ({ slides, slideId }) {
  const { pptName } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState(slides[`slide${slideId}`]?.fontFamily || 'Arial');
  const { updateSlides } = useSlideManager(pptName);

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleFontChange = (event) => {
    setSelectedFont(event.target.value);
  };

  const handleSubmit = () => {
    const updatedSlides = { ...slides };
    if (updatedSlides[`slide${slideId}`]) {
      updatedSlides[`slide${slideId}`].fontFamily = selectedFont;
    }
    updateSlides(updatedSlides);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="secondary" aria-label="font picker" sx={{ m: 2 }}>
        <FontDownloadIcon />
      </IconButton>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Choose Font</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>Select a font for the text:</Typography>
          <Select
            value={selectedFont}
            onChange={handleFontChange}
            fullWidth
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
            <MenuItem value="Georgia">Georgia</MenuItem>
            <MenuItem value="Verdana">Verdana</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">Apply</Button>
          <Button onClick={handleClose} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FontDialog;
