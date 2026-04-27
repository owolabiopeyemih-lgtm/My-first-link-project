import type { Theme } from "@prisma/client";

export interface ThemeStyles {
  page: React.CSSProperties;
  text: React.CSSProperties;
  button: React.CSSProperties;
  buttonText: React.CSSProperties;
  avatar: React.CSSProperties;
  preview: string; // CSS gradient string for theme picker swatch
  label: string;
}

const themes: Record<Theme, ThemeStyles & { id: Theme }> = {
  DEFAULT: {
    id: "DEFAULT",
    label: "Classic",
    preview: "linear-gradient(135deg, #f5f5f5, #e5e5e5)",
    page: { background: "#f9fafb" },
    text: { color: "#111827" },
    button: { background: "#ffffff", border: "1.5px solid #e5e7eb" },
    buttonText: { color: "#111827" },
    avatar: { background: "#e5e7eb", color: "#374151" },
  },
  DARK: {
    id: "DARK",
    label: "Dark",
    preview: "linear-gradient(135deg, #1f2937, #111827)",
    page: { background: "#111827" },
    text: { color: "#f9fafb" },
    button: { background: "#1f2937", border: "1.5px solid #374151" },
    buttonText: { color: "#f9fafb" },
    avatar: { background: "#374151", color: "#f9fafb" },
  },
  SUNSET: {
    id: "SUNSET",
    label: "Sunset",
    preview: "linear-gradient(135deg, #f97316, #ec4899)",
    page: { background: "linear-gradient(160deg, #fef3c7 0%, #fce7f3 100%)" },
    text: { color: "#7c2d12" },
    button: { background: "#f97316" },
    buttonText: { color: "#ffffff" },
    avatar: { background: "#fed7aa", color: "#7c2d12" },
  },
  FOREST: {
    id: "FOREST",
    label: "Forest",
    preview: "linear-gradient(135deg, #16a34a, #065f46)",
    page: { background: "linear-gradient(160deg, #f0fdf4 0%, #d1fae5 100%)" },
    text: { color: "#14532d" },
    button: { background: "#16a34a" },
    buttonText: { color: "#ffffff" },
    avatar: { background: "#bbf7d0", color: "#14532d" },
  },
  OCEAN: {
    id: "OCEAN",
    label: "Ocean",
    preview: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    page: { background: "linear-gradient(160deg, #eff6ff 0%, #e0e7ff 100%)" },
    text: { color: "#1e3a5f" },
    button: { background: "#0ea5e9" },
    buttonText: { color: "#ffffff" },
    avatar: { background: "#bae6fd", color: "#1e3a5f" },
  },
  DESERT: {
    id: "DESERT",
    label: "Desert",
    preview: "linear-gradient(135deg, #d97706, #92400e)",
    page: { background: "linear-gradient(160deg, #fffbeb 0%, #fef3c7 100%)" },
    text: { color: "#78350f" },
    button: { background: "#d97706" },
    buttonText: { color: "#ffffff" },
    avatar: { background: "#fde68a", color: "#78350f" },
  },
  NIGHT: {
    id: "NIGHT",
    label: "Night",
    preview: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    page: { background: "linear-gradient(160deg, #0f0c29, #302b63, #24243e)" },
    text: { color: "#e0e7ff" },
    button: { background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" },
    buttonText: { color: "#ffffff" },
    avatar: { background: "rgba(255,255,255,0.15)", color: "#e0e7ff" },
  },
  PASTEL: {
    id: "PASTEL",
    label: "Pastel",
    preview: "linear-gradient(135deg, #fbcfe8, #c7d2fe)",
    page: { background: "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)" },
    text: { color: "#581c87" },
    button: { background: "#f9a8d4" },
    buttonText: { color: "#581c87" },
    avatar: { background: "#fbcfe8", color: "#581c87" },
  },
  BOLD: {
    id: "BOLD",
    label: "Bold",
    preview: "linear-gradient(135deg, #dc2626, #000000)",
    page: { background: "#000000" },
    text: { color: "#ffffff" },
    button: { background: "#dc2626" },
    buttonText: { color: "#ffffff" },
    avatar: { background: "#1f1f1f", color: "#ffffff" },
  },
  MINIMAL: {
    id: "MINIMAL",
    label: "Minimal",
    preview: "linear-gradient(135deg, #ffffff, #f3f4f6)",
    page: { background: "#ffffff" },
    text: { color: "#374151" },
    button: { background: "#000000" },
    buttonText: { color: "#ffffff" },
    avatar: { background: "#f3f4f6", color: "#374151" },
  },
};

export function getThemeStyles(theme: Theme): ThemeStyles {
  return themes[theme] ?? themes.DEFAULT;
}

export const THEMES = Object.values(themes);
