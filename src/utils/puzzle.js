import { stages } from '../data/stages.js';
import { caesarDecode } from './cipher.js';

const normalise = (value) => String(value ?? '').trim().toUpperCase().replace(/\s+/g, '');

export function checkAnswer(stage, answer) {
  return normalise(answer) === normalise(stage.answer);
}

export function extractEverySecondWord(text) {
  return String(text ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((_, index) => index % 2 === 1)
    .join(' ');
}

export function generateStageNinePassword(scannedText) {
  const number = scannedText.match(/NUMBER:\s*(\d+)/i)?.[1] ?? '';
  const cipher = scannedText.match(/Cipher:\s*([A-Z]+)/i)?.[1] ?? '';
  const word = caesarDecode(cipher, 3);
  return number && word ? `${word}-${number}` : '';
}

export function getFinalCode(tokens) {
  const ordered = stages.slice(0, 9).map((stage) => tokens?.[stage.id]).filter(Boolean);
  if (ordered.length < 9) {
    return '';
  }
  return `${ordered[0]}${ordered[1]}${ordered[2]}${ordered[3]}-${ordered[4]}-${ordered[5]}-${ordered[6]}${ordered[7]}${ordered[8]}`;
}
