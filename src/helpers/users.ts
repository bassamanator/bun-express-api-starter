import { PrismaClient } from '@prisma/client';
import express from 'express';
import { get, pick } from 'lodash';

const prisma = new PrismaClient();

export const getUserByEmail = async (email: string) =>
	prisma.user.findUnique({
		where: { email },
	});

export const getUserById = async (id: string) =>
	prisma.user.findUnique({
		where: { id },
	});

export const getUserIdFromReq = (req: express.Request): string | undefined => get(req, 'identity');

export const sanitizeUser = (user: User) => pick(user, ['id', 'email', 'emailVerified']);
