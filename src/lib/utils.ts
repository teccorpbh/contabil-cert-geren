import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseCurrencyToNumber(input: string | number | null | undefined): number {
  if (typeof input === 'number') return Number.isFinite(input) ? input : 0;
  if (input == null) return 0;
  
  let s = String(input).trim();
  
  // Remover símbolo de moeda e espaços
  s = s.replace(/[R$\s]/g, '');
  
  // Tratar separadores brasileiros
  if (s.includes(',') && s.includes('.')) {
    // Formato: 1.234,56 -> remover pontos de milhar e trocar vírgula por ponto
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',')) {
    // Formato: 1234,56 -> trocar vírgula por ponto
    s = s.replace(',', '.');
  }
  
  // Remover quaisquer caracteres restantes que não sejam dígitos, ponto ou sinal
  s = s.replace(/[^0-9.-]/g, '');
  
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}
