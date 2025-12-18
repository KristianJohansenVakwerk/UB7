import * as THREE from "three";

export const colorArrayEn: THREE.Color[] = [
  new THREE.Color(0.851, 0.851, 0.851), // #D9D9D9 - grey (top, position 1.0)
  new THREE.Color(0.996, 1.0, 0.761), // #FEFFC2 - yellow
  new THREE.Color(0.4941, 0.9804, 0.3137), // #7EFA50 - lime green
  new THREE.Color(0.0157, 0.4627, 0.2314), // #04763B - dark green (bottom, position 0.0)
];

export const colorArrayEnSVG: THREE.Color[] = [
  new THREE.Color(0.851, 0.851, 0.851), // #D9D9D9 - grey (position 0.0, initial)
  new THREE.Color(0.996, 1.0, 0.761), // #FEFFC2 - yellow
  new THREE.Color(0.4941, 0.9804, 0.3137), // #7EFA50 - lime green
  new THREE.Color(0.0157, 0.4627, 0.2314), // #04763B - dark green (position 1.0)
];

export const colorArrayPt: THREE.Color[] = [
  new THREE.Color(0.851, 0.851, 0.851), // #D9D9D9
  new THREE.Color(0.1216, 0.3804, 0.2745), // #1F6146 in linear
  new THREE.Color(0.0196, 0.1961, 0.1294), // #053321 in linear
  new THREE.Color(0.0039, 0.0157, 0.0118), // #010403 in linear
];

export const colorArrayPtSVG: THREE.Color[] = [
  // new THREE.Color(0.3843, 0.3922, 0.3882), // #626463 - grey/lightest (bottom when inverted)
  new THREE.Color(0.851, 0.851, 0.851), // #D9D9D9
  new THREE.Color(0.1216, 0.3804, 0.2745), // #1F6146 in linear - medium
  new THREE.Color(0.0196, 0.1961, 0.1294), // #053321 in linear - darker
  new THREE.Color(0.0196, 0.1961, 0.1294), // #053321 in linear - darker
];

export const posEnArray: number[] = [0.01, 0.538462, 0.7, 1.0];
export const posPtArray: number[] = [0.1, 0.538462, 0.817308, 1.0];
export const posEnArraySVG: number[] = [0.1875, 0.639423, 0.817308, 1.0];
export const posPtArraySVG: number[] = [0.1875, 0.639423, 0.99, 1.0];

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
  valueEn: colorArrayEnSVG[i],
  valuePt: colorArrayPtSVG[i],
  pos: `pos${i}`,
  valuePosEn: posEnArraySVG[i],
  valuePosPt: posPtArraySVG[i],
}));
