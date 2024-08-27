import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles

var Size = Quill.import("formats/size");
Size.whitelist = [
  "12",
  "16",
  "24",
  "28",
  "32",
  "40",
  "48",
  "56",
  "64",
  "72",
  "80",
  "96",
  "128",
];
Quill.register(Size, true);

const CustomToolbar = () => (
  <div id="toolbar" className="bg-white ">
    <button className="ql-bold" />
    <button className="ql-underline" />
    <select className="ql-size">
      {Size.whitelist.map((size, index) => (
        <option value={size} selected={size.includes("16")}>
          {size}
        </option>
      ))}
    </select>
    <button className="ql-align" value="" />
    <button className="ql-align" value="center" />
    <button className="ql-align" value="right" />
    <select className="ql-color" />
    <select className="ql-background" />
  </div>
);

const AnnouncementEditor = ({ onChange, content }) => {
  const [value, setValue] = useState(content);

  const handleChange = (content) => {
    setValue(content);
    onChange(content); // Pass content to parent component or save it
  };

  return (
    <div className="!h-full">
      <CustomToolbar />
      <ReactQuill
        value={value}
        onChange={handleChange}
        modules={AnnouncementEditor.modules}
        formats={AnnouncementEditor.formats}
        className="bg-white text-black"
      />
    </div>
  );
};

// Configure available modules and formats
AnnouncementEditor.modules = {
  toolbar: `#toolbar`,
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
