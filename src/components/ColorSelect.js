import React, { useState } from "react";

const ColorSelectBox = ({ color, onColorChange }) => {
  const [bgColor, setBgColor] = useState("white");

  const colors = [
    { name: "Kırmızı", value: "!bg-red-500" },
    { name: "Yeşil", value: "!bg-green-500" },
    { name: "Mavi", value: "!bg-blue-500" },
    { name: "Sarı", value: "!bg-yellow-500" },
    { name: "Mor", value: "!bg-purple-500" },
    { name: "Turuncu", value: "!bg-orange-500" },
    { name: "Pembe", value: "!bg-pink-500" },
    { name: "Kahverengi", value: "!bg-brown-500" },
    { name: "Gri", value: "!bg-gray-500" },
    { name: "Turkuaz", value: "!bg-teal-500" },
    { name: "Lacivert", value: "!bg-indigo-500" },
    { name: "Beyaz", value: "!bg-white" },
    { name: "Siyah", value: "!bg-black" },
  ];

  const handleColorChange = (event) => {
    const selectedColor = event.target.value;
    setBgColor(selectedColor);
    onColorChange(selectedColor); // Pass the selected color to the parent component
  };

  return (
    <div className={`${color}`}>
      <select
        id="color-select"
        onChange={handleColorChange}
        className="px-4 py-2 rounded border border-gray-300 bg-white text-black"
      >
        {colors.map((color) => (
          <option key={color.value} value={color.value}>
            {color.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ColorSelectBox;
