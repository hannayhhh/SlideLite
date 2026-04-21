import React, { useState, useEffect } from 'react';
import { Button, Box, Modal, Typography, TextField, AppBar, Toolbar, Grid, Card, CardContent, CardActionArea, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hook/useLogout';
import { useStoreContext } from '../../context/StoreContext';
import { getNextPresentationId } from '../../utils/presentations';
import SlideThumbnail from '../commonUI/SlideThumbnail';

function Dashboard () {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { store, updateStoreData } = useStoreContext();
  const [open, setOpen] = useState(false);
  const [presentationName, setPresentationName] = useState('');
  const presentations = store?.presentations || {};

  // useEffect for handling login redirect if no token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle modal open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPresentationName(''); // Reset presentation name on close
  };

  // Set trigger to start creation process
  const handleCreateClick = async () => {
    if (!presentationName.trim()) {
      console.log('Enter a valid presentation name.');
      return;
    }

    try {
      await updateStoreData((latestStore) => {
        const nextPresentations = latestStore?.presentations || {};

        const newPresentationId = String(getNextPresentationId(nextPresentations));

        return {
          ...latestStore,
          presentations: {
            ...nextPresentations,
            [newPresentationId]: {
              id: Number(newPresentationId),
              name: presentationName,
              slides: { slide1: { id: 1, background: '#fff', backgroundStyle: '', content1: { type: '', data: '' } } },
              description: ''
            }
          }
        };
      });
      handleClose();
    } catch (error) {
      console.error('Error creating new presentation:', error);
    }
  };

  // console.log(presentations);
  const presentationCards = Object.values(presentations).map(presentation => {
    const presentationId = String(presentation.id);
    return (
      <Grid item xs={12} sm={6} md={4} key={presentationId}>
        <Card sx={{ display: 'flex', flexDirection: matches ? 'column' : 'row', justifyContent: 'space-between', minWidth: 100, maxWidth: 300, width: matches ? '70vw' : '30vw', height: matches ? '35vw' : '15vw', minHeight: 50, maxHeight: 150, m: 3 }}>
          <CardActionArea onClick={() => navigate(`/presentation/${presentationId}`)} sx={{ display: 'flex', width: '100%' }}>
            <SlideThumbnail slide={presentation.slides?.slide1} />
            <CardContent sx={{ padding: 0, width: '50%', height: matches ? '35vw' : '15vw', overflow: 'hidden' }} >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', m: 1 }}>
              <Typography gutterBottom variant="h6" noWrap>
                {presentation.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {`Slides: ${Object.keys(presentation.slides || {}).length}`}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {presentation.description || ''}
              </Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  });

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="inherit" onClick={handleOpen}>New Presentation</Button>
            <Button color="inherit" onClick={useLogout()}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={2}>
          {presentationCards}
        </Grid>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-new-presentation"
        aria-describedby="create-presentation-modal"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            Create New Presentation
          </Typography>
          <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Presentation Name"
          type="text"
          fullWidth
          variant="outlined"
          value={presentationName}
          onChange={(e) => setPresentationName(e.target.value)}
          />
          <Box display="flex" justifyContent="flex-end" width="100%">
          <Button onClick={handleCreateClick} color="primary">
            Create
          </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default Dashboard;
