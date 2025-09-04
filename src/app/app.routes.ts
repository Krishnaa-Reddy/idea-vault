import { Routes } from '@angular/router';
import { TasksComponent } from './components/quick-add-task/all-tasks';
import { MultipleForms } from './components/test-form';
import { HomePageComponent } from './pages/home-page.component';

export const routes: Routes = [
  { path: '',component: HomePageComponent, pathMatch: 'full', title: 'IdeaVault - Home' },
  { path: 'tasks', component: TasksComponent, title: 'IdeaVault - Tasks' },
  { path: 'form', component: MultipleForms, title: 'IdeaVault - Test Form' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
