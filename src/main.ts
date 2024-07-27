import { setup3DCanvas, update3DText, exportSTL } from "./scene";

const canvasContainer = document.getElementById("canvasContainer") as HTMLDivElement;
const loading = document.getElementById("loading") as HTMLDivElement;

setup3DCanvas(canvasContainer, loading);

const text1element = document.getElementById("text-1") as HTMLInputElement;
const text2element = document.getElementById("text-2") as HTMLInputElement;
const baseToggle = document.getElementById("base-toggle") as HTMLInputElement;
const errorBox = document.getElementById("errorBox") as HTMLDivElement;
const exportButton = document.getElementById("export") as HTMLButtonElement;
const letterSpacing = document.getElementById("letter-spacing") as HTMLInputElement;
const fontSelector = document.getElementById("font-selector") as HTMLSelectElement;

const notAlphanumCharsRE = /[^a-zA-Z\d]/g;

function normalizeInput(input: HTMLInputElement) {
  const text = input.value;
  const normalized = text.replace(notAlphanumCharsRE, "").toUpperCase();
  input.value = normalized;
  return normalized;
}

function textsChanged() {
  const text1 = normalizeInput(text1element);
  const text2 = normalizeInput(text2element);

  if (text1.length != text2.length) {
    errorBox.style.display = "block";
    return;
  }
  errorBox.style.display = "none";

  const pairs = [...text2].map((ch, i) => `${ ch }${ text1[i] }`);
  update3DText(pairs, baseToggle.checked, parseFloat(letterSpacing.value), fontSelector.value);
}


document.querySelectorAll(".input-text").forEach(e => {
  e.addEventListener("change", textsChanged)
});

exportButton.addEventListener("click", () => {
  const text1 = text1element.value;
  const text2 = text2element.value;
  exportSTL(`${ text1 }-${ text2 }.stl`);
});

baseToggle.addEventListener("change", textsChanged);
letterSpacing.addEventListener("change", textsChanged);
fontSelector.addEventListener("change", textsChanged);

textsChanged();
