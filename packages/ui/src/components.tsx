import type { ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-indigo-500 hover:bg-indigo-400 text-white',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200'
  } satisfies Record<string, string>;
  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm'
  } satisfies Record<string, string>;

  return (
    <button
      className={clsx(
        'rounded font-medium shadow transition',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-lg bg-slate-900 text-slate-100 shadow-inner', className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        'rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400',
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLLabelElement>>) {
  return (
    <label className={clsx('text-xs font-medium uppercase tracking-wide text-slate-400', className)} {...props}>
      {children}
    </label>
  );
}
