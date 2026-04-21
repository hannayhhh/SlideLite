import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { Box, Dialog, Typography, DialogTitle, DialogContent, DialogActions, TextField, Button, Switch, FormControlLabel } from '@mui/material';
import useSlideManager from '../../hook/useSlideManager';

function VideoDialog ({ slides, slideId }) {
  const { presentationId } = useParams();
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoURL, setVideoURL] = useState('');
  const [autoPlay, setAutoPlay] = useState(false);
  const { updateSlides } = useSlideManager(presentationId);

  const resetDialog = () => {
    setVideoURL('');
    setAutoPlay(false);
  };

  const addVideoToSlide = () => {
    const slideContents = slides[`slide${slideId}`];
    const contentKeys = Object.keys(slideContents).filter(key => key.startsWith('content'));
    const contentIds = contentKeys.map(key => Number(key.replace('content', '')) || 0);
    const videoCount = contentKeys.filter(key => slideContents[key]?.type === 'video').length;
    const newContentId = Math.max(0, ...contentIds) + 1;
    const offset = (videoCount % 4) * 4;
    const updatedSlides = {
      ...slides,
      [`slide${slideId}`]: {
        ...slideContents,
        [`content${newContentId}`]: {
          id: newContentId,
          type: 'video',
          data: { videoURL, autoPlay },
          position: {
            x: 26 + offset,
            y: 20 + offset,
            width: 48,
            height: 34
          }
        }
      },
    };
    updateSlides(updatedSlides, { refresh: false });
    setVideoDialogOpen(false);
    resetDialog();
  };

  const handleVideoDialogOpen = () => {
    setVideoDialogOpen(true);
  };

  const handleVideoDialogClose = () => {
    setVideoDialogOpen(false);
    resetDialog();
  };

  return (
    <>
      <Button variant="outlined" color="inherit" onClick={handleVideoDialogOpen} sx={{ m: 2, p: 1, width: '90%', height: '15vh' }}>
        <OndemandVideoIcon sx={{ fontSize: 'large' }} />
        <Typography variant="caption" display="block">VIDEO</Typography>
      </Button>
      <Dialog open={videoDialogOpen} onClose={handleVideoDialogClose} fullWidth maxWidth="sm">
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
          <FormControlLabel
            control={<Switch checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} />}
            label="Auto-Play"
          />
          {videoURL && (
            <Box
              sx={{
                mt: 2,
                border: '1px solid #d7dce1',
                borderRadius: 1,
                height: 220,
                overflow: 'hidden',
                bgcolor: '#111'
              }}
            >
              <video
                src={videoURL}
                autoPlay={autoPlay}
                muted={autoPlay}
                controls
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={addVideoToSlide} color="primary" disabled={!videoURL.trim()}>
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
