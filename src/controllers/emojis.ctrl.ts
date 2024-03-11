import express from 'express';

export const getEmojis = async (req: express.Request, res: express.Response) =>
  res.status(200).json(['😀', '😳', '🙄']).end();
