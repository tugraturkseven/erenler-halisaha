import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles

const AnnouncementEditor = ({ onChange }) => {
  const [value, setValue] = useState("");

  const handleChange = (content) => {
    setValue(content);
    onChange(content); // Pass content to parent component or save it
  };

  return (
    <ReactQuill
      value={value}
      onChange={handleChange}
      modules={AnnouncementEditor.modules}
      formats={AnnouncementEditor.formats}
      className="bg-white text-black"
    />
  );
};

// Configure available modules and formats
AnnouncementEditor.modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ size: [] }, { color: [] }, { background: [] }], // Add color and background color options
    ["clean"], // Remove formatting button
  ],
};

AnnouncementEditor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "color",
  "background",
];

export default AnnouncementEditor;
