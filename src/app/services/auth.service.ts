import { Injectable, computed, signal } from '@angular/core';

export type UserRole = 'customer' | 'admin';

export interface User {
  username: string;
  role: UserRole;
}

interface RegisteredUser extends User {
  password: string;
}

const USERS_STORAGE_KEY = 'login-app-registered-users';
const CURRENT_USER_STORAGE_KEY = 'login-app-current-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSignal = signal<User | null>(null);
  readonly user = this.userSignal;
  readonly isLoggedIn = computed(() => !!this.userSignal());
  readonly isAdmin = computed(() => this.userSignal()?.role === 'admin');

  constructor() {
    const currentUser = this.loadCurrentUser();
    this.userSignal.set(currentUser);
  }

  private loadRegisteredUsers(): RegisteredUser[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as RegisteredUser[];
    } catch {
      return [];
    }
  }

  private saveRegisteredUsers(users: RegisteredUser[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  private loadCurrentUser(): User | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }

  private saveCurrentUser(user: User | null): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }

  register(username: string, password: string, role: UserRole): boolean {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return false;
    }

    const users = this.loadRegisteredUsers();
    const isDuplicate = users.some(
      (user) => user.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (isDuplicate) {
      return false;
    }

    users.push({ username: trimmedUsername, password: trimmedPassword, role });
    this.saveRegisteredUsers(users);
    return true;
  }

  login(username: string, password: string, role: UserRole): boolean {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return false;
    }

    const users = this.loadRegisteredUsers();
    const match = users.find(
      (user) =>
        user.username.toLowerCase() === trimmedUsername.toLowerCase() &&
        user.password === trimmedPassword &&
        user.role === role
    );

    if (!match) {
      return false;
    }

    const currentUser: User = { username: trimmedUsername, role };
    this.userSignal.set(currentUser);
    this.saveCurrentUser(currentUser);
    return true;
  }

  logout(): void {
    this.userSignal.set(null);
    this.saveCurrentUser(null);
  }
}
