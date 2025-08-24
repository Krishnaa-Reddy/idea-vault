import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { ContentPageComponent } from './pages/content-page.component';
import { TasksComponent } from './components/quick-add-task/all-tasks';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'content', component: ContentPageComponent }
];
