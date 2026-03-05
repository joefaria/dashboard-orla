import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("pt-BR");
}

export function formatCurrency(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatPercent(n: number): string {
  return n.toFixed(1) + "%";
}

export function getDelta(current: number, previous: number): { value: number; isPositive: boolean } {
  const delta = ((current - previous) / previous) * 100;
  return { value: Math.abs(delta), isPositive: delta >= 0 };
}
