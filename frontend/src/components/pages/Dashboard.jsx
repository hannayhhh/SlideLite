import React, { useState, useEffect } from 'react';
import { Button, Box, Modal, Typography, TextField, AppBar, Toolbar, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hook/useLogout';
import { fetchData } from '../../services/getData';
import { upgradeData } from '../../services/putData';

function Dashboard () {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [presentationName, setPresentationName] = useState('');
  const [presentations, setPresentations] = useState({});
  const [createTrigger, setCreateTrigger] = useState(false);

  // useEffect for handling login redirect if no token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchData(token).then(store => setPresentations(store.presentations || {}));// get the presentations
    }
  }, [navigate]);

  // useEffect for creating presentation when conditions
  useEffect(() => {
    if (!createTrigger || !presentationName) return;
    const createPresentation = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const storeData = await fetchData(token);
        if (storeData.presentations && storeData.presentations[presentationName]) {
          console.log('Presentation already exists.');
          return;
        }

        // Append new presentation if not exists
        const newPresentations = {
          ...storeData.presentations,
          [presentationName]: {
            slides: { slide1: { id: 1, background: '#fff', backgroundStyle: '', content1: { type: '', data: '' } } },
            description: ''
          }
        };

        await upgradeData(token, { ...storeData, presentations: newPresentations });
        fetchData(token).then(store => setPresentations(store.presentations || {}));
      } catch (error) {
        console.error('Error creating new presentation:', error);
      }
    };

    createPresentation().then(() => {
      handleClose(); // Close modal on successful creation
    });
    setCreateTrigger(false); // Reset trigger
  }, [createTrigger, presentationName, navigate]);

  // Handle modal open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPresentationName(''); // Reset presentation name on close
  };

  // Set trigger to start creation process
  const handleCreateClick = () => {
    if (presentationName.trim()) {
      setCreateTrigger(true);
    } else {
      console.log('Enter a valid presentation name.');
    }
  };

  // console.log(presentations);
  const presentationCards = Object.keys(presentations).map(name => {
    const presentation = presentations[name];
    return (
      <Grid item xs={12} sm={6} md={4} key={name}>
        <Card sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', minWidth: 100, maxWidth: 300, width: '30vw', height: '15vw', minHeight: 50, maxHeight: 150, m: 3 }}>
          <CardActionArea onClick={() => navigate(`/presentation/${name}`)} sx={{ display: 'flex', width: '100%' }}>
            {/* <CardMedia
              height="140"
              image="/static/images/cards/contemplative-reptile.jpg" // Change to your dynamic image if available
              alt="presentation thumbnail"
            /> */}
            <Box sx={{ width: '50%', height: '100%', bgcolor: 'grey.300' }} />
            <CardContent sx={{ padding: 0, width: '50%', height: '100%', overflow: 'hidden' }} >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', m: 1 }}>
              <Typography gutterBottom variant="h6" noWrap>
                {name}
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
