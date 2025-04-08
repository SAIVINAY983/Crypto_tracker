
import React from 'react';

const Header = () => {
  return (
    <header className="py-6 bg-card border-b border-border">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">C</span>
          </div>
          <h1 className="text-2xl font-bold">CryptoPal Oracle</h1>
        </div>
        <nav>
          <ul className="flex gap-6">
            <li>
              <a href="#dashboard" className="hover:text-primary transition-colors">Dashboard</a>
            </li>
            <li>
              <a href="#portfolio" className="hover:text-primary transition-colors">Portfolio</a>
            </li>
            <li>
              <a href="#converter" className="hover:text-primary transition-colors">Converter</a>
            </li>
            <li>
              <a href="#news" className="hover:text-primary transition-colors">News</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
