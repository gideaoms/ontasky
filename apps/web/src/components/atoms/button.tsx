import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
import { tv, VariantProps } from "tailwind-variants";

export const button = tv({
  base: "group rounded-lg px-4 py-2 text-sm font-semibold outline-none shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50 inline-block relative",
  variants: {
    variant: {
      ghost: "rounded-md px-2 hover:bg-zinc-50 shadow-none",
      primary: "bg-violet-600 text-white hover:bg-violet-700",
      outline: "border border-zinc-300 text-zinc-700 hover:bg-zinc-50",
      error: "bg-rose-500 text-white hover:bg-rose-400",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & { isLoading?: boolean };

export function Button(props: Props) {
  return (
    <button
      {...props}
      className={button({
        variant: props.variant,
        className: props.className,
      })}
      disabled={props.isLoading || props.disabled}
      data-isLoading={props.isLoading}
    >
      <div className="group-data-[isLoading=true]:opacity-0">
        {props.children}
      </div>
      {props.isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </button>
  );
}
