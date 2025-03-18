"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { FaGithub } from "react-icons/fa";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { IdeaPulseLogo } from "~~/components/assets/IdeaPulseLogo";
import { PrivyLogin } from "~~/components/PrivyLogin";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { usePrivy } from "@privy-io/react-auth";
import { WalletBalanceDropdown } from "~~/components/WalletBalanceDropdown";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const getMenuLinks = (isAuthenticated: boolean): HeaderMenuLink[] => {
  const baseLinks = [
    {
      label: "Home",
      href: "/",
      icon: <span className="material-icons text-sm flex items-center">home</span>,
    },
    {
      label: "Projects",
      href: "/projects",
      icon: <span className="material-icons text-sm flex items-center">apps</span>,
    },
    {
      label: "About",
      href: "/about",
      icon: <span className="material-icons text-sm flex items-center">help_outline</span>,
    },
  ];

  if (isAuthenticated) {
    // Insert Dashboard link after Projects
    baseLinks.splice(2, 0, {
      label: "Dashboard",
      href: "/dashboard",
      icon: <span className="material-icons text-sm flex items-center">dashboard</span>,
    });
  }

  return baseLinks;
};

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const { authenticated } = usePrivy();
  const menuLinks = getMenuLinks(authenticated);

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive 
                  ? "font-medium bg-primary/20 text-primary dark:bg-primary/30 dark:text-white" 
                  : "dark:text-gray-200"
              } hover:bg-primary/10 dark:hover:bg-primary/20 hover:shadow-md focus:!bg-primary/20 active:!text-neutral py-2 px-5 text-sm rounded-md flex items-center gap-2 transition-all duration-200`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  // Remove unused variable or if you need the hook for some reason, keep the hook but not the variable
  const {
    /* targetNetwork */
  } = useTargetNetwork();
  const { authenticated } = usePrivy();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "shadow-lg backdrop-blur-lg" : ""
      } bg-indigo-100/90 dark:bg-gray-900/90`}
    >
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex justify-between items-center py-3">
          <div className="flex gap-2 sm:gap-4 items-center">
            <div className="dropdown" ref={burgerMenuRef}>
              <label
                tabIndex={0}
                className={`btn btn-ghost btn-sm sm:btn-md btn-circle ${isDrawerOpen ? "hover:bg-primary/20" : "hover:bg-transparent"} lg:hidden dark:text-gray-200`}
                onClick={() => {
                  setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
                }}
              >
                <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </label>
              {isDrawerOpen && (
                <ul
                  tabIndex={0}
                  className="p-2 sm:p-4 mt-3 w-52 sm:w-60 shadow-lg backdrop-blur-lg menu menu-compact dropdown-content bg-indigo-100/90 dark:bg-gray-800/95 rounded-box z-[100] dark:text-gray-200"
                  onClick={() => {
                    setIsDrawerOpen(false);
                  }}
                >
                  <HeaderMenuLinks />
                  <li className="mt-2 p-2">
                    <div className="flex items-center gap-2">
                      <SwitchTheme className="pointer-events-auto" />
                      <span className="text-sm font-medium">Switch Theme</span>
                    </div>
                  </li>
                </ul>
              )}
            </div>
            <Link href="/" passHref className="flex gap-2 sm:gap-3 items-center group shrink-0">
              <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <IdeaPulseLogo className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-bold tracking-wide leading-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  IdeaPulse
                </span>
                <span className="text-[8px] sm:text-xs tracking-widest opacity-75 dark:text-gray-300">INNOVATION HUB</span>
              </div>
            </Link>
            <ul className="hidden gap-1 items-center ml-6 lg:flex dark:text-gray-200">
              <HeaderMenuLinks />
            </ul>
          </div>
          <div className="flex gap-3 items-center">
            {authenticated && <WalletBalanceDropdown />}
            <PrivyLogin />
            <div className="ml-2 z-10">
              <SwitchTheme />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};