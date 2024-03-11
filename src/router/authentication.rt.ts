import express from 'express';
import { z } from 'zod';

import { login, register, update } from '../controllers/authentication.ctrl';
import { isAuthOwner, isAuthenticated, validate } from '../middleware';

const registerLoginSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: z.string(),
	}),
});

const updateSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: z.string(),
		newPassword: z.string(),
	}),
});

export default (router: express.Router) => {
	router.post('/auth/register', validate(registerLoginSchema), register);
	router.post('/auth/login', validate(registerLoginSchema), login);
	router.patch('/auth/update', validate(updateSchema), isAuthenticated, isAuthOwner, update);
};
