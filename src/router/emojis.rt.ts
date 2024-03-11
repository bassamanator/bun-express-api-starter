import express from 'express';

import { getEmojis } from '../controllers/emojis.ctrl';
import { isAuthenticated } from '../middleware';

export default (router: express.Router) => {
  router.get('/emojis', getEmojis);
  router.get('/emojis/auth', isAuthenticated, (req, res) => {
    res.json({
      message: 'Authenticated route - 👋🌎🌍🌏🔒🔑',
    });
  });
};
