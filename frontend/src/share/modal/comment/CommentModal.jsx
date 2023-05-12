import Axios from '../../AxiosInstance';
import { Box, Button, Card, Modal, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useKeyDown } from '../../../hooks/useKeyDown';
import CommentCard from './components/CommentCard';
import Cookies from 'js-cookie';
import SnackBarMessage from '../../SnackBarMessage';
import { AxiosError } from 'axios';

const CommentModal = ({ open = false, handleClose = () => {} }) => {
  const [textField, setTextField] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState({});
  
  useEffect(() => {
    const userToken = Cookies.get('UserToken');
    if (userToken !== undefined || userToken !== 'undefined') {
      Axios.get('/comment', { headers: { Authorization: `Bearer ${userToken}` } }).then((res) => {
        console.log(res.data);
      });
    }
  })
  useKeyDown(() => {
    handleAddComment();
  }, ['Enter']);

  const handleAddComment = async () => {
    // TODO implement logic
    if (!validateForm())  return;
    try {
      const userToken = Cookies.get('UserToken');
      const response = await Axios.post('/comment', textField, {
        headers: {Authorization: `Bearer ${userToken}`}
      });
      if (response.data.success) {
        SnackBarMessage({message: 'Create comment successfully', severity: 'success'});
        setComments([...comments, { id: Math.random(), msg: textField }]);
      }
    } catch (error) {
      console.error(error);
      // if (error instanceof AxiosError && error.response) {
      //   SnackBarMessage({message: error.response.data.error, severity: 'error'});
      // } else {
      //   SnackBarMessage({message: error.message, severity: 'error'});
      // }
    }
  };

  const validateForm = () => {
    const error = '';
    if (!textField) error = 'Comment is required';
    setError(error);

    if(Object.keys(error).length) return false;
    return true;
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Card
        sx={{
          width: { xs: '60vw', lg: '40vw' },
          maxWidth: '600px',
          maxHeight: '400px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '16px',
          backgroundColor: '#ffffffCC',
          p: '2rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <TextField
            value={textField}
            onChange={(e) => setTextField(e.target.value)}
            fullWidth
            placeholder="Type your comment"
            variant="standard"
          />
          <Button onClick={handleAddComment}>Submit</Button>
        </Box>
        <Box
          sx={{
            overflowY: 'scroll',
            maxHeight: 'calc(400px - 2rem)',
            '&::-webkit-scrollbar': {
              width: '.5rem', // chromium and safari
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#999999',
              borderRadius: '10px',
            },
          }}
        >
          {comments.map((comment) => (
            <CommentCard comment={comment} key={comment.id} />
          ))}
        </Box>
      </Card>
    </Modal>
  );
};

export default CommentModal;
