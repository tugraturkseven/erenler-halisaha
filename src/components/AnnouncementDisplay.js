import React from "react";
import "react-quill/dist/quill.snow.css"; // Import styles
const AnnouncementDisplay = ({ content }) => {
  return (
    <div
      className="max-w-full max-h-full break-words"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default AnnouncementDisplay;
