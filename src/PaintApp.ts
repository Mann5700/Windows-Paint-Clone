import type { Point, Tool } from './types';

export interface PaintOptions {
  background?: string;
  defaultColor?: string;
  defaultSize?: number;
}

/**
 * A tiny raster paint engine backed by a single `<canvas>`.
 *
 * Responsibilities:
 *  - track pointer input and draw smooth freehand strokes
 *  - switch colour, brush size and the eraser tool
 *  - clear the canvas and export the artwork as a PNG
 */
export class PaintApp {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly background: string;

  private drawing = false;
  private last: Point = { x: 0, y: 0 };
  private color: string;
  private size: number;
  private tool: Tool = 'brush';

  constructor(private readonly canvas: HTMLCanvasElement, options: PaintOptions = {}) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('2D canvas context is not available in this browser.');
    }
    this.ctx = ctx;
    this.background = options.background ?? '#ffffff';
    this.color = options.defaultColor ?? '#111111';
    this.size = options.defaultSize ?? 5;

    // Round caps/joins keep freehand lines smooth (Java used ANTIALIAS_ON).
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.clear();
    this.registerEvents();
  }

  private registerEvents(): void {
    this.canvas.addEventListener('pointerdown', this.handleDown);
    this.canvas.addEventListener('pointermove', this.handleMove);
    window.addEventListener('pointerup', this.handleUp);
    this.canvas.addEventListener('pointerleave', this.handleUp);
  }

  /** Convert a pointer event to canvas-space coordinates. */
  private position(event: PointerEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  private handleDown = (event: PointerEvent): void => {
    this.drawing = true;
    this.last = this.position(event);
    // A single click should leave a dot.
    this.stroke(this.last, this.last);
  };

  private handleMove = (event: PointerEvent): void => {
    if (!this.drawing) return;
    const point = this.position(event);
    this.stroke(this.last, point);
    this.last = point;
  };

  private handleUp = (): void => {
    this.drawing = false;
  };

  /** Draw one line segment from `from` to `to` using the active tool. */
  private stroke(from: Point, to: Point): void {
    this.ctx.strokeStyle = this.tool === 'eraser' ? this.background : this.color;
    this.ctx.lineWidth = this.size;
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
  }

  setColor(color: string): void {
    this.color = color;
    this.tool = 'brush';
  }

  setBrushSize(size: number): void {
    this.size = size;
  }

  useEraser(): void {
    this.tool = 'eraser';
  }

  /** Repaint the whole canvas with the background colour. */
  clear(): void {
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** Export the current canvas as a downloadable PNG file. */
  save(fileName = 'image.png'): void {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }

  get currentTool(): Tool {
    return this.tool;
  }
}
