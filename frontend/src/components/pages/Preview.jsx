import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useSlideManager from '../../hook/useSlideManager';
import { Box, Typography, IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function Preview () {
  const navigate = useNavigate();
  const location = useLocation();
  const { presentationId } = useParams();
  const routeSlides = location.state?.slides;
  const { slides, isLoading } = useSlideManager(presentationId, routeSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(location.state?.currentSlideIndex || 0);
  const previewRef = useRef(null);
  const slidesRef = useRef(slides);
  const currentSlideIndexRef = useRef(currentSlideIndex);

  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  useEffect(() => {
    currentSlideIndexRef.current = currentSlideIndex;
  }, [currentSlideIndex]);

  const renderContent = (content) => {
    switch (content.type) {
      case 'text':
        return (
          <Typography
            sx={{
              position: content.position ? 'absolute' : 'static',
              left: content.position ? `${content.position.x}%` : 'auto',
              top: content.position ? `${content.position.y}%` : 'auto',
              width: content.position ? `${content.position.width}%` : `${content.area}px`,
              height: content.position ? `${content.position.height}%` : 'auto',
              fontSize: `${content.size}em`,
              fontFamily: slides[`slide${currentSlideIndex + 1}`]?.fontFamily,
              color: content.fontcolor,
              overflow: 'hidden',
              border: 'none',
              padding: '6px',
              boxSizing: 'border-box'
            }}
          >
            {content.data.text}
          </Typography>
        );
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

  const nextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1 < Object.keys(slides).length ? prev + 1 : prev));
  };

  const previousSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (previewRef.current && !document.fullscreenElement) {
          await previewRef.current.requestFullscreen();
        }
      } catch (error) {
        console.error('Failed to enter fullscreen:', error);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        navigate(`/presentation/${presentationId}`, {
          state: {
            slides: slidesRef.current,
            currentSlideIndex: currentSlideIndexRef.current
          }
        });
      }
    };

    enterFullscreen();
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [navigate, presentationId]);

  return (
    <>
      <Box ref={previewRef} sx={{ border: 'none', height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#000' }}>
        <Box
        sx={{
          flex: 1,
          m: 0,
          p: 2,
          height: '100vh',
          width: '100%',
          border: 'none',
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
                  // Map over each content key in the current slide
                    Object.keys(slides[`slide${currentSlideIndex + 1}`])
                      .filter(key => key.startsWith('content')) // Ensure only content keys are processed
                      .map(contentKey => (
                      <div key={contentKey}>
                          {renderContent(slides[`slide${currentSlideIndex + 1}`][contentKey])}
                      </div>
                      ))
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

        <Box sx={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)' }}>
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
    </>
  );
}

export default Preview;
