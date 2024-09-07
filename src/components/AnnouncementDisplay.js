import React from "react";
import "react-quill/dist/quill.snow.css"; // Import styles
const AnnouncementDisplay = ({ content }) => {
  return (
    <div
      className="w-92 px-5 max-h-full break-words whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default AnnouncementDisplay;
