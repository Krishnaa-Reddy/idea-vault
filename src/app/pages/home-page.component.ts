import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'home-page',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-950">
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div class="text-center max-w-4xl mx-auto">
          <div class="mb-8">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 mb-6"
            >
              ✨ Never forget another idea
            </span>
          </div>

          <h1 class="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            Your ideas deserve
            <span
              class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block"
            >
              intelligent reminders
            </span>
          </h1>

          <p class="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            A minimalist capture tool that prevents you from forgetting important links, tasks, and
            goals by sending smart reminders directly to your email.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              class="bg-black dark:bg-gray-100 text-white dark:text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Capturing Ideas
            </button>
            <a
              routerLink="/tasks"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold text-lg flex items-center gap-2"
            >
              View Tasks
              <span class="text-xl">→</span>
            </a>
          </div>

          <!-- Demo Preview -->
          <div class="relative max-w-4xl mx-auto">
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-2">
                <div class="flex gap-2">
                  <div class="w-3 h-3 rounded-full bg-red-400"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div class="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 ml-4">Quick Add Interface</div>
              </div>
              <div class="p-8">
                <div class="mb-4">
                  <input
                    type="text"
                    placeholder="Paste a URL or type a task..."
                    class="w-full p-4 text-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readonly
                  />
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex gap-2">
                    <span class="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-full text-sm font-medium"
                      >🔥 High</span
                    >
                    <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                      >🟡 Medium</span
                    >
                    <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                      >🧊 Low</span
                    >
                  </div>
                  <button class="bg-black dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200">
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Built for speed and simplicity</h2>
          <p class="text-lg text-gray-600 dark:text-gray-300">Capture → Remind → Act. That's it.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800">
            <div
              class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl">⚡</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Lightning Fast</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Add tasks in under 10 seconds. No friction, no complicated forms.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800">
            <div
              class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl">🎯</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Smart Reminders</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Get reminded via email when you need them.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800">
            <div
              class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <span class="text-2xl">🔗</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Auto-Enrichment</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Paste any URL that you don't want to miss out.
            </p>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="bg-gray-50 dark:bg-gray-900 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">10s</div>
              <div class="text-gray-600 dark:text-gray-300">Average capture time</div>
            </div>
            <div>
              <div class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">99%</div>
              <div class="text-gray-600 dark:text-gray-300">Reminder delivery rate</div>
            </div>
            <div>
              <div class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">0</div>
              <div class="text-gray-600 dark:text-gray-300">Forgotten ideas</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-gray-200 dark:border-gray-800 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="flex items-center space-x-2 mb-4 md:mb-0">
              <div
                class="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center"
              >
                <span class="text-white font-bold text-xs">IV</span>
              </div>
              <span class="text-gray-600 dark:text-gray-300">© 2025 IdeaVault. Never forget again.</span>
            </div>
            <div class="flex space-x-6">
              <a
                href="#"
                class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >Privacy</a
              >
              <a
                href="#"
                class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >Terms</a
              >
              <a
                href="#"
                class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >Support</a
              >
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class HomePageComponent {}
