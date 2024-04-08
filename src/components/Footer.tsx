import React from "react";

interface HeaderProps {
  title: string;
}
const Footer: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="footer">
      <p>&copy; 2022 Your App Name. All rights reserved.</p>
    </div>
  );
};

export default Footer;
