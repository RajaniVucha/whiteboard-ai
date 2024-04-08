import React from "react";

interface HeaderProps {
  title: string;
}
const UploadImage: React.FC<HeaderProps> = ({ title }) => {
  return <h1>Upload Image</h1>;
};

export default UploadImage;
