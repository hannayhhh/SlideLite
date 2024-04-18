import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Dialog, Typography, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import useSlideManager from '../../hook/useSlideManager';

function TextDialog ({ slides, slideId }) {
  const { pptName } = useParams();
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [text, setText] = useState('');
  const [textAreaSize, setTextAreaSize] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [color, setColor] = useState('');
  const { updateSlides } = useSlideManager(pptName);

  const addTextToSlide = () => {
    console.log(slides);
    console.log(slideId);
    const slideContents = slides[`slide${slideId}`];
    const contentKeys = Object.keys(slideContents).filter(key => key.startsWith('content'));
    const newContentId = contentKeys.length + 1;
    const updatedSlides = {
      ...slides,
      [`slide${slideId}`]: {
        ...slideContents,
        [`content${newContentId}`]: {
          type: 'text',
          data: { text },
          area: textAreaSize,
          size: fontSize,
          fontcolor: color
        }
      },
    };
    updateSlides(updatedSlides);
    setTextDialogOpen(false);
  };

  const handleTextDialogOpen = () => {
    setTextDialogOpen(true);
  };

  const handleTextDialogClose = () => {
    setTextDialogOpen(false);
  };

  // Make sure all the Typography is filled
  // a little question here, only refresh page can see the new content
  return (
    <>
      <Button variant="outlined" color="inherit" onClick={handleTextDialogOpen} sx={{ m: 2, p: 1, width: '90%', height: '15vh' }}>
        <TextFieldsIcon sx={{ fontSize: 'large' }} />
        <Typography variant="caption" display="block">TEXT</Typography>
      </Button>
      <Dialog open={textDialogOpen} onClose={handleTextDialogClose}>
        <DialogTitle>Add Text to Slide</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="text"
            label="Text"
            type="text"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <TextField
            margin="dense"
            id="size"
            label="Text Area Size"
            type="text"
            fullWidth
            value={textAreaSize}
            onChange={(e) => setTextAreaSize(e.target.value)}
          />
          <TextField
            margin="dense"
            id="fontSize"
            label="Font Size (em)"
            type="text"
            fullWidth
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          />
          <TextField
            margin="dense"
            id="color"
            label="Text Color (HEX)"
            type="text"
            fullWidth
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addTextToSlide} color="primary" disabled={!text || !textAreaSize || !fontSize || !color} >
            Add
          </Button>
          <Button onClick={handleTextDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TextDialog;
