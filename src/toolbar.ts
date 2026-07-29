import type { PaintApp } from './PaintApp';
import type { BrushPreset, ColorSwatch } from './types';

const COLORS: ColorSwatch[] = [
  { label: 'Red', value: '#e53935' },
  { label: 'Green', value: '#43a047' },
  { label: 'Blue', value: '#1e88e5' },
  { label: 'Black', value: '#111111' },
];

const BRUSHES: BrushPreset[] = [
  { label: 'Small', size: 1 },
  { label: 'Medium', size: 5 },
  { label: 'Large', size: 12 },
];

function button(label: string, onClick: () => void, className = 'tool'): HTMLButtonElement {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = className;
  el.textContent = label;
  el.addEventListener('click', onClick);
  return el;
}

/** Populate the toolbar element with colour, brush and action controls. */
export function buildToolbar(container: HTMLElement, paint: PaintApp): void {
  COLORS.forEach((color) => {
    const swatch = button(color.label, () => paint.setColor(color.value), 'tool tool--color');
    swatch.style.setProperty('--swatch', color.value);
    container.append(swatch);
  });

  container.append(button('Eraser', () => paint.useEraser()));

  BRUSHES.forEach((brush) => {
    container.append(button(brush.label, () => paint.setBrushSize(brush.size)));
  });

  container.append(button('Clear', () => paint.clear()));
  container.append(button('Save', () => paint.save(), 'tool tool--primary'));
}
