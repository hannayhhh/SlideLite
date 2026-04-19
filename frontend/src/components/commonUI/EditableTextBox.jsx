import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, TextField, Typography } from '@mui/material';
import EditableElementFrame from './EditableElementFrame';

function EditableTextBox ({ content, contentKey, parentRef, fontFamily, onChangePosition, onDelete, onUpdate }) {
  const [menuPosition, setMenuPosition] = useState(null);
  const [styleDialogOpen, setStyleDialogOpen] = useState(false);
  const [fontSize, setFontSize] = useState(content.size || '2');
  const [fontColor, setFontColor] = useState(content.fontcolor || '#000000');

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuPosition({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6
    });
  };

  const handleCloseMenu = () => setMenuPosition(null);

  const handleOpenStyleDialog = () => {
    setFontSize(content.size || '2');
    setFontColor(content.fontcolor || '#000000');
    setStyleDialogOpen(true);
    handleCloseMenu();
  };

  const handleSaveStyle = () => {
    onUpdate(contentKey, {
      ...content,
      size: fontSize || '2',
      fontcolor: fontColor || '#000000'
    });
    setStyleDialogOpen(false);
  };

  return (
    <EditableElementFrame
      position={content.position}
      parentRef={parentRef}
      onChangePosition={(position) => onChangePosition(contentKey, position)}
      onContextMenu={handleContextMenu}
    >
      <Typography
        sx={{
          width: '100%',
          height: '100%',
          fontSize: `${content.size || 2}em`,
          fontFamily: fontFamily || 'Arial',
          color: content.fontcolor || '#000',
          overflow: 'hidden',
          padding: '6px',
          boxSizing: 'border-box'
        }}
      >
        {content.data?.text}
      </Typography>

      <Menu
        open={Boolean(menuPosition)}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={menuPosition ? { top: menuPosition.mouseY, left: menuPosition.mouseX } : undefined}
      >
        <MenuItem onClick={handleOpenStyleDialog}>Edit style</MenuItem>
        <MenuItem onClick={() => { handleCloseMenu(); onDelete(contentKey); }}>Delete</MenuItem>
      </Menu>

      <Dialog open={styleDialogOpen} onClose={() => setStyleDialogOpen(false)}>
        <DialogTitle>Edit Text Style</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Font Size (em)"
            type="number"
            fullWidth
            value={fontSize}
            onChange={(event) => setFontSize(event.target.value)}
          />
          <TextField
            margin="dense"
            label="Text Color (HEX)"
            fullWidth
            value={fontColor}
            onChange={(event) => setFontColor(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveStyle}>Save</Button>
          <Button onClick={() => setStyleDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </EditableElementFrame>
  );
}

export default EditableTextBox;
