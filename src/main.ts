import { setup3DCanvas, update3DText, exportSTL } from "./scene";

const canvasContainer = document.getElementById("canvasContainer")!;
setup3DCanvas(canvasContainer);

const text1element = document.getElementById("text-1") as HTMLInputElement;
const text2element = document.getElementById("text-2") as HTMLInputElement;

function textsChanged() {
  const text1 = text1element.value.toUpperCase();
  const text2 = text2element.value.toUpperCase();
  if (text1.length != text2.length) {
    console.log("length mismatch");
    return;
  }
  const pairs = [...text2].map((ch, i) => `${ch}${text1[i]}`);
  update3DText(pairs);
}

const inputElements = document.querySelectorAll(".input-text");
inputElements.forEach(e => {
  e.addEventListener("change", textsChanged)
});

const exportButton = document.getElementById("export") as HTMLButtonElement;
exportButton.addEventListener("click", () => {
  const text1 = text1element.value.toUpperCase();
  const text2 = text2element.value.toUpperCase();
  exportSTL(`${text1}-${text2}.stl`);
});

const baseToggle = document.getElementById("base-toggle") as HTMLInputElement;
baseToggle.addEventListener("change", () => {
  console.log("TODO", baseToggle.checked);
})
