
import { UserProfile } from '../types';
import { cloudDB } from './cloudDB';

const AUTH_KEY = 'ludo_pro_session';

class AuthService {
  private currentUser: UserProfile | null = null;
  private listeners: ((user: UserProfile | null) => void)[] = [];

  constructor() {
    this.initSession();
  }

  private initSession() {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved && saved.trim().startsWith('{')) {
        this.currentUser = JSON.parse(saved);
      }
    } catch (e) {
      localStorage.removeItem(AUTH_KEY);
    }
  }

  private mapUser(dbUser: any): UserProfile {
    return {
      id: String(dbUser.id),
      username: dbUser.username || 'Player',
      email: dbUser.email || '',
      avatar: dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.username}`,
      level: Number(dbUser.level || 1),
      rank: dbUser.rank_name || 'Bronze',
      country: dbUser.country || 'Global',
      countryCode: dbUser.country_code || 'UN',
      status: 'Online',
      balance: Number(dbUser.balance || 0),
      bonusBalance: Number(dbUser.bonus_balance || 0),
      winBalance: Number(dbUser.win_balance || 0),
      gullaBalance: Number(dbUser.gulla_balance || 0),
      fairPlayScore: Number(dbUser.fair_play_score || 100),
      banStatus: false,
      stats: {
        played: Number(dbUser.stats_played || 0),
        wins: Number(dbUser.stats_wins || 0),
        losses: Number(dbUser.stats_losses || 0),
        winRate: Number(dbUser.stats_win_rate || 0),
        tournamentWins: Number(dbUser.stats_tournament_wins || 0),
        bestStreak: Number(dbUser.stats_best_streak || 0)
      }
    };
  }

  async login(email: string, pass: string): Promise<UserProfile> {
    const user = await cloudDB.findUserByEmail(email);
    
    if (user && user.password === pass) {
      this.currentUser = this.mapUser(user);
      localStorage.setItem(AUTH_KEY, JSON.stringify(this.currentUser));
      this.notify();
      return this.currentUser;
    } else {
      throw new Error("Invalid email or password");
    }
  }

  async register(username: string, email: string, password = 'password123'): Promise<UserProfile> {
    const existing = await cloudDB.findUserByEmail(email);
    if (existing) throw new Error("User already exists");

    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    const newUser = await cloudDB.createUser({ username, email, password, avatar });
    
    this.currentUser = this.mapUser(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(this.currentUser));
    this.notify();
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(AUTH_KEY);
    this.notify();
  }

  getUser(): UserProfile | null {
    return this.currentUser;
  }

  subscribe(callback: (user: UserProfile | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.currentUser));
  }
}

export const authService = new AuthService();
