import React from 'react';
import { Box, Typography } from '@mui/material';

function SlideThumbnail ({ slide }) {
  const contentKeys = slide
    ? Object.keys(slide)
      .filter(key => key.startsWith('content') && slide[key]?.type)
      .sort((a, b) => Number(a.replace('content', '')) - Number(b.replace('content', '')))
    : [];
  const background = slide?.backgroundStyle || slide?.background || '';
  const hasCustomBackground = Boolean(background && background !== '#fff' && background !== '#ffffff');

  if (!slide || (!hasCustomBackground && contentKeys.length === 0)) {
    return (
      <Box
        sx={{
          width: '50%',
          height: '100%',
          bgcolor: 'grey.300',
          flexShrink: 0
        }}
      />
    );
  }

  const renderContent = (content) => {
    switch (content.type) {
      case 'text':
        return (
          <Typography
            key={content.id}
            sx={{
              color: content.fontcolor || 'text.primary',
              fontFamily: slide.fontFamily || 'Arial',
              fontSize: `${Math.max(Number(content.size) || 1, 0.8) * 6}px`,
              lineHeight: 1.1,
              maxWidth: '90%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              border: '1px solid rgba(0, 0, 0, 0.18)',
              px: 0.5,
              py: 0.25,
              bgcolor: 'rgba(255, 255, 255, 0.55)'
            }}
          >
            {content.data?.text}
          </Typography>
        );
      case 'image':
        return (
          <Box
            key={content.id}
            component="img"
            src={content.data}
            alt={content.description || 'Slide thumbnail image'}
            sx={{
              maxWidth: '90%',
              maxHeight: '70%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        );
      case 'video':
        return (
          <Box
            key={content.id}
            sx={{
              width: '72%',
              height: '42%',
              bgcolor: 'grey.900',
              color: 'common.white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10
            }}
          >
            Video
          </Box>
        );
      case 'code':
        return (
          <Box
            key={content.id}
            component="pre"
            sx={{
              width: '88%',
              maxHeight: '45%',
              m: 0,
              p: 0.5,
              bgcolor: 'rgba(255, 255, 255, 0.75)',
              color: 'text.primary',
              fontFamily: 'monospace',
              fontSize: 7,
              overflow: 'hidden',
              whiteSpace: 'pre-wrap'
            }}
          >
            {content.data?.code}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: '50%',
        height: '100%',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
        background: background || '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        p: 0.5,
        boxSizing: 'border-box'
      }}
    >
      {contentKeys.map(key => renderContent(slide[key]))}
      <Typography
        sx={{
          position: 'absolute',
          bottom: 2,
          left: 4,
          fontSize: 9,
          color: 'text.secondary',
          bgcolor: 'rgba(255, 255, 255, 0.55)',
          px: 0.4
        }}
      >
        {slide.id}
      </Typography>
    </Box>
  );
}

export default SlideThumbnail;
