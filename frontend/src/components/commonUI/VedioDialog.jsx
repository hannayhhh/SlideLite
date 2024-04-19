import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { Dialog, Typography, DialogTitle, DialogContent, DialogActions, TextField, Button, Switch, FormControlLabel } from '@mui/material';
import useSlideManager from '../../hook/useSlideManager';

function VideoDialog ({ slides, slideId }) {
  const { pptName } = useParams();
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoURL, setVideoURL] = useState('');
  const [videoAreaSize, setVideoAreaSize] = useState('');
  const [autoPlay, setAutoPlay] = useState(false);
  const { updateSlides } = useSlideManager(pptName);

  const addVideoToSlide = () => {
    const slideContents = slides[`slide${slideId}`];
    const contentKeys = Object.keys(slideContents).filter(key => key.startsWith('content'));
    const newContentId = contentKeys.length + 1;
    const updatedSlides = {
      ...slides,
      [`slide${slideId}`]: {
        ...slideContents,
        [`content${newContentId}`]: {
          id: newContentId,
          type: 'video',
          data: { videoURL, autoPlay },
          area: videoAreaSize
        }
      },
    };
    updateSlides(updatedSlides);
    setVideoDialogOpen(false);
  };

  const handleVideoDialogOpen = () => {
    setVideoDialogOpen(true);
  };

  const handleVideoDialogClose = () => {
    setVideoDialogOpen(false);
  };

  return (
    <>
      <Button variant="outlined" color="inherit" onClick={handleVideoDialogOpen} sx={{ m: 2, p: 1, width: '90%', height: '15vh' }}>
        <OndemandVideoIcon sx={{ fontSize: 'large' }} />
        <Typography variant="caption" display="block">VIDEO</Typography>
      </Button>
      <Dialog open={videoDialogOpen} onClose={handleVideoDialogClose}>
        <DialogTitle>Add Video to Slide</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="videoURL"
            label="Video URL"
            type="text"
            fullWidth
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
          />
          <TextField
            margin="dense"
            id="videoAreaSize"
            label="Video Area Size"
            type="text"
            fullWidth
            value={videoAreaSize}
            onChange={(e) => setVideoAreaSize(e.target.value)}
          />
          <FormControlLabel
            control={<Switch checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} />}
            label="Auto-Play"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addVideoToSlide} color="primary" disabled={!videoURL || !videoAreaSize}>
            Add
          </Button>
          <Button onClick={handleVideoDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default VideoDialog;
