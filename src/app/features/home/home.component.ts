import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UNITS } from '../../data/units.data';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div>
        <span class="eyebrow">INGLÉS · 4.º PRIMARIA</span>
        <h1>Aprende. Practica. <strong>Domina.</strong></h1>
        <p>Primero entiende la teoría, después practica todo lo que necesites y examínate cuando estés preparada.</p>
      </div>
      <div class="hero-mascot">💬<span>Hello!</span></div>
    </section>

    <section class="how">
      <article><b>1</b><span>📖</span><h3>Aprende</h3><p>Teoría clara y ejemplos.</p></article>
      <article><b>2</b><span>🎮</span><h3>Practica mucho</h3><p>Intentos ilimitados y explicación de errores.</p></article>
      <article><b>3</b><span>🏆</span><h3>Examínate</h3><p>Comprueba lo que sabes sin pistas.</p></article>
    </section>

    <div class="section-title">
      <div><span class="eyebrow">TU CURSO</span><h2>Elige una unidad</h2></div>
      <p>{{ totalExercises }} actividades disponibles</p>
    </div>

    <section class="unit-grid">
      @for (unit of units; track unit.id) {
        <a class="unit-card" [routerLink]="['/unit', unit.id]">
          <div class="unit-top"><span class="unit-number">{{ unit.number }}</span><span class="unit-emoji">{{ unit.emoji }}</span></div>
          <h3>{{ unit.title }}</h3>
          <p>{{ unit.subtitle }}</p>
          <div class="stats"><span>🎮 {{ unit.practice.length }} prácticas</span><span>🏆 {{ unit.exam.length }} examen</span></div>
          @if (progress.progress()[unit.id]; as p) {
            <div class="mini-progress">
              <span>Mejor examen: {{ p.bestExam }}%</span>
              <div><i [style.width.%]="p.bestExam"></i></div>
            </div>
          }
          <span class="open">Entrar →</span>
        </a>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly units = UNITS;
  readonly progress = inject(ProgressService);
  readonly totalExercises = UNITS.reduce((sum, u) => sum + u.practice.length + u.exam.length, 0);
}
