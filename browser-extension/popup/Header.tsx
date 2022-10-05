import React from "react";

interface HeaderProps {
  hostUrl: string | null,
}

const Header = ({
  hostUrl,
}: HeaderProps) => {
  return <header className="app-header">
    <a
      href={hostUrl || ""}
      target="_blank"
      rel="noreferrer"
    >
      <img
        alt="NENO Logo"
        src="/assets/images/logo-circle.svg"
        width="40"
        height="40"
      />
    </a>
  </header>;
};

export default Header;
