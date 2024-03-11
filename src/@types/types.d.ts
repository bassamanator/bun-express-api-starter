type User = {
  email: string | null;
  emailVerified?: Date;
  id: string;
  notes: Note[];
  password: string;
  passwordSalt: string | null;
};
