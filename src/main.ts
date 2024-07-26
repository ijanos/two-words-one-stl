import { setup3DCanvas, update3DText, exportSTL } from "./scene";

const canvasContainer = document.getElementById("canvasContainer")!;
setup3DCanvas(canvasContainer);

const text1element = document.getElementById("text-1") as HTMLInputElement;
const text2element = document.getElementById("text-2") as HTMLInputElement;
const baseToggle = document.getElementById("base-toggle") as HTMLInputElement;
const errorBox = document.getElementById("errorBox") as HTMLDivElement;

function textsChanged() {
  const text1 = text1element.value.toUpperCase();
  const text2 = text2element.value.toUpperCase();
  if (text1.length != text2.length) {
    console.log("length mismatch");
    errorBox.style.display = "block";
    return;
  } else {
    errorBox.style.display = "none";
  }
  const pairs = [...text2].map((ch, i) => `${ch}${text1[i]}`);
  update3DText(pairs, baseToggle.checked);
}

textsChanged();

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

baseToggle.addEventListener("change", () => {
  textsChanged()
})
