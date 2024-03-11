import express from 'express';
import type { JwtPayload } from 'jsonwebtoken';

export * from './ErrorResponse';
export * from './MessageResponse';

export interface JwtPayloadWithId extends JwtPayload {
	id: string;
}

export interface RequestWithIdentity extends express.Request {
	identity: string; // NOTE Adjust 'identity' if you need
}
