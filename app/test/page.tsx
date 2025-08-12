"use client";
import DraggableObserver from "../components/globals/DraggableObserver/DraggableObserver";
import { portfolioData } from "../utils/data";
export default function TestPage() {
  return <DraggableObserver data={portfolioData} entriesFrom={4} />;
}
