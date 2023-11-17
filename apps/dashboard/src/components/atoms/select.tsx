'use client';

import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { ComponentProps, HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export type RootProps =
  & ComponentProps<typeof Select.Root>
  & { children: ReactNode; className: HTMLDivElement['className'] };

export function Root (props: RootProps) {
  const { className, ...otherProps } = props;
  return (
    <div className={twMerge('grid gap-1', className)}>
      <Select.Root
        {...otherProps}
      />
    </div>
  );
}

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label (props: LabelProps) {
  return (
    <label
      {...props}
      className={twMerge('text-sm text-zinc-700', props.className)}
    />
  );
}

export type ItemProps = ComponentProps<typeof Select.Item>;

export function Item (props: ItemProps) {
  const { children, ...otherProps } = props;
  return (
    <Select.Item
      className='flex items-center gap-2 px-3 py-2.5 data-[highlighted]:bg-zinc-100 data-[highlighted]:outline-none cursor-pointer data-[disabled]:opacity-60'
      {...otherProps}
    >
      {children}
      <Select.ItemIndicator className='ml-auto'>
        <Check className='h-4 w-4 text-violet-500' />
      </Select.ItemIndicator>
    </Select.Item>
  );
}

export type SeparatorProps = ComponentProps<typeof Select.Separator>;

export function Separator (props: SeparatorProps) {
  return <Select.Separator {...props} />;
}

export type TriggerProps = ComponentProps<typeof Select.Trigger>;

export function Trigger (props: TriggerProps) {
  const { children, ...otherProps } = props;
  return (
    <Select.Trigger
      {...otherProps}
      className={twMerge(
        'flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm outline-none data-[placeholder]:text-zinc-600 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:opacity-60',
        otherProps.className,
      )}
    >
      {children}
      <Select.Icon>
        <ChevronDown className='h-5 w-5 text-zinc-500' />
      </Select.Icon>
    </Select.Trigger>
  );
}

export type ContentProps = ComponentProps<typeof Select.Content>;

export function Content (props: ContentProps) {
  const { children, ...otherProps } = props;
  return (
    <Select.Portal>
      <Select.Content
        {...otherProps}
        sideOffset={0}
        side='bottom'
        position='popper'
        className='group z-10 w-[var(--radix-select-trigger-width)] animate-slideUpAndFade overflow-hidden rounded-lg border border-zinc-200 bg-white will-change-[opacity,transform] shadow-lg'
      >
        <ScrollArea.Root className='h-full w-full' type='auto'>
          <Select.Viewport className='max-h-[300px]' asChild>
            <ScrollArea.Viewport className='h-full w-full overflow-y-scroll'>
              {children}
            </ScrollArea.Viewport>
          </Select.Viewport>
          <ScrollArea.Scrollbar
            className='invisible flex w-2.5 touch-none select-none bg-zinc-100 p-0.5 group-hover:visible'
            orientation='vertical'
          >
            <ScrollArea.Thumb className="relative flex-1 rounded-lg bg-zinc-300 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Select.Content>
    </Select.Portal>
  );
}

export type ItemPrefixProps = {
  children: ReactNode;
};

export function ItemPrefix (props: ItemPrefixProps) {
  return <div>{props.children}</div>;
}

export type ItemTextProps = ComponentProps<typeof Select.ItemText> & {
  children: ReactNode;
};

export function ItemText (props: ItemTextProps) {
  return (
    <Select.ItemText asChild>
      <span className='flex items-center gap-2 text-left leading-5 text-black'>
        {props.children}
      </span>
    </Select.ItemText>
  );
}

export type ValueProps = ComponentProps<typeof Select.Value>;

export function Value (props: ValueProps) {
  const { children, ...otherProps } = props;
  if (!children) {
    return <Select.Value {...otherProps} />;
  }
  return (
    <Select.Value {...otherProps}>
      <span className='flex items-center gap-2 text-black'>
        {children}
      </span>
    </Select.Value>
  );
}

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
