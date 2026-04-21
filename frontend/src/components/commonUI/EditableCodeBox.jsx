import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, TextField } from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import EditableElementFrame from './EditableElementFrame';

function EditableCodeBox ({ content, contentKey, parentRef, onChangePosition, onDelete, onUpdate }) {
  const [menuPosition, setMenuPosition] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [draftCode, setDraftCode] = useState(content.data?.code || '');
  const [draftLanguage, setDraftLanguage] = useState(content.language || 'javascript');
  const [draftFontSize, setDraftFontSize] = useState(content.size || '1');

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
    setDraftCode(content.data?.code || '');
    setDraftLanguage(content.language || 'javascript');
    setDraftFontSize(content.size || '1');
    setEditDialogOpen(true);
    handleCloseMenu();
  };

  const handleSaveCode = () => {
    onUpdate(contentKey, {
      ...content,
      data: { code: draftCode },
      language: draftLanguage.trim() || 'javascript',
      size: draftFontSize || '1'
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
      <SyntaxHighlighter
        language={content.language}
        style={docco}
        customStyle={{
          margin: 0,
          width: '100%',
          height: '100%',
          fontSize: `${content.size || 1}em`,
          boxSizing: 'border-box',
          overflow: 'auto',
          pointerEvents: 'none'
        }}
      >
        {content.data?.code || ''}
      </SyntaxHighlighter>

      <Menu
        open={Boolean(menuPosition)}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={menuPosition ? { top: menuPosition.mouseY, left: menuPosition.mouseX } : undefined}
      >
        <MenuItem onClick={handleOpenEditDialog}>Edit code</MenuItem>
        <MenuItem onClick={() => { handleCloseMenu(); onDelete(contentKey); }}>Delete</MenuItem>
      </Menu>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Code</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Language"
            fullWidth
            value={draftLanguage}
            onChange={(event) => setDraftLanguage(event.target.value)}
          />
          <TextField
            margin="dense"
            label="Font Size (em)"
            type="number"
            fullWidth
            value={draftFontSize}
            onChange={(event) => setDraftFontSize(event.target.value)}
          />
          <TextField
            margin="dense"
            label="Code"
            fullWidth
            multiline
            minRows={8}
            value={draftCode}
            onChange={(event) => setDraftCode(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveCode}>Save</Button>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </EditableElementFrame>
  );
}

export default EditableCodeBox;
