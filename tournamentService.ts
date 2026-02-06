
import { Tournament } from '../types';
import { authService } from './authService';
import { cloudDB } from './cloudDB';

class TournamentService {
  private tournaments: Tournament[] = [];
  private listeners: ((tournaments: Tournament[]) => void)[] = [];

  constructor() {
    this.fetchTournaments();
    if (typeof window !== 'undefined') {
      setInterval(() => this.simulateParticipantGrowth(), 12000);
    }
  }

  async fetchTournaments(): Promise<Tournament[]> {
    try {
      this.tournaments = await cloudDB.getTournaments();
      this.notify();
      return this.tournaments;
    } catch (e) {
      console.error("Failed to fetch tournaments from cloud", e);
      return [];
    }
  }

  private async simulateParticipantGrowth() {
    let changed = false;
    const updated = await Promise.all(this.tournaments.map(async t => {
      if (t.status === 'UPCOMING' && t.participants < t.maxParticipants && Math.random() > 0.6) {
        changed = true;
        const newCount = Math.min(t.maxParticipants, t.participants + Math.floor(Math.random() * 2) + 1);
        const updatedT = await cloudDB.updateTournament(t.id, { 
          participants: newCount, 
          isFull: newCount >= t.maxParticipants 
        });
        return updatedT;
      }
      return t;
    }));
    
    if (changed) {
      this.tournaments = updated;
      this.notify();
    }
  }

  getTournaments(): Tournament[] {
    return [...this.tournaments];
  }

  async addTournament(tournament: Tournament) {
    await cloudDB.addTournament(tournament);
    await this.fetchTournaments();
  }

  async joinTournament(id: string) {
    const user = authService.getUser();
    if (!user) return { success: false, error: "Please log in first" };

    const tIndex = this.tournaments.findIndex(t => t.id === id);
    if (tIndex === -1) return { success: false, error: "Tournament not found" };

    const t = this.tournaments[tIndex];
    if (t.participants >= t.maxParticipants) {
      return { success: false, error: "Tournament is full" };
    }

    // Update cloud
    const updatedParticipants = t.participants + 1;
    await cloudDB.updateTournament(id, {
      participants: updatedParticipants,
      isFull: updatedParticipants >= t.maxParticipants
    });
    
    await this.fetchTournaments();
    return { success: true };
  }

  subscribe(callback: (tournaments: Tournament[]) => void) {
    this.listeners.push(callback);
    callback([...this.tournaments]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.tournaments]));
  }
}

export const tournamentService = new TournamentService();
