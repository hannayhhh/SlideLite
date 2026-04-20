import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, MenuItem, Select, FormControlLabel, Checkbox, Box } from '@mui/material';
import { SketchPicker } from 'react-color';
import PaletteIcon from '@mui/icons-material/Palette';

function ThemeDialog ({ slides, slideId, updateSlides }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(slides[`slide${slideId}`]?.background || '#ffffff');
  const [secondColor, setSecondColor] = useState('#000000');
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [useGradient, setUseGradient] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false);

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleColorChange = (color, isPrimary = true) => {
    if (isPrimary) {
      setBackgroundColor(color.hex);
    } else {
      setSecondColor(color.hex);
    }
  };

  const handleSubmit = () => {
    const backgroundStyle = useGradient
      ? `linear-gradient(${gradientDirection}, ${backgroundColor}, ${secondColor})`
      : backgroundColor;
    applyBackground(backgroundStyle, applyToAll);
    handleClose();
  };

  const applyBackground = (backgroundStyle, applyToAll) => {
    const updatedSlides = { ...slides };
    if (applyToAll) {
      Object.keys(updatedSlides).forEach(key => {
        updatedSlides[key].background = backgroundStyle;
        updatedSlides[key].backgroundStyle = useGradient ? backgroundStyle : '';
      });
    } else {
      updatedSlides[`slide${slideId}`].background = backgroundStyle;
      updatedSlides[`slide${slideId}`].backgroundStyle = useGradient ? backgroundStyle : '';
    }
    updateSlides(updatedSlides, { refresh: false });
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="primary" aria-label="open color picker" sx={{ m: 2 }}>
        <PaletteIcon />
      </IconButton>
      <Dialog open={dialogOpen} onClose={handleClose} >
        <DialogTitle>Choose Background Color</DialogTitle>
        <DialogContent>
          <SketchPicker color={backgroundColor} onChangeComplete={(color) => handleColorChange(color, true)} />
          {useGradient && (
            <>
              <SketchPicker color={secondColor} onChangeComplete={(color) => handleColorChange(color, false)} />
              <Select
                value={gradientDirection}
                onChange={(e) => setGradientDirection(e.target.value)}
                fullWidth
              >
                <MenuItem value="to right">To Right</MenuItem>
                <MenuItem value="to left">To Left</MenuItem>
                <MenuItem value="to bottom">To Bottom</MenuItem>
                <MenuItem value="to top">To Top</MenuItem>
              </Select>
            </>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}>
            <FormControlLabel
                control={
                <Checkbox
                    checked={useGradient}
                    onChange={(e) => setUseGradient(e.target.checked)}
                />
                }
                label="Use Gradient"
            />
            <FormControlLabel
                control={
                <Checkbox
                    checked={applyToAll}
                    onChange={(e) => setApplyToAll(e.target.checked)}
                />
                }
                label="Apply to all slides"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">Apply</Button>
          <Button onClick={handleClose} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ThemeDialog;
