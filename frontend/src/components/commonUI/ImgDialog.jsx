import React, { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageIcon from '@mui/icons-material/Image';
import { Box, Dialog, Typography, DialogTitle, DialogContent, DialogActions, TextField, Button, Tabs, Tab } from '@mui/material';
import useSlideManager from '../../hook/useSlideManager';

function ImgDialog ({ slides, slideId }) {
  const { presentationId } = useParams();
  const [ImgDialogOpen, setImgDialogOpen] = useState(false);
  const [sourceMode, setSourceMode] = useState('upload');
  const [imageURL, setImageURL] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const fileInputRef = useRef(null);
  const { updateSlides } = useSlideManager(presentationId);

  const resolvedImage = useMemo(() => (
    sourceMode === 'upload' ? uploadedImage : imageURL.trim()
  ), [imageURL, sourceMode, uploadedImage]);

  const resetDialog = () => {
    setSourceMode('upload');
    setImageURL('');
    setUploadedImage('');
    setUploadedFileName('');
    setImageDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addImageToSlide = () => {
    const slideContents = slides[`slide${slideId}`];
    const contentKeys = Object.keys(slideContents).filter(key => key.startsWith('content'));
    const contentIds = contentKeys.map(key => Number(key.replace('content', '')) || 0);
    const imageCount = contentKeys.filter(key => slideContents[key]?.type === 'image').length;
    const newContentId = Math.max(0, ...contentIds) + 1;
    const offset = (imageCount % 4) * 4;
    const updatedSlides = {
      ...slides,
      [`slide${slideId}`]: {
        ...slideContents,
        [`content${newContentId}`]: {
          id: newContentId,
          type: 'image',
          data: resolvedImage,
          description: imageDescription.trim(),
          position: {
            x: 28 + offset,
            y: 18 + offset,
            width: 40,
            height: 40
          }
        }
      },
    };
    updateSlides(updatedSlides, { refresh: false });
    setImgDialogOpen(false);
    resetDialog();
  };

  const handleImgDialogOpen = () => {
    setImgDialogOpen(true);
  };

  const handleImgDialogClose = () => {
    setImgDialogOpen(false);
    resetDialog();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result?.toString() || '');
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Button variant="outlined" color="inherit" onClick={handleImgDialogOpen} sx={{ m: 2, p: 1, width: '90%', height: '15vh' }}>
        <ImageIcon sx={{ fontSize: 'large' }} />
        <Typography variant="caption" display="block">IMAGE</Typography>
      </Button>
      <Dialog open={ImgDialogOpen} onClose={handleImgDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Image to Slide</DialogTitle>
        <DialogContent>
          <Tabs value={sourceMode} onChange={(_, value) => setSourceMode(value)} sx={{ mb: 2 }}>
            <Tab value="upload" label="Upload" />
            <Tab value="url" label="URL" />
          </Tabs>

          {sourceMode === 'upload'
            ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
                <Button variant="outlined" onClick={() => fileInputRef.current?.click()}>
                  Choose Local Image
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {uploadedFileName || 'No file selected'}
                </Typography>
              </Box>
              )
            : (
              <TextField
                autoFocus
                margin="dense"
                id="imageURL"
                label="Image URL"
                type="text"
                fullWidth
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              />
              )}

          <TextField
            margin="dense"
            id="imageDescription"
            label="Image Description (optional alt text)"
            type="text"
            fullWidth
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
          />

          {resolvedImage && (
            <Box
              sx={{
                mt: 2,
                border: '1px solid #d7dce1',
                borderRadius: 1,
                height: 220,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                bgcolor: '#f7f9fb'
              }}
            >
              <img
                src={resolvedImage}
                alt={imageDescription || 'Preview'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={addImageToSlide} color="primary" disabled={!resolvedImage} >
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
