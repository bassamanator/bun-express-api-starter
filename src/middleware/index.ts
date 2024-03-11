import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';
import { merge } from 'lodash';
import type { AnyZodObject } from 'zod';

import { getUserById, getUserIdFromReq } from '../helpers';
import type { JwtPayloadWithId } from '../interfaces';

export * from './middlewares';

export const isAuthenticated = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	const { authorization } = req.headers;
	if (!authorization) return res.status(404).json({ message: 'Denied' });

	const token = authorization.split(' ')[1]; // NOTE Expects 'Bearer token'
	if (!token) return res.status(404).json({ message: 'Denied' });

	try {
		let id = jwt.verify(token, process.env.JWT_SECRET as string);
		id = (id as JwtPayloadWithId).id;
		merge(req, { identity: id });

		next();
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: 'Denied' });
	}
};

export const isAuthOwner = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const currentUserId = getUserIdFromReq(req);
		if (!currentUserId) return res.sendStatus(403);

		const { email } = req.body;
		const user = await getUserById(currentUserId);
		if (!user) return res.sendStatus(403);

		if (user.email !== email) res.sendStatus(403);
		next();
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};

export const validate =
	(schema: AnyZodObject) =>
	async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (error) {
			console.log(error);
			return res.status(400).json({ message: 'Error validating', error });
		}
	};
