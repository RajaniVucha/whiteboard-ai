import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [click, setClick] = useState(false);
  const handleClick = () => {
    setClick(!click);
  };
  return (
    <div className="header">
      <h1>{title}</h1>
      <nav>
        {" "}
        {/* Add a class name to the nav element */}
        <ul className="nav-menu active">
          <li>
            <Link to="/">Upload Image</Link>
          </li>
          <li>
            <Link to="/imageclass">Image Classification</Link>
          </li>
          <li>
            <Link to="/whiteboard">Whiteboard</Link>
          </li>
        </ul>
        <div className="hamburger" onClick={handleClick}>
          {click ? (
            <FaTimes size={20} style={{ color: "white" }} />
          ) : (
            <FaBars size={20} style={{ color: "white" }} />
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
