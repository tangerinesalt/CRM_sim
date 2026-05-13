import { create } from 'zustand';
import appConfig from '../config/app-config.json';
import seedUsers from '../mock/seed-users.json';
import type { Role, User } from '../types';

const users = seedUsers as User[];
const defaultUser =
  users.find((user) => user.role === (appConfig.defaultRole as Role)) ?? users[0];

interface AuthStore {
  users: User[];
  currentUserId: string;
  currentUser: User;
  switchUser: (userId: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  users,
  currentUserId: defaultUser.id,
  currentUser: defaultUser,
  switchUser: (userId) => {
    const nextUser = users.find((user) => user.id === userId) ?? defaultUser;
    set({ currentUserId: nextUser.id, currentUser: nextUser });
  },
}));
