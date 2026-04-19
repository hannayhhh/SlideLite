import React, { useState } from 'react';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Dialog, Typography, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

function TextDialog ({ slides, slideId, updateSlides }) {
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [text, setText] = useState('');

  const addTextToSlide = () => {
    updateSlides((latestSlides) => {
      const slideKey = `slide${slideId}`;
      const slideContents = latestSlides[slideKey];
      const contentKeys = Object.keys(slideContents).filter(key => key.startsWith('content'));
      const contentIds = contentKeys.map(key => Number(key.replace('content', '')) || 0);
      const textCount = contentKeys.filter(key => slideContents[key]?.type === 'text').length;
      const newContentId = Math.max(0, ...contentIds) + 1;
      const offset = (textCount % 6) * 3;

      return {
        ...latestSlides,
        [slideKey]: {
          ...slideContents,
          [`content${newContentId}`]: {
            id: newContentId,
            type: 'text',
            data: { text },
            position: {
              x: 35 + offset,
              y: 42 + offset,
              width: 30,
              height: 14
            },
            size: '2',
            fontcolor: '#000000'
          }
        },
      };
    }, { refresh: false });
    setText('');
    setTextDialogOpen(false);
  };

  const handleTextDialogOpen = () => {
    setTextDialogOpen(true);
  };

  const handleTextDialogClose = () => {
    setTextDialogOpen(false);
  };

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
        </DialogContent>
        <DialogActions>
          <Button onClick={addTextToSlide} color="primary" disabled={!text.trim()} >
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
