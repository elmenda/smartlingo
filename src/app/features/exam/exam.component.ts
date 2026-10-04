import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UNITS } from '../../data/units.data';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    @if (unit(); as u) {
      <a [routerLink]="['/unit', u.id]" class="back">← Volver a la unidad</a>
      @if (!started()) {
        <section class="exam-start">
          <div class="trophy">🏆</div>
          <span class="eyebrow">EXAMEN DE LA UNIDAD</span>
          <h1>{{ u.title }}</h1>
          <p>
            {{ u.exam.length }} preguntas. Aquí no hay pistas ni corrección inmediata: primero
            terminas y después revisamos el resultado.
          </p>
          <div class="exam-rules">
            <span>✓ Sin límite de tiempo</span><span>✓ Vocabulario + gramática</span
            ><span>✓ Puedes repetirlo</span>
          </div>
          <button class="primary" (click)="started.set(true)">Comenzar examen →</button>
        </section>
      } @else if (!finished()) {
        <section class="practice-head">
          <div>
            <span class="eyebrow">🏆 EXAMEN</span>
            <h1>Pregunta {{ index() + 1 }}</h1>
          </div>
          <div class="counter">
            {{ index() + 1 }}<small>/ {{ u.exam.length }}</small>
          </div>
        </section>
        <div class="progress-line">
          <i [style.width.%]="((index() + 1) / u.exam.length) * 100"></i>
        </div>
        @if (current(); as e) {
          <article class="exercise-card exam-card">
            <h2>{{ e.prompt }}</h2>
            @if (e.type === 'choice' || e.type === 'true-false') {
              <div class="answers">
                @for (option of e.options; track option) {
                  <button [class.selected]="answer() === option" (click)="answer.set(option)">
                    {{ displayOption(option) }}
                  </button>
                }
              </div>
            } @else {
              <input
                class="answer-input"
                [(ngModel)]="textAnswer"
                placeholder="Tu respuesta..."
                (keyup.enter)="next()"
              />
            }
            <button class="primary check" [disabled]="!hasAnswer()" (click)="next()">
              {{ index() + 1 === u.exam.length ? 'Terminar examen' : 'Siguiente →' }}
            </button>
          </article>
        }
      } @else {
        <section class="result">
          <div class="trophy">{{ score() >= 80 ? '🌟' : score() >= 60 ? '👏' : '💪' }}</div>
          <span class="eyebrow">RESULTADO</span>
          <h1>{{ score() }}%</h1>
          <h2>
            {{
              score() >= 80
                ? '¡Unidad dominada!'
                : score() >= 60
                  ? '¡Buen trabajo!'
                  : 'Necesitas un poco más de práctica'
            }}
          </h2>
          <p>Has acertado {{ correct() }} de {{ u.exam.length }} preguntas.</p>
          <div class="result-actions">
            <a class="secondary" [routerLink]="['/unit', u.id, 'practice']">🎮 Practicar más</a
            ><button class="primary" (click)="restart()">Repetir examen</button>
          </div>
        </section>
        <section class="review-errors">
          <h2>Revisión del examen</h2>
          @for (e of u.exam; track e.id; let i = $index) {
            <article
              [class.good]="isAnswerCorrect(i, e.answer)"
              [class.bad]="!isAnswerCorrect(i, e.answer)"
            >
              <b>{{ i + 1 }}. {{ e.prompt }}</b>
              <p>Tu respuesta: {{ answers()[i] || '—' }}</p>
              @if (!isAnswerCorrect(i, e.answer)) {
                <p>
                  Correcta: <strong>{{ e.answer }}</strong> · {{ e.explanation }}
                </p>
              }
            </article>
          }
        </section>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamComponent {
  readonly id = input<string>('');
  readonly unit = computed(() => UNITS.find((u) => u.id === this.id()));
  readonly started = signal(false);
  readonly finished = signal(false);
  readonly index = signal(0);
  readonly answer = signal('');
  textAnswer = '';
  readonly answers = signal<string[]>([]);
  private readonly progress = inject(ProgressService);
  readonly current = computed(() => this.unit()?.exam[this.index()]);
  readonly correct = computed(
    () =>
      this.unit()?.exam.reduce((n, e, i) => n + (this.isAnswerCorrect(i, e.answer) ? 1 : 0), 0) ??
      0,
  );
  readonly score = computed(() =>
    Math.round((this.correct() / Math.max(this.unit()?.exam.length ?? 1, 1)) * 100),
  );
  displayOption(v: string): string {
    return v === 'true' ? 'Verdadero' : v === 'false' ? 'Falso' : v;
  }
  hasAnswer(): boolean {
    return !!(this.answer() || this.textAnswer.trim());
  }
  next(): void {
    if (!this.hasAnswer()) return;
    this.answers.update((a) => [...a, (this.answer() || this.textAnswer).trim()]);
    this.answer.set('');
    this.textAnswer = '';
    if (this.index() + 1 >= (this.unit()?.exam.length ?? 0)) {
      this.finished.set(true);
      setTimeout(() => this.progress.updateExam(this.id(), this.score()));
    } else this.index.update((v) => v + 1);
  }
  isAnswerCorrect(i: number, expected: string): boolean {
    const clean = (v: string) => (v ?? '').trim().toLowerCase().replace(/[.!?]/g, '');
    return clean(this.answers()[i]) === clean(expected);
  }
  restart(): void {
    this.started.set(true);
    this.finished.set(false);
    this.index.set(0);
    this.answers.set([]);
    this.answer.set('');
    this.textAnswer = '';
  }
}
