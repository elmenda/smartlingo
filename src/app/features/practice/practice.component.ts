import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UNITS } from '../../data/units.data';
import { type Exercise } from '../../core/models/learning.models';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    @if (unit(); as u) {
      <a [routerLink]="['/unit', u.id]" class="back">← Volver a la teoría</a>
      <section class="practice-head">
        <div>
          <span class="eyebrow">🎮 ZONA DE PRÁCTICA</span>
          <h1>{{ u.title }}</h1>
          <p>
            Equivocarse aquí está bien. Puedes repetir todos los ejercicios las veces que quieras.
          </p>
        </div>
        <div class="counter">
          {{ index() + 1 }}<small>/ {{ exercises().length }}</small>
        </div>
      </section>
      <div class="progress-line"><i [style.width.%]="progressPercent()"></i></div>

      @if (current(); as e) {
        <article class="exercise-card">
          <div class="skill">{{ skillLabel(e) }}</div>
          <h2>{{ e.prompt }}</h2>

          @if (e.type === 'choice' || e.type === 'true-false') {
            <div class="answers">
              @for (option of e.options; track option) {
                <button
                  [class.selected]="answer() === option"
                  [disabled]="checked()"
                  (click)="answer.set(option)"
                >
                  {{ displayOption(option) }}
                </button>
              }
            </div>
          } @else {
            <input
              class="answer-input"
              [disabled]="checked()"
              [(ngModel)]="textAnswer"
              placeholder="Escribe tu respuesta aquí..."
              (keyup.enter)="check()"
            />
            @if (e.type === 'order') {
              <p class="helper">💡 Escribe la frase en el orden correcto.</p>
            }
          }

          @if (!checked()) {
            <button class="primary check" [disabled]="!hasAnswer()" (click)="check()">
              Comprobar
            </button>
          } @else {
            <div class="feedback" [class.ok]="isCorrect()" [class.ko]="!isCorrect()">
              <strong>{{ isCorrect() ? '✓ ¡Muy bien!' : '✗ Casi. Vamos a entenderlo.' }}</strong>
              <p>{{ e.explanation }}</p>
              @if (!isCorrect()) {
                <p><b>Respuesta:</b> {{ e.answer }}</p>
              }
            </div>
            <button class="primary check" (click)="next()">
              {{ index() + 1 === exercises().length ? 'Volver a empezar ↻' : 'Siguiente →' }}
            </button>
          }
        </article>
      }
      <div class="practice-note">
        🧠 <b>Consejo:</b> intenta explicar en voz alta por qué una respuesta es correcta antes de
        pulsar «Siguiente».
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PracticeComponent {
  readonly id = input<string>('');
  readonly unit = computed(() => UNITS.find((u) => u.id === this.id()));
  readonly exercises = computed(() => this.unit()?.practice ?? []);
  readonly index = signal(0);
  readonly answer = signal('');
  readonly checked = signal(false);
  readonly isCorrect = signal(false);
  textAnswer = '';
  private readonly progress = inject(ProgressService);
  readonly current = computed(() => this.exercises()[this.index()]);
  readonly progressPercent = computed(
    () => ((this.index() + 1) / Math.max(this.exercises().length, 1)) * 100,
  );

  hasAnswer(): boolean {
    return !!(this.answer() || this.textAnswer.trim());
  }
  displayOption(v: string): string {
    return v === 'true' ? 'Verdadero' : v === 'false' ? 'Falso' : v;
  }
  skillLabel(e: Exercise): string {
    return {
      vocabulary: 'Vocabulario',
      grammar: 'Gramática',
      reading: 'Comprensión',
      communication: 'Comunicación',
    }[e.skill];
  }
  check(): void {
    if (!this.hasAnswer() || this.checked()) return;
    const expected = this.current()?.answer.trim().toLowerCase().replace(/[.!?]/g, '');
    const given = (this.answer() || this.textAnswer).trim().toLowerCase().replace(/[.!?]/g, '');
    const ok = expected === given;
    this.isCorrect.set(ok);
    this.checked.set(true);
    this.progress.updatePractice(this.id(), ok);
  }
  next(): void {
    this.index.set((this.index() + 1) % this.exercises().length);
    this.answer.set('');
    this.textAnswer = '';
    this.checked.set(false);
    this.isCorrect.set(false);
  }
}
