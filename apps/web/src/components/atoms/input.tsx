import { Slot } from '@radix-ui/react-slot';
import { forwardRef, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export type RootProps = HTMLAttributes<HTMLDivElement>;

export function Root (props: RootProps) {
  return (
    <div
      {...props}
      className={twMerge('grid gap-1', props.className)}
    />
  );
}

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label (props: LabelProps) {
  return (
    <label
      {...props}
      className={twMerge('text-sm text-zinc-700 inline-block', props.className)}
    />
  );
}

export type ControlProps = InputHTMLAttributes<HTMLInputElement> & {
  asChild?: boolean;
};

export const Control = forwardRef<HTMLInputElement, ControlProps>(
  function Control (props, ref) {
    const { asChild, ...otherProps } = props;
    const Input = asChild ? Slot : 'input';
    return (
      <div className='flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm outline-none focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100'>
        <Input
          {...otherProps}
          ref={ref}
          className={twMerge(
            'flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-0 disabled:text-zinc-500',
            otherProps.className,
          )}
        />
      </div>
    );
  },
);

export type MessageProps = HTMLAttributes<HTMLParagraphElement>;

export function Message (props: MessageProps) {
  if (!props.children) {
    return null;
  }
  return (
    <p
      {...props}
      className={twMerge(
        'text-red-400 text-xs',
        props.className,
      )}
    />
  );
}
