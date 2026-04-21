import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

const defaultPosition = {
  x: 35,
  y: 42,
  width: 30,
  height: 14
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function EditableElementFrame ({ children, position = defaultPosition, parentRef, onChangePosition, onContextMenu }) {
  const frameRef = useRef(null);
  const actionRef = useRef(null);
  const [draftPosition, setDraftPosition] = useState(position);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setDraftPosition(position);
  }, [position]);

  useEffect(() => {
    const handleDocumentMouseDown = (event) => {
      if (frameRef.current && !frameRef.current.contains(event.target)) {
        setIsSelected(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!actionRef.current) return;

      const { type, startX, startY, startPosition, parentRect } = actionRef.current;
      const deltaX = ((event.clientX - startX) / parentRect.width) * 100;
      const deltaY = ((event.clientY - startY) / parentRect.height) * 100;

      if (type === 'move') {
        setDraftPosition({
          ...startPosition,
          x: clamp(startPosition.x + deltaX, 0, 100 - startPosition.width),
          y: clamp(startPosition.y + deltaY, 0, 100 - startPosition.height)
        });
      }

      if (type === 'resize') {
        setDraftPosition({
          ...startPosition,
          width: clamp(startPosition.width + deltaX, 8, 100 - startPosition.x),
          height: clamp(startPosition.height + deltaY, 6, 100 - startPosition.y)
        });
      }
    };

    const handleMouseUp = () => {
      if (actionRef.current) {
        const actionSnapshot = actionRef.current;
        setDraftPosition((latestPosition) => {
          onChangePosition(latestPosition, {
            type: actionSnapshot.type,
            startPosition: actionSnapshot.startPosition
          });
          return latestPosition;
        });
      }
      actionRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onChangePosition]);

  const startAction = (event, type) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    if (!parentRef.current) return;

    setIsSelected(true);

    actionRef.current = {
      type,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: draftPosition,
      parentRect: parentRef.current.getBoundingClientRect()
    };
  };

  return (
    <Box
      ref={frameRef}
      onClick={(event) => {
        event.stopPropagation();
        setIsSelected(true);
      }}
      onMouseDown={(event) => startAction(event, 'move')}
      onContextMenu={onContextMenu}
      sx={{
        position: 'absolute',
        left: `${draftPosition.x}%`,
        top: `${draftPosition.y}%`,
        width: `${draftPosition.width}%`,
        height: `${draftPosition.height}%`,
        cursor: 'move',
        boxSizing: 'border-box',
        userSelect: 'none',
        touchAction: 'none',
        border: isSelected ? '1px solid rgba(25, 118, 210, 0.45)' : '1px solid transparent',
        '& .resize-handle': {
          opacity: isSelected ? 1 : 0,
          pointerEvents: isSelected ? 'auto' : 'none'
        }
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: 1,
          backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.03)' : 'transparent'
        }}
      >
        {children}
      </Box>
      <Box
        className="resize-handle"
        onMouseDown={(event) => startAction(event, 'resize')}
        sx={{
          position: 'absolute',
          right: -1,
          bottom: -1,
          width: 16,
          height: 16,
          cursor: 'nwse-resize',
          zIndex: 2,
          borderRight: '3px solid rgba(106, 195, 230, 0.95)',
          borderBottom: '3px solid rgba(106, 195, 230, 0.95)',
          background: 'transparent'
        }}
      />
    </Box>
  );
}

export default EditableElementFrame;
