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
  const actionRef = useRef(null);
  const [draftPosition, setDraftPosition] = useState(position);

  useEffect(() => {
    setDraftPosition(position);
  }, [position]);

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
        setDraftPosition((latestPosition) => {
          onChangePosition(latestPosition);
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
    event.preventDefault();
    event.stopPropagation();
    if (!parentRef.current) return;

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
      onMouseDown={(event) => startAction(event, 'move')}
      onContextMenu={onContextMenu}
      sx={{
        position: 'absolute',
        left: `${draftPosition.x}%`,
        top: `${draftPosition.y}%`,
        width: `${draftPosition.width}%`,
        height: `${draftPosition.height}%`,
        overflow: 'hidden',
        cursor: 'move',
        boxSizing: 'border-box',
        userSelect: 'none'
      }}
    >
      {children}
      <Box
        component="span"
        onMouseDown={(event) => startAction(event, 'resize')}
        sx={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 12,
          height: 12,
          cursor: 'nwse-resize'
        }}
      />
    </Box>
  );
}

export default EditableElementFrame;
