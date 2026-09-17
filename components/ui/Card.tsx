import { HTMLAttributes } from "react";

export function Card({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl2 border border-moveo-border bg-moveo-card p-5 shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function ScreenShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-8 ${className}`}>
      {children}
    </main>
  );
}
