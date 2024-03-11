import { createToken, getUserByEmail, sanitizeUser } from '@/helpers';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import express from 'express';

const prisma = new PrismaClient();

export const register = async (req: express.Request, res: express.Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  const hash = await bcrypt
    .hash(password, 10)
    .catch(() => res.status(500).end());

  let user = null;
  try {
    user = await prisma.user.create({
      data: { email, password: hash as string },
    });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: 'Duplicate email', error });
  }

  const token = createToken((user as User).id);

  return res.status(201).json({ token, ...sanitizeUser(user as User) });
};

export const update = async (req: express.Request, res: express.Response) => {
  const {
    email,
    password: currentPassword,
    newPassword,
  }: { email: string; newPassword: string; password: string } = req.body;

  const user = await getUserByEmail(email);
  if (!user)
    return res.status(404).json({ message: 'Error changing password' });

  const match = await bcrypt.compare(currentPassword, user?.password as string);
  if (!match)
    return res.status(404).json({ message: 'Error changing password' });

  const hash = await bcrypt
    .hash(newPassword, 10)
    .catch(() => res.status(500).end());

  const update = await prisma.user.update({
    where: { id: user.id },
    data: { password: hash as string },
  });
  return res.status(201).json({ ...sanitizeUser(update as User) });
};

export const login = async (req: express.Request, res: express.Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  const user = await getUserByEmail(email);
  if (!user) return res.status(418).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, (user as User).password);
  if (!match) return res.status(401).json({ message: 'Wrong password' });

  const token = createToken((user as User).id);

  return res.status(200).json({ token, ...sanitizeUser(user as User) });
};
