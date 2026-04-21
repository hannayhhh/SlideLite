import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Menu, MenuItem, Switch, TextField } from '@mui/material';
import EditableElementFrame from './EditableElementFrame';

function EditableVideoBox ({ content, contentKey, parentRef, onChangePosition, onDelete, onUpdate }) {
  const [menuPosition, setMenuPosition] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [videoURL, setVideoURL] = useState(content.data?.videoURL || '');
  const [autoPlay, setAutoPlay] = useState(Boolean(content.data?.autoPlay));

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuPosition({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6
    });
  };

  const handleCloseMenu = () => setMenuPosition(null);

  const handleOpenEditDialog = () => {
    setVideoURL(content.data?.videoURL || '');
    setAutoPlay(Boolean(content.data?.autoPlay));
    setEditDialogOpen(true);
    handleCloseMenu();
  };

  const handleSaveVideo = () => {
    onUpdate(contentKey, {
      ...content,
      data: {
        videoURL: videoURL.trim(),
        autoPlay
      }
    });
    setEditDialogOpen(false);
  };

  return (
    <EditableElementFrame
      position={content.position}
      parentRef={parentRef}
      onChangePosition={(position) => onChangePosition(contentKey, position)}
      onContextMenu={handleContextMenu}
    >
      <video
        src={content.data?.videoURL}
        autoPlay={Boolean(content.data?.autoPlay)}
        muted={Boolean(content.data?.autoPlay)}
        controls={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none',
          backgroundColor: '#111'
        }}
      />

      <Menu
        open={Boolean(menuPosition)}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={menuPosition ? { top: menuPosition.mouseY, left: menuPosition.mouseX } : undefined}
      >
        <MenuItem onClick={handleOpenEditDialog}>Edit video</MenuItem>
        <MenuItem onClick={() => { handleCloseMenu(); onDelete(contentKey); }}>Delete</MenuItem>
      </Menu>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Video URL"
            fullWidth
            value={videoURL}
            onChange={(event) => setVideoURL(event.target.value)}
          />
          <FormControlLabel
            control={<Switch checked={autoPlay} onChange={(event) => setAutoPlay(event.target.checked)} />}
            label="Auto-Play"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveVideo} disabled={!videoURL.trim()}>Save</Button>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </EditableElementFrame>
  );
}

export default EditableVideoBox;
