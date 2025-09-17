import * as THREE from "three";

export const colorArrayEn: THREE.Color[] = [
  new THREE.Color(0.0157, 0.4627, 0.2314),
  new THREE.Color(0.4941, 0.9804, 0.3137),
  new THREE.Color(0.996, 1.0, 0.761),
  new THREE.Color(0.851, 0.851, 0.851),
];

export const colorArrayPt: THREE.Color[] = [
  new THREE.Color("#09603D"), // #000000
  new THREE.Color("#09603D"), // #09603D
  new THREE.Color("#646464"), // #646464
  // new THREE.Color("#A7A7A7"), // #A7A7A7
  new THREE.Color(0.851, 0.851, 0.851), // #D9D9D9
];

export const colorArrayPtSVG: THREE.Color[] = [
  // new THREE.Color("#A7A7A7"), // #A7A7A7
  new THREE.Color(0.851, 0.851, 0.851), // #D9D9D9
  new THREE.Color("#646464"), // #646464
  new THREE.Color("#09603D"), // #09603D
  new THREE.Color("#09603D"), // #000000
];

export const posEnArray: number[] = [0.1, 0.538462, 0.817308, 1.0];
export const posPtArray: number[] = [0.01, 0.2, 0.6, 1.0];
export const posPtArraySVG: number[] = [0.0, 0.2, 0.4, 1.0];

export const posArray: { name: string; valueEn: number; valuePt: number }[] =
  Array.from({ length: 4 }, (_, i) => ({
    name: `pos${i}`,
    valueEn: posEnArray[i],
    valuePt: posPtArray[i],
  }));

export const colorArray = Array.from({ length: 4 }, (_, i) => ({
  name: `color${i}`,
  valueEn: colorArrayEn[i],
  valuePt: colorArrayPt[i],
}));

export const settingsArraySVG = Array.from({ length: 4 }, (_, i) => ({
  color: `color${i}`,
  valueEn: colorArrayEn[i],
  valuePt: colorArrayPtSVG[i],
  pos: `pos${i}`,
  valuePosEn: posEnArray[i],
  valuePosPt: posPtArraySVG[i],
}));
