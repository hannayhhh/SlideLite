import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, AppBar, Toolbar, Typography, TextField, IconButton, Dialog, DialogActions, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import useDeletePPT from '../../hook/useDelete';
import useEditTitle from '../../hook/useEditTitle';
import { useLogout } from '../../hook/useLogout';
import { fetchData } from '../../services/getData';

function Presentation () {
  const navigate = useNavigate();
  const { pptName } = useParams();
  const [editedName, setEditedName] = useState(pptName);
  const [presentation, setPresentation] = useState(null);
  const { deleteOpen, handleOpenModal, handleCloseModal, handleDelete } = useDeletePPT(pptName);
  const { editOpen, handleEditOpen, handleEditClose, handleEditTitle } = useEditTitle(pptName, editedName);

  useEffect(() => {
    const fetchPresentation = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        fetchData(token).then(store => setPresentation(store.presentations[pptName]));
      } catch (error) {
        console.error('Error fetching presentation:', error);
      }
    };
    fetchPresentation();
  }, [pptName, navigate]);

  console.log(presentation);

  return (
    <>
      <AppBar position="static">
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
      {/* 演示文稿编辑内容 */}
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
          <Button variant="contained" onClick={handleDelete} color="error">Yes</Button>
          <Button variant="contained" onClick={handleCloseModal}>No</Button>
       </DialogActions>
    </Dialog>
  </>
  );
}

export default Presentation;
