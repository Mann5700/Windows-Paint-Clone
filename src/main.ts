import { PaintApp } from './PaintApp';
import { buildToolbar } from './toolbar';
import './style.css';

const canvas = document.querySelector<HTMLCanvasElement>('#board');
const toolbar = document.querySelector<HTMLElement>('#toolbar');

if (!canvas || !toolbar) {
  throw new Error('Paint Clone failed to find its #board / #toolbar mount points.');
}

const paint = new PaintApp(canvas, { defaultColor: '#111111', defaultSize: 5 });
buildToolbar(toolbar, paint);
