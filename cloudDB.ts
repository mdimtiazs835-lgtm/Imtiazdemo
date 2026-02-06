
import { UserProfile, Tournament } from '../types';

/**
 * Mock Cloud Database Engine
 * Simulates a real-time cloud backend (Firebase/Supabase style)
 */
class MockCloudDB {
  private STORAGE_KEY = 'ludo_pro_cloud_v1';

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialData = {
        users: [
          {
            id: 'u-demo-1',
            username: 'Pro_Champion',
            email: 'pro@ludo.com',
            password: 'password123', // In real cloud, this would be hashed
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pro',
            level: 25,
            rank_name: 'Diamond',
            balance: 2450.00,
            bonus_balance: 150.00,
            win_balance: 840.00,
            gulla_balance: 45.00,
            fair_play_score: 98,
            stats_played: 452,
            stats_wins: 289,
            stats_losses: 163,
            stats_win_rate: 64,
            stats_tournament_wins: 15,
            stats_best_streak: 9,
            country: 'Bangladesh',
            country_code: 'BD'
          }
        ],
        tournaments: [
          {
            id: 't-blitz-01',
            title: 'Diamond Blitz Arena',
            type: 'Blitz',
            entryFee: '$50',
            prizePool: '$1200',
            participants: 28,
            maxParticipants: 64,
            status: 'UPCOMING',
            startTime: Date.now() + 15 * 60000,
            isFull: false
          },
          {
            id: 't-pro-01',
            title: 'Master Class Pro League',
            type: 'Pro',
            entryFee: '$100',
            prizePool: '$4500',
            participants: 112,
            maxParticipants: 128,
            status: 'UPCOMING',
            startTime: Date.now() + 45 * 60000,
            isFull: false
          }
        ]
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    }
  }

  private getData() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
  }

  private saveData(data: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Simulates network latency (500ms - 1s)
   */
  private async simulateNetwork() {
    const delay = 500 + Math.random() * 500;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // --- AUTH CLOUD METHODS ---

  async findUserByEmail(email: string) {
    await this.simulateNetwork();
    const data = this.getData();
    return data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  }

  async createUser(userData: any) {
    await this.simulateNetwork();
    const data = this.getData();
    const newUser = {
      ...userData,
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      level: 1,
      rank_name: 'Bronze',
      balance: 100.00,
      bonus_balance: 50.00,
      win_balance: 0,
      gulla_balance: 0,
      fair_play_score: 100,
      stats_played: 0,
      stats_wins: 0,
      stats_losses: 0,
      stats_win_rate: 0,
      stats_tournament_wins: 0,
      stats_best_streak: 0,
      country: 'Global',
      country_code: 'UN'
    };
    data.users.push(newUser);
    this.saveData(data);
    return newUser;
  }

  // --- TOURNAMENT CLOUD METHODS ---

  async getTournaments() {
    await this.simulateNetwork();
    return this.getData().tournaments;
  }

  async updateTournament(id: string, update: Partial<Tournament>) {
    await this.simulateNetwork();
    const data = this.getData();
    const idx = data.tournaments.findIndex((t: any) => t.id === id);
    if (idx > -1) {
      data.tournaments[idx] = { ...data.tournaments[idx], ...update };
      this.saveData(data);
    }
    return data.tournaments[idx];
  }

  async addTournament(tournament: Tournament) {
    await this.simulateNetwork();
    const data = this.getData();
    data.tournaments.unshift(tournament);
    this.saveData(data);
  }
}

export const cloudDB = new MockCloudDB();
