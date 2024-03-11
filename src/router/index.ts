import express from 'express';

import authentication from './authentication.rt';
import emojis from './emojis.rt';

const router = express.Router();

export default (): express.Router => {
  router.get('/', (req, res) => {
    res.json({
      message: 'API - 👋🌎🌍🌏',
    });
  });
  authentication(router);
  emojis(router);
  return router;
};
