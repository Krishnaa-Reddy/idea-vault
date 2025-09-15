import { inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthSession } from '@supabase/supabase-js';
import { catchError, distinctUntilChanged, from, of, tap } from 'rxjs';
import { _supabase } from './supabase/supabase-client';
import { TasksLocalService } from './tasks-local.service';
import { ToasterService } from './toaster-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private session = signal<AuthSession | null>(null);
  _session = toSignal(
    toObservable(this.session).pipe(
      distinctUntilChanged((prev, curr) => prev?.user?.id === curr?.user?.id),
    ),
    { initialValue: null },
  );

  private toaster = inject(ToasterService);
  private localPreference = inject(TasksLocalService)._preference;

  constructor() {
    _supabase.auth.onAuthStateChange((_, session) => {
      this.session.set(session);
    });
  }

  signIn() {
    if (this._session()) return;
    // NOTE: This is the place where its confirm that, I am logging in for the first time.
    from(
      _supabase.auth.signInWithOAuth({
        provider: 'google',
      }),
    )
      .pipe(
        tap(() => this.localPreference.set(false)),
        tap(() => this.toaster.setToast({ message: 'You\'re being redirected...', type: 'info' })),
        catchError((err: Error) => {
          this.toaster.setToast({
            message: err.message || 'Unknown error during sign in',
            type: 'error',
          });
          return of(null);
        }),
      )
      .subscribe();
  }

  signOut() {
    from(_supabase.auth.signOut()).subscribe({
      next: (res) => {
        if (res.error) throw new Error(res.error.message);
        this.toaster.setToast({
          message: 'Signed out successfully',
          type: 'success',
        });
      },
      error: (err: Error) => {
        this.toaster.setToast({
          message: err.message || 'Failed lo Sign out. Please try again!',
          type: 'error',
        });
      },
    });
  }
}
