import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';

function ContextMenu ({ onClose, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onClose();
  };

  return (
    <div onContextMenu={handleContextMenu}>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <MenuItem onClick={onDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
}

export default ContextMenu;
