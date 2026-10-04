import { Injectable, signal } from '@angular/core';

export interface UnitProgress {
  practiceAnswered: number;
  practiceCorrect: number;
  bestExam: number;
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly key = 'smartlingo-progress-v1';
  readonly progress = signal<Record<string, UnitProgress>>(this.load());

  updatePractice(unitId: string, correct: boolean): void {
    const all = { ...this.progress() };
    const current = all[unitId] ?? { practiceAnswered: 0, practiceCorrect: 0, bestExam: 0 };
    all[unitId] = {
      ...current,
      practiceAnswered: current.practiceAnswered + 1,
      practiceCorrect: current.practiceCorrect + (correct ? 1 : 0),
    };
    this.save(all);
  }

  updateExam(unitId: string, score: number): void {
    const all = { ...this.progress() };
    const current = all[unitId] ?? { practiceAnswered: 0, practiceCorrect: 0, bestExam: 0 };
    all[unitId] = { ...current, bestExam: Math.max(current.bestExam, score) };
    this.save(all);
  }

  reset(): void {
    localStorage.removeItem(this.key);
    this.progress.set({});
  }

  private load(): Record<string, UnitProgress> {
    try { return JSON.parse(localStorage.getItem(this.key) ?? '{}') as Record<string, UnitProgress>; }
    catch { return {}; }
  }
  private save(value: Record<string, UnitProgress>): void {
    localStorage.setItem(this.key, JSON.stringify(value));
    this.progress.set(value);
  }
}
