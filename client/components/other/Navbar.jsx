"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { SiInstagram, SiLinkedin, SiYoutube } from "react-icons/si";
import Link from "next/link";

const DarkRedNav = () => {
  const [active, setActive] = useState(false);

  return (
    <>
      <HamburgerButton active={active} setActive={setActive} />
      <AnimatePresence>
        {active && <NavOverlay setActive={setActive} />}
      </AnimatePresence>
    </>
  );
};

const NavOverlay = ({ setActive }) => {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
    >
      <motion.button
        onClick={() => setActive(false)}
        className="absolute top-6 right-6 text-3xl bg-red-600 text-white hover:bg-red-700 p-4 rounded-full transition-all"
        whileHover={{ rotate: "180deg" }}
      >
        <FiX />
      </motion.button>

      <motion.div className="space-y-6 text-center">
        {LINKS.map((link, idx) => (
          <NavLink key={link.title} href={link.href} idx={idx}>
            {link.title}
          </NavLink>
        ))}
      </motion.div>

      <SocialLinks />
    </motion.nav>
  );
};

const NavLink = ({ children, href, idx }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.2 + idx * 0.1, duration: 0.5 },
      }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Link href={href} passHref>
        <motion.button className="text-5xl font-bold text-white hover:text-red-500 transition-all">
          {children}.
        </motion.button>
      </Link>
    </motion.div>
  );
};

const SocialLinks = () => {
  return (
    <div className="absolute bottom-6 flex gap-4">
      {SOCIALS.map((social, idx) => (
        <motion.a
          key={idx}
          href={social.href}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.5 + idx * 0.1, duration: 0.5 },
          }}
          exit={{ opacity: 0, y: 10 }}
        >
          <social.icon className="text-2xl text-white hover:text-red-400 transition-all" />
        </motion.a>
      ))}
    </div>
  );
};

const HamburgerButton = ({ active, setActive }) => {
  return (
    <motion.button
      className="fixed top-6 right-6 z-50 p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all"
      onClick={() => setActive((prev) => !prev)}
      whileTap={{ scale: 0.9 }}
    >
      {active ? <FiX size={24} /> : <FiMenu size={24} />}
    </motion.button>
  );
};

const LINKS = [
  { title: "Home", href: "/dashboard" },
  { title: "My Videos", href: "/videos" },
  { title: "Report a Problem", href: "/report" },
  { title: "Contact", href: "/contact" },
];

const SOCIALS = [
  { icon: SiInstagram, href: "#" },
  { icon: SiLinkedin, href: "#" },
  { icon: SiYoutube, href: "#" },
];

export default DarkRedNav;
