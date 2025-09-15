import { Routes } from '@angular/router';
import { MultipleForms } from './components/test-form';
import { AboutPage } from './pages/about';
import { TasksPage } from './pages/all-tasks';
import { HomePage } from './pages/home';

export const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full', title: 'IdeaVault - Home' },
  { path: 'tasks', component: TasksPage, title: 'IdeaVault - Tasks' },
  { path: 'form', component: MultipleForms, title: 'IdeaVault - Test Form' },
  { path: 'about', component: AboutPage, title: 'IdeaVault - Features & Architecture' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
