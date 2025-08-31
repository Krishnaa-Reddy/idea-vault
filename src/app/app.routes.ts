import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { TasksComponent } from './components/quick-add-task/all-tasks';
import { MultipleForms } from './components/test-form';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'form', component: MultipleForms },
];
