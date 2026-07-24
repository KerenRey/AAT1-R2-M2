import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' } // Si escriben cualquier otra cosa, los regresa al home
];