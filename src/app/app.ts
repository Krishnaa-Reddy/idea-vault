import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmH1 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, HlmButton, HlmH1],
  template: `
    <div class="min-h-screen flex flex-col bg-background text-foreground">
      <header class="bg-card shadow-sm z-10 sticky top-0">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
          <a routerLink="/home" class="flex items-center gap-2 text-2xl font-bold text-primary-foreground">
            <h1 hlmH1 class="!text-2xl !leading-none text-primary">IdeaVault</h1>
          </a>
          <nav>
            <a hlmBtn variant="ghost" routerLink="/home" routerLinkActive="bg-accent text-accent-foreground"
              >Home
            </a>
            <a hlmBtn variant="ghost" routerLink="/tasks" routerLinkActive="bg-accent text-accent-foreground"
              >Tasks
            </a>
          </nav>
        </div>
      </header>
      <main class="container mx-auto p-4 flex-grow">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class App {
  protected readonly title = signal('idea-vault');
}
