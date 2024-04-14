import React, { useState, useEffect } from 'react';
import { Button, Box, Modal, Typography, TextField, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard () {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [presentationName, setPresentationName] = useState('');
  // const [presentations, setPresentations] = useState({});
  const [createTrigger, setCreateTrigger] = useState(false);

  // const fetchPresentations = async (token) => {
  //   try {
  //     const response = await axios.get('http://localhost:5005/store', {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setPresentations(response.data.store.store.presentations || {});
  //   } catch (error) {
  //     console.error('Error fetching presentations:', error);
  //   }
  // };

  // useEffect for handling login redirect if no token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  // Log out logic
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post('http://localhost:5005/admin/auth/logout', {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        });
        console.log('Logout successful');
      } catch (error) {
        if (error.response) {
          console.error('Logout failed', error.response.data);
        } else if (error.request) {
          console.error('Logout failed', error.request);
        } else {
          console.error('Error', error.message);
        }
      }
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  // useEffect for creating presentation when conditions are met
  useEffect(() => {
    if (!createTrigger || !presentationName) return;
    const createPresentation = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5005/store', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const storeData = response.data.store.store;
        console.log(storeData.presentations);

        if (storeData.presentations && storeData.presentations[presentationName]) {
          console.log('Presentation already exists.');
          return;
        }

        // Append new presentation if not exists
        const newpresentations = {
          ...storeData.presentations,
          [presentationName]: { page: 1, slides: {} }
        };

        await axios.put('http://localhost:5005/store', { store: { ...storeData, presentations: newpresentations } }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('New presentation created successfully.');
        // fetchPresentations(token);
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

  const addTitle = (
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
  );

  // const presentationCards = Object.keys(presentations).map(name => (
  //   <Grid item xs={12} sm={6} md={4} key={name}>
  //     <Card sx={{ width: 300, height: 150 }}>
  //       <CardContent>
  //         <Typography variant="h6">{name}</Typography>
  //         <Typography variant="body2">{`Slides: ${presentations[name].slides.length}`}</Typography>
  //       </CardContent>
  //     </Card>
  //   </Grid>
  // ));

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="inherit" onClick={handleOpen}>New Presentation</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
      {/* <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={2}>
          {presentationCards}
        </Grid>
      </Box> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-new-presentation"
        aria-describedby="create-presentation-modal"
      >
        {addTitle}
      </Modal>
    </>
  );
}

export default Dashboard;
