import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UNITS } from '../../data/units.data';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (unit(); as u) {
      <a routerLink="/" class="back">← Volver al curso</a>
      <section class="unit-hero">
        <div class="big-emoji">{{ u.emoji }}</div>
        <div><span class="eyebrow">UNIT {{ u.number }}</span><h1>{{ u.title }}</h1><p>{{ u.subtitle }}</p></div>
      </section>

      <nav class="mode-nav">
        <a class="active">📖 Aprende</a>
        <a [routerLink]="['/unit', u.id, 'practice']">🎮 Practica <small>{{u.practice.length}}</small></a>
        <a [routerLink]="['/unit', u.id, 'exam']">🏆 Examen <small>{{u.exam.length}}</small></a>
      </nav>

      <section class="learn-intro">
        <span>💡</span><div><h2>Antes de practicar...</h2><p>Lee cada bloque despacio y di los ejemplos en voz alta. No hace falta memorizar todo a la primera: la práctica se encargará de fijarlo.</p></div>
      </section>

      <section class="theory-grid">
        @for (block of u.theory; track block.title) {
          <article class="theory-card">
            <div class="theory-title"><span>{{block.icon}}</span><h2>{{block.title}}</h2></div>
            <p>{{block.explanation}}</p>
            <div class="examples">
              @for (example of block.examples; track example) { <div>🔊 {{example}}</div> }
            </div>
            @if (block.tip) { <div class="tip">⭐ {{block.tip}}</div> }
          </article>
        }
      </section>

      <section class="vocab-box">
        <div><span class="eyebrow">VOCABULARY</span><h2>Palabras que tienes que dominar</h2></div>
        <div class="chips">@for(word of u.vocabulary; track word){<span>{{word}}</span>}</div>
      </section>

      <div class="next-action">
        <div><h2>¿Lo has entendido?</h2><p>Ahora viene la parte más importante: practicar muchas veces.</p></div>
        <a class="primary" [routerLink]="['/unit',u.id,'practice']">Empezar a practicar →</a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitComponent {
  readonly id = input.required<string>();
  readonly unit = computed(() => UNITS.find(u => u.id === this.id()));
}
