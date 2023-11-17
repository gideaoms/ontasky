"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElementType } from "react";

export function NavItem(props: {
  href: string;
  title: string;
  subTitle?: string;
  icon: ElementType;
}) {
  const Icon = props.icon;
  const pathname = usePathname();
  const [href] = props.href.split("?");
  return (
    <Link
      href={props.href}
      data-active={pathname === href}
      className="group flex items-center gap-3 rounded px-3 py-2 outline-none hover:bg-violet-50 focus-visible:ring-2 focus-visible:ring-violet-500 data-[active=true]:bg-violet-100"
    >
      <Icon className="h-5 w-5 flex-shrink-0 text-zinc-500" />
      <span className="font-medium text-zinc-700 group-hover:text-violet-500">
        {props.title}
        {props.subTitle && (
          <span className="ml-2 text-xs font-normal">{props.subTitle}</span>
        )}
      </span>
    </Link>
  );
}
