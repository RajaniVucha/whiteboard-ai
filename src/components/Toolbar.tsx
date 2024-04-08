import React from "react";

interface ToolbarProps {
  onColorChange: (color: string) => void;
  onBrushSizeChange: (brushSize: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onColorChange,
  onBrushSizeChange,
}) => {
  const colors = ["black", "red", "blue", "green", "yellow"]; // Add more colors as needed

  const handleColorChange = (color: string) => {
    onColorChange(color);
  };

  const handleBrushSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brushSize = parseInt(e.target.value);
    onBrushSizeChange(brushSize);
  };

  return (
    <div className="toolbar">
      <div>
        <label htmlFor="color-select">Color:</label>
        <select
          id="color-select"
          onChange={(e) => handleColorChange(e.target.value)}>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="brush-size-select">Brush Size:</label>
        <select id="brush-size-select" onChange={handleBrushSizeChange}>
          <option value={1}>1</option>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={7}>7</option>
          <option value={9}>9</option>
        </select>
      </div>
    </div>
  );
};

export default Toolbar;
