"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const base = `/petani/${params.panenId}`;

  const routes = [
    { href: base, label: "Home", active: pathname === base },
    {
      href: `${base}/dashboard`,
      label: "Dashboard",
      active: pathname.startsWith(`${base}/dashboard`),
    },
    {
      href: `${base}/lahan`,
      label: "Lahan",
      active: pathname.startsWith(`${base}/lahan`),
    },
    {
      href: `${base}/planner`,
      label: "Planner",
      active: pathname.startsWith(`${base}/planner`),
    },
    {
      href: `${base}/panen`,
      label: "Panen",
      active: pathname.startsWith(`${base}/panen`),
    },
    {
      href: `${base}/settings`,
      label: "Settings",
      active: pathname.startsWith(`${base}/settings`),
    },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium text-white underline-offset-4 transition-all hover:text-white hover:underline active:underline",
              route.active && "underline",
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden p-2 -ml-2 text-white"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <nav className="md:hidden absolute left-0 top-full mt-3 z-50 w-56 rounded-xl bg-[#52613A] p-2 shadow-lg ring-1 ring-white/10">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-medium text-white underline-offset-4 transition-all hover:text-white hover:underline active:underline",
                route.active && "underline",
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
