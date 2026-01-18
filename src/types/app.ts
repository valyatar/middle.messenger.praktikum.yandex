import { BlockProps } from '../framework/Block';
import Router from '../router/Router';
import { MessagesService } from '../services/MessagesService';

export interface LoginData {
  login: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export interface UserProfileData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface User {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface Chat {
  id: number;
  title: string;
  avatar: string;
  created_by: number;
  last_message?: string;
}

export interface ChatUserData {
  users: number[];
  chatId: number;
}

export interface AuthController {
  login: (login: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  getCurrentUser: () => User | null;
  fetchUser: () => Promise<User>;
}

export interface UserController {
  updateProfile: (profileData: UserProfileData) => Promise<User>;
  changeAvatar: (avatarFile: File) => Promise<User>;
  changePassword: (data: ChangePasswordData) => Promise<boolean>;
  searchUsers: (login: string) => Promise<User[]>;
}

export interface ChatController {
  loadChats: () => Promise<Chat[]>;
  createChat: (title: string) => Promise<Chat[]>;
  deleteChat: (chatId: number) => Promise<Chat[]>;
  addUsersToChat: (chatId: number, users: number[]) => Promise<void>;
  removeUsersFromChat: (chatId: number, users: number[]) => Promise<void>;
  getChatToken: (chatId: number) => Promise<{ token: string }>;
  getCurrentChats: () => Chat[];
  getChatById: (chatId: number) => Chat | undefined;
}

export interface AppWithControllers {
  authController: AuthController;
  userController: UserController;
  chatController: ChatController;
  router: Router;
  messagesService: MessagesService;
}

export interface AuthorizationPageProps extends BlockProps {
  app: AppWithControllers;
  onSuccess?: () => void;
}

export interface RegisterPageProps extends BlockProps {
  app: AppWithControllers;
  onSuccess?: () => void;
}

export interface ChatListPageProps extends BlockProps {
  app: AppWithControllers;
  onLogout?: () => void;
}

export interface ProfilePageProps extends BlockProps {
  app: AppWithControllers;
  onBack?: () => void;
}

export interface ChangePasswordPageProps extends BlockProps {
  app: AppWithControllers;
  onBack?: () => void;
  onSuccess?: () => void;
}

export interface ErrorPageProps extends BlockProps {
  app?: AppWithControllers;
}
