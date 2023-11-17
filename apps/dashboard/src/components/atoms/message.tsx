import { tv, VariantProps } from "tailwind-variants";

const message = tv({
  base: "p-2 rounded border",
  variants: {
    variant: {
      success: "bg-green-50 border-green-200 text-green-600",
      warning: "bg-red-50 border-red-200 text-red-400",
    },
  },
  defaultVariants: {
    variant: "success",
  },
});

export type Props = VariantProps<typeof message> & {
  children: string | string[];
};

export function Message(props: Props) {
  return (
    <div className={message({ variant: props.variant })}>
      <p className="text-sm">{props.children}</p>
    </div>
  );
}
