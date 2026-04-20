import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Box, AppBar, Toolbar, Typography, TextField, IconButton, Dialog, DialogActions, DialogTitle, useTheme, useMediaQuery } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c';

import useDeletePPT from '../../hook/useDelete';
import useEditTitle from '../../hook/useEditTitle';
import useSlideManager from '../../hook/useSlideManager';
import { useLogout } from '../../hook/useLogout';
import TextDialog from '../commonUI/TextDialog';
import ImgDialog from '../commonUI/ImgDialog';
import VedioDialog from '../commonUI/VedioDialog';
import CodeDialog from '../commonUI/CodeDialog';
import ThemeDialog from '../commonUI/ThemeDialog';
import FontDialog from '../commonUI/FontDialog';
import EditableTextBox from '../commonUI/EditableTextBox';

function Presentation () {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate();
  const location = useLocation();
  const { pptName } = useParams();
  const routeSlides = location.state?.slides;
  const [editedName, setEditedName] = useState(pptName);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(location.state?.currentSlideIndex || 0);
  const slideCanvasRef = useRef(null);
  const { deleteOpen, handleOpenModal, handleCloseModal, handleDelete } = useDeletePPT(pptName);
  const { editOpen, handleEditOpen, handleEditClose, handleEditTitle } = useEditTitle(pptName, editedName);
  const { slides, handleAddSlide, deleteSlide, fetchSlide, isLoading, updateSlides } = useSlideManager(pptName, routeSlides);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else if (!routeSlides) {
      fetchSlide();
    }
  }, [pptName, navigate, routeSlides]);

  const nextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1 < Object.keys(slides).length ? prev + 1 : prev));
  };

  const previousSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  const handleDeleteCurrentSlide = () => {
    const slideCount = Object.keys(slides).length;
    deleteSlide(currentSlideIndex + 1);
    setCurrentSlideIndex(prev => Math.max(0, Math.min(prev, slideCount - 2)));
  };

  SyntaxHighlighter.registerLanguage('javascript', js);
  SyntaxHighlighter.registerLanguage('python', python);
  SyntaxHighlighter.registerLanguage('c', c);

  const updateTextPosition = useCallback((contentKey, position) => {
    updateElement(contentKey, { position }, false);
  }, [currentSlideIndex, slides, updateSlides]);

  const updateElement = useCallback((contentKey, patch, refresh = false) => {
    const slideKey = `slide${currentSlideIndex + 1}`;
    const currentSlide = slides[slideKey];
    if (!currentSlide || !currentSlide[contentKey]) return;

    const updatedSlides = {
      ...slides,
      [slideKey]: {
        ...currentSlide,
        [contentKey]: {
          ...currentSlide[contentKey],
          ...patch
        }
      }
    };

    updateSlides(updatedSlides, { refresh });
  }, [currentSlideIndex, slides, updateSlides]);

  const replaceElement = useCallback((contentKey, nextContent) => {
    updateElement(contentKey, nextContent, false);
  }, [updateElement]);

  const deleteElement = useCallback((contentKey) => {
    const slideKey = `slide${currentSlideIndex + 1}`;
    const currentSlide = slides[slideKey];
    if (!currentSlide || !currentSlide[contentKey]) return;

    const updatedSlide = { ...currentSlide };
    delete updatedSlide[contentKey];

    updateSlides({
      ...slides,
      [slideKey]: updatedSlide
    }, { refresh: false });
  }, [currentSlideIndex, slides, updateSlides]);

  const renderContent = (content) => {
    switch (content.type) {
      case 'text':
        return null;
      case 'image':
        return (
          <img
            src={content.data}
            alt={content.description || 'Slide Image'}
            style={{
              maxWidth: content.area ? `${content.area}px` : '100%',
              maxHeight: content.area ? `${content.area}px` : '100%'
            }}
          />
        );
      case 'video':
        return (
          <video
            src={content.data.videoURL}
            width={content.area}
            autoPlay={content.data.autoPlay}
            controls
            style={{ maxWidth: '100%' }}
          />
        );
      case 'code':
        return (
          <SyntaxHighlighter
            language={content.language}
            style={docco}
            customStyle={{
              overflow: 'hidden',
              fontSize: `${content.size}em`,
              width: content.area ? `${content.area}px` : 'auto'
            }}
          >
            {content.data.code}
          </SyntaxHighlighter>
        );
      case '':
        return;
      default:
        return <Typography>Unsupported content type</Typography>;
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ height: matches ? '8vh' : '10vh' }}>
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

      <Box sx={{ display: 'flex', height: '90vh' }}>
        <Box sx={{ width: '18%', bgcolor: '#edf4f9', padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextDialog slides={slides} slideId={currentSlideIndex + 1} updateSlides={updateSlides}/>
          <ImgDialog slides={slides} slideId={currentSlideIndex + 1}/>
          <VedioDialog slides={slides} slideId={currentSlideIndex + 1}/>
          <CodeDialog slides={slides} slideId={currentSlideIndex + 1}/>
        </Box>
        <Box
          ref={slideCanvasRef}
          sx={{
            flex: 1,
            border: '2px dashed gray',
            m: 5,
            p: 2,
            position: 'relative',
            background: slides[`slide${currentSlideIndex + 1}`]?.backgroundStyle
              ? slides[`slide${currentSlideIndex + 1}`]?.backgroundStyle
              : slides[`slide${currentSlideIndex + 1}`]?.background || '#fff',
          }}
        >
          {isLoading
            ? <Typography>Loading...</Typography>
            : <>
                {slides[`slide${currentSlideIndex + 1}`]
                  ? (
                      Object.keys(slides[`slide${currentSlideIndex + 1}`])
                        .filter(key => key.startsWith('content'))
                        .map(contentKey => {
                          const content = slides[`slide${currentSlideIndex + 1}`][contentKey];
                          if (content.type === 'text') {
                            return (
                              <EditableTextBox
                                key={contentKey}
                                contentKey={contentKey}
                                content={content}
                                parentRef={slideCanvasRef}
                                fontFamily={slides[`slide${currentSlideIndex + 1}`]?.fontFamily}
                                onChangePosition={updateTextPosition}
                                onDelete={deleteElement}
                                onUpdate={replaceElement}
                              />
                            );
                          }
                          return (
                            <div key={contentKey}>
                              {renderContent(content)}
                            </div>
                          );
                        })
                    )
                  : <Typography>No slide data available.</Typography>
                }
                <Typography sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1em',
                }}>
                  {slides[`slide${currentSlideIndex + 1}`] && slides[`slide${currentSlideIndex + 1}`].id}
                </Typography>
              </>
            }
        </Box>
        <Box sx={{ width: '6%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '85vh' }}>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <IconButton onClick={handleAddSlide} color="primary" sx={{ m: 2 }}>
                <AddIcon />
              </IconButton>
              <IconButton onClick={handleDeleteCurrentSlide} color="secondary" sx={{ m: 2 }}>
                <DeleteIcon />
              </IconButton>
              <ThemeDialog slides={slides} slideId={currentSlideIndex + 1} updateSlides={updateSlides}/>
              <FontDialog slides={slides} slideId={currentSlideIndex + 1}/>
              <IconButton onClick={() => navigate(`/${pptName}/preview`, { state: { slides, currentSlideIndex } })} color="primary" sx={{ m: 2 }}>
                <VisibilityIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              {currentSlideIndex > 0 && (
                <IconButton onClick={previousSlide} color="inherit">
                  <NavigateBeforeIcon />
                </IconButton>
              )}
              {currentSlideIndex < Object.keys(slides).length - 1 && (
                <IconButton onClick={nextSlide} color="inherit">
                  <NavigateNextIcon />
                </IconButton>
              )}
            </Box>
          </Box>
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
