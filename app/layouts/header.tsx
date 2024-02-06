import React from "react";
import Container from "../components/Container";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";

const MENU_CLASS = `
px-3 
py-1.5 
  p-3 
  hover:bg-primary
`
const MENU_CLASS_ACTIVE = `
  
`

const Header = () => {


  return (
    <div className="bg-header">
      <Container className="flex justify-between">
        {/* brand and menu */}
        <div className="flex items-center gap-6">
          <h1 className="text-2xl">
            <Link href="/">Sprimio</Link>
          </h1>
          <div className="flex items-center gap-1.5">
            <Link href="/movies">Movies</Link>
            <Link href="/tv">TV</Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
