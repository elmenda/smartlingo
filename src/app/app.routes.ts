import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { UnitComponent } from './features/unit/unit.component';
import { PracticeComponent } from './features/practice/practice.component';
import { ExamComponent } from './features/exam/exam.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'unit/:id', component: UnitComponent },
  { path: 'unit/:id/practice', component: PracticeComponent },
  { path: 'unit/:id/exam', component: ExamComponent },
  { path: '**', redirectTo: '' },
];
