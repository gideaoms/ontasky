import * as Primitives from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import { ComponentProps, useId } from 'react';

export function Checkbox (props: ComponentProps<typeof Primitives.Root> & { label: string }) {
  const id = useId();
  return (
    <div className='flex items-center gap-2'>
      <Primitives.Root
        {...props}
        className='w-6 h-6 border rounded flex justify-center items-center'
        id={id}
      >
        <Primitives.Indicator className='text-violet-600'>
          <CheckIcon />
        </Primitives.Indicator>
      </Primitives.Root>
      <label className='cursor-pointer' htmlFor={id}>
        {props.label}
      </label>
    </div>
  );
}
