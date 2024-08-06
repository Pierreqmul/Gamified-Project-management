import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/status', (req, res) => {
  const state = mongoose.connection.readyState;
  let status = '';

  if (state === 1) {
    status = 'connected';
  } else if (state === 2) {
    status = 'connecting';
  } else if (state === 0) {
    status = 'disconnected';
  } else if (state === 3) {
    status = 'disconnecting';
  }

  res.status(200).json({ status, state });
});

export default router;
