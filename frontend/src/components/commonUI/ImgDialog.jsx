import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageIcon from '@mui/icons-material/Image';
import { Dialog, Typography, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import useSlideManager from '../../hook/useSlideManager';

function ImgDialog ({ slides, slideId }) {
  const { presentationId } = useParams();
  const [ImgDialogOpen, setImgDialogOpen] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [imageArea, setImageArea] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const { updateSlides } = useSlideManager(presentationId);

  const addImageToSlide = () => {
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
          id: newContentId,
          type: 'image',
          data: imageURL,
          area: imageArea,
          description: imageDescription
        }
      },
    };
    updateSlides(updatedSlides);
    setImgDialogOpen(false);
  };

  const handleImgDialogOpen = () => {
    setImgDialogOpen(true);
  };

  const handleImgDialogClose = () => {
    setImgDialogOpen(false);
  };

  // Make sure all the Typography is filled
  return (
    <>
      <Button variant="outlined" color="inherit" onClick={handleImgDialogOpen} sx={{ m: 2, p: 1, width: '90%', height: '15vh' }}>
        <ImageIcon sx={{ fontSize: 'large' }} />
        <Typography variant="caption" display="block">IMAGE</Typography>
      </Button>
      <Dialog open={ImgDialogOpen} onClose={handleImgDialogClose}>
        <DialogTitle>Add Image to Slide</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="imageURL"
            label="Image URL or Base64"
            type="text"
            fullWidth
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
          <TextField
            margin="dense"
            id="imageArea"
            label="Image Area Size"
            type="text"
            fullWidth
            value={imageArea}
            onChange={(e) => setImageArea(e.target.value)}
          />
          <TextField
            margin="dense"
            id="imageDescription"
            label="Image Description (alt text)"
            type="text"
            fullWidth
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addImageToSlide} color="primary" disabled={!imageURL || !imageArea || !imageDescription} >
            Add
          </Button>
          <Button onClick={handleImgDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ImgDialog;
