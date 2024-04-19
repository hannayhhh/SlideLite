import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSlideManager from '../../hook/useSlideManager';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function Thumbnail () {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { pptName } = useParams();
  const { slides, fetchSlide, isLoading } = useSlideManager(pptName);
  const currentSlideIndex = 0;

  const renderContent = (content) => {
    switch (content.type) {
      case 'text':
        return (
          <Typography
            style={{
              fontSize: `${content.size}em`,
              fontFamily: slides[`slide${currentSlideIndex + 1}`]?.fontFamily,
              color: content.fontcolor,
              width: `${content.area}px`,
              overflow: 'hidden',
              border: '1px solid #ccc',
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchSlide();
    }
  }, [navigate]);

  return (
    <>
        <Box
        sx={{
          flex: 1,
          m: 5,
          p: 2,
          width: '50%',
          height: matches ? '35vw' : '15vw',
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
    </>
  );
}

export default Thumbnail;
