import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import EditableElementFrame from './EditableElementFrame';

function EditableImageBox ({ content, contentKey, parentRef, onChangePosition, onDelete }) {
  const [menuPosition, setMenuPosition] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuPosition({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6
    });
  };

  const handleCloseMenu = () => setMenuPosition(null);

  return (
    <EditableElementFrame
      position={content.position}
      parentRef={parentRef}
      onChangePosition={(position) => onChangePosition(contentKey, position)}
      onContextMenu={handleContextMenu}
    >
      <img
        src={content.data}
        alt={content.description || 'Slide image'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />

      <Menu
        open={Boolean(menuPosition)}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={menuPosition ? { top: menuPosition.mouseY, left: menuPosition.mouseX } : undefined}
      >
        <MenuItem onClick={() => { handleCloseMenu(); onDelete(contentKey); }}>Delete</MenuItem>
      </Menu>
    </EditableElementFrame>
  );
}

export default EditableImageBox;
