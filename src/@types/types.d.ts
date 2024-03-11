type User = {
  email: string | null;
  emailVerified?: Date;
  id: string;
  notes: Note[];
  password: string;
  passwordSalt: string | null;
};

type Note = {
  content: string;
  createdAt: Date;
  id: string;
  updatedAt: Date;
  userId: string;
};
