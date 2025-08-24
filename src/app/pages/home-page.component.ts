import { Component } from '@angular/core';
import { TasksComponent } from "../components/quick-add-task/all-tasks";

@Component({
  selector: 'home-page',
  imports: [],
  template: `
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">Welcome to the Home Page!</h1>
      <p class="mb-4">This is a sample home page for your Angular application.</p>
    </div>
  `,
})
export class HomePageComponent {}
