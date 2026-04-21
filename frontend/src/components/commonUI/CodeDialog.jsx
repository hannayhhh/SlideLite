import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Dialog, Typography, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco'; // 确保导入
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c';

import useSlideManager from '../../hook/useSlideManager';

// Register languages for syntax highlighting
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('c', c);

function CodeDialog ({ slides, slideId }) {
  const { presentationId } = useParams();
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [code, setCode] = useState('');
  const [fontSize, setFontSize] = useState('1');
  const [language, setLanguage] = useState('javascript');
  const { updateSlides } = useSlideManager(presentationId);

  const resetDialog = () => {
    setCode('');
    setFontSize('1');
    setLanguage('javascript');
  };

  const addCodeToSlide = () => {
    const slideContents = slides[`slide${slideId}`];
    const contentKeys = Object.keys(slideContents).filter(key => key.startsWith('content'));
    const contentIds = contentKeys.map(key => Number(key.replace('content', '')) || 0);
    const codeCount = contentKeys.filter(key => slideContents[key]?.type === 'code').length;
    const newContentId = Math.max(0, ...contentIds) + 1;
    const offset = (codeCount % 4) * 3;
    const updatedSlides = {
      ...slides,
      [`slide${slideId}`]: {
        ...slideContents,
        [`content${newContentId}`]: {
          id: newContentId,
          type: 'code',
          data: { code },
          size: fontSize,
          language,
          position: {
            x: 18 + offset,
            y: 18 + offset,
            width: 48,
            height: 38
          }
        }
      },
    };
    updateSlides(updatedSlides, { refresh: false });
    setCodeDialogOpen(false);
    resetDialog();
  };

  const handleCodeDialogOpen = () => {
    setCodeDialogOpen(true);
  };

  const handleCodeDialogClose = () => {
    setCodeDialogOpen(false);
    resetDialog();
  };

  return (
    <>
      <Button variant="outlined" color="inherit" onClick={handleCodeDialogOpen} sx={{ m: 2, p: 1, width: '90%', height: '15vh' }}>
        <TextFieldsIcon sx={{ fontSize: 'large' }} />
        <Typography variant="caption" display="block">CODE</Typography>
      </Button>
      <Dialog open={codeDialogOpen} onClose={handleCodeDialogClose} fullWidth>
        <DialogTitle>Add Code to Slide</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="fontSize"
            label="Font Size (em)"
            type="text"
            fullWidth
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          />
          <TextField
            margin="dense"
            id="codeLanguage"
            label="Language (javascript, python, c)"
            type="text"
            fullWidth
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
          <TextField
            margin="dense"
            id="code"
            label="Code"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>Preview:</Typography>
          <SyntaxHighlighter language={detectLanguage(language)} style={docco}>
            {code}
          </SyntaxHighlighter>
        </DialogContent>
        <DialogActions>
          <Button onClick={addCodeToSlide} color="primary" disabled={!code.trim() || !fontSize || !language.trim()}>
            Add
          </Button>
          <Button onClick={handleCodeDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  // Helper function to map user input to SyntaxHighlighter's expected language identifiers
  function detectLanguage (lang) {
    switch (lang.trim().toLowerCase()) {
      case 'javascript':
        return 'javascript';
      case 'python':
        return 'python';
      case 'c':
        return 'c';
      default:
        return 'plaintext'; // default case if language is not recognized
    }
  }
}

export default CodeDialog;
