'use client';

import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <h1 className="text-xl font-bold text-coral">
          Guilty Bite
        </h1>

        {!isLoading && user && (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-text-secondary sm:block">
              {user.user_metadata?.name || user.email?.split('@')[0]}
            </span>
            <button
              onClick={signOut}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-muted transition hover:bg-gray-100 hover:text-text-primary"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
