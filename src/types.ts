export type Tool = 'brush' | 'eraser';

export interface Point {
  x: number;
  y: number;
}

export interface ColorSwatch {
  label: string;
  value: string;
}

export interface BrushPreset {
  label: string;
  size: number;
}
