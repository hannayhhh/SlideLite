import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, AppBar, Toolbar, Typography, TextField, IconButton, Dialog, DialogActions, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import useDeletePPT from '../../hook/useDelete';
import useEditTitle from '../../hook/useEditTitle';
import useSlideManager from '../../hook/useSlideManager';
import { useLogout } from '../../hook/useLogout';

function Presentation () {
  const navigate = useNavigate();
  const { pptName } = useParams();
  const [editedName, setEditedName] = useState(pptName);
  const { deleteOpen, handleOpenModal, handleCloseModal, handleDelete } = useDeletePPT(pptName);
  const { editOpen, handleEditOpen, handleEditClose, handleEditTitle } = useEditTitle(pptName, editedName);
  const { slides, currentSlideIndex, handleAddSlide, deleteSlide, nextSlide, previousSlide, fetchSlide } = useSlideManager(pptName);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else { fetchSlide(token); }
  }, [pptName, navigate]);

  const renderContent = (content) => {
    switch (content.type) {
      case 'text':
        return <Typography>{content.data}</Typography>;
      case 'image':
        return <img src={content.data} alt="Slide Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />;
      case 'code':
        return <Typography style={{ fontFamily: 'monospace', backgroundColor: '#f4f4f4', padding: '10px' }}>{content.data}</Typography>;
      case '':
        return <Typography>Empty</Typography>;
      default:
        return <Typography>Unsupported content type</Typography>;
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ height: '10vh' }}>
        <Toolbar>
          <Typography variant="h4" sx={{ m: 1 }}>{pptName}</Typography>
          <IconButton color="inherit" onClick={handleEditOpen}>
            <EditIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="inherit" onClick={handleOpenModal} sx={{ mr: 2 }} endIcon={<DeleteIcon />}>Delete Presentation</Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/Dashboard')} sx={{ mr: 2 }}>Back to Dashboard</Button>
            <Button variant="outlined" color="inherit" onClick={useLogout()}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', height: '90vh' }}> {/* 假设 AppBar 高度为64px */}
        <Box sx={{ width: '18%', bgcolor: '#edf4f9' }}>
        </Box>
        <Box sx={{ flex: 1, border: '2px dashed gray', m: 5, p: 2, position: 'relative' }}>
        {slides[`slide${currentSlideIndex + 1}`] ? renderContent(slides[`slide${currentSlideIndex + 1}`].content1) : <Typography>No slide data available.</Typography>}
        <Typography sx={{
          position: 'absolute', // 子元素设置为绝对定位
          bottom: 0, // 定位到底部
          left: 0, // 定位到左边
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1em',
        }}>
          { slides[`slide${currentSlideIndex + 1}`].id }
        </Typography>
        </Box>
        <Box sx={{ width: '5%' }}>
          <button onClick={handleAddSlide}>Add Slide</button>
          <button onClick={() => deleteSlide(currentSlideIndex + 1)}>Delete Slide</button>
          {currentSlideIndex > 0 && <button onClick={previousSlide}>Previous</button>}
          {currentSlideIndex < Object.keys(slides).length - 1 && <button onClick={nextSlide}>Next</button>}
        </Box>
      </Box>

      <Dialog open={editOpen} onClose={handleEditClose} aria-labelledby="edit-confirmation">
        <Box sx={{ boxShadow: 20, width: 400 }}>
          <DialogTitle>Edit Presentation Name</DialogTitle>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Presentation Name"
            type="text"
            variant="outlined"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            sx={{ p: 2, ml: 1, width: 350 }}
          />
          <DialogActions>
            <Button onClick={handleEditTitle} color="primary">Save</Button>
            <Button onClick={handleEditClose} color="primary">Cancel</Button>
         </DialogActions>
        </Box>
      </Dialog>
      <Dialog open={deleteOpen} onClose={handleCloseModal} aria-labelledby="delete-confirmation">
        <DialogTitle id="delete-confirmation">Are you sure you want to delete this presentation?</DialogTitle>
        <DialogActions>
          <Button variant="contained" onClick={handleDelete} color="secondary">Yes</Button>
          <Button variant="contained" onClick={handleCloseModal}>No</Button>
       </DialogActions>
    </Dialog>
  </>
  );
}

export default Presentation;
