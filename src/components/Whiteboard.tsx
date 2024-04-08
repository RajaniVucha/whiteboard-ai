import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

interface WhiteboardProps {
  sessionID: string; // Unique ID for the session
  selectedColor: string;
  brushSize: number;
}

const Whiteboard: React.FC<WhiteboardProps> = ({
  sessionID,
  selectedColor,
  brushSize,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [undoList, setUndoList] = useState<{ action: string; data: any }[]>([]);
  const [redoList, setRedoList] = useState<{ action: string; data: any }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleDrawingStart = (e: MouseEvent) => {
      setDrawing(true);
      const { offsetX, offsetY } = e;
      setLastPosition({ x: offsetX, y: offsetY });
    };

    const handleDrawingMove = (e: MouseEvent) => {
      if (!drawing) return;
      if (!lastPosition) return;

      const { offsetX, offsetY } = e;
      const { x, y } = lastPosition;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(offsetX, offsetY);
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
      ctx.stroke();

      setLastPosition({ x: offsetX, y: offsetY });
    };

    const handleDrawingEnd = () => {
      setDrawing(false);
      setUndoList([
        ...undoList,
        {
          action: "draw",
          data: ctx.getImageData(0, 0, canvas.width, canvas.height),
        },
      ]);
      setRedoList([]); // Clear redo list after drawing
    };

    canvas.addEventListener("mousedown", handleDrawingStart);
    canvas.addEventListener("mousemove", handleDrawingMove);
    canvas.addEventListener("mouseup", handleDrawingEnd);
    canvas.addEventListener("mouseout", handleDrawingEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleDrawingStart);
      canvas.removeEventListener("mousemove", handleDrawingMove);
      canvas.removeEventListener("mouseup", handleDrawingEnd);
      canvas.removeEventListener("mouseout", handleDrawingEnd);
    };
  }, [drawing, lastPosition, selectedColor, brushSize, undoList, redoList]);

  const undoAction = () => {
    if (undoList.length === 0) return;

    const lastAction = undoList.pop();
    if (lastAction) {
      setRedoList([...redoList, lastAction]);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (lastAction.action === "draw") {
        ctx.putImageData(lastAction.data, 0, 0);
      }
    }
  };

  const redoAction = () => {
    if (redoList.length === 0) return;

    const nextAction = redoList.pop();
    if (nextAction) {
      setUndoList([...undoList, nextAction]);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (nextAction.action === "draw") {
        ctx.putImageData(nextAction.data, 0, 0);
      }
    }
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setUndoList([]);
    setRedoList([]);
  };

  const saveAsImage = () => {
    if (!whiteboardRef.current) return;
    domtoimage.toBlob(whiteboardRef.current).then((blob: Blob) => {
      saveAs(blob, "whiteboard.png");
    });
  };

  const saveAsPdf = () => {
    if (!whiteboardRef.current) return;
    domtoimage.toPng(whiteboardRef.current).then((dataUrl: string) => {
      const pdf = new jsPDF();
      pdf.addImage(dataUrl, "PNG", 10, 10, 500, 100);
      pdf.save("whiteboard.pdf");
    });
  };

  return (
    <div className="whiteboard" ref={whiteboardRef}>
      <canvas ref={canvasRef} width={800} height={600}></canvas>

      <button onClick={undoAction}>Undo</button>
      <button onClick={redoAction}>Redo</button>
      <button onClick={clearWhiteboard}>Clear</button>
      <button onClick={saveAsImage}>Save as Image</button>
      <button onClick={saveAsPdf}>Save as PDF</button>
    </div>
  );
};

export default Whiteboard;
