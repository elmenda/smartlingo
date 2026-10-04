import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <a routerLink="/" class="brand"><span>🧠</span> SmartLingo</a>
      <span class="tag">English · 4.º Primaria</span>
    </header>
    <main><router-outlet /></main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
