import { setup3DCanvas, update3DText } from "./scene";

const canvasContainer = document.getElementById("canvasContainer")!;
setup3DCanvas(canvasContainer);

function textsChanged() {
  const text1element = document.getElementById("text-1") as HTMLInputElement;
  const text2element = document.getElementById("text-2") as HTMLInputElement;
  const text1 = text1element.value.toUpperCase();
  const text2 = text2element.value.toUpperCase();
  if (text1.length != text2.length) {
    console.log("length mismatch");
    return;
  }
  const pairs = [...text1].map((ch, i) => `${ch}${text2[i]}`);
  update3DText(pairs);
}

const inputElements = document.querySelectorAll(".input-text");
inputElements.forEach(e => {
  e.addEventListener("change", () => { textsChanged() })
});
