// import React, { useState, useEffect } from "react";
// import { motion, useScroll, useMotionValueEvent } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Menu, X } from "lucide-react";
// import { useAuth } from "@/hooks/useAuth";
// import SignInButtons from "@/components/signInButton";
// import Link from "next/link";

// const menuItems = [
//   { name: "Home", href: "/" },
//   { name: "Features", href: "#features" },
//   { name: "Pricing", href: "#pricing" },
//   { name: "Docs", href: "/docs" },
//   { name: "Playground", href: "/playground" },
// ];

// const NavbarItem = ({
//   name,
//   href,
//   onClick,
// }: {
//   name: string;
//   href: string;
//   onClick: () => void;
// }) => (
//   <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//     <a
//       href={href}
//       className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
//       onClick={onClick}
//     >
//       {name}
//     </a>
//   </motion.li>
// );

// export default function Navbar() {
//   const { isAuthenticated } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);
//   const [hidden, setHidden] = useState(false);
//   const { scrollY } = useScroll();

//   useMotionValueEvent(scrollY, "change", (latest) => {
//     const previous = scrollY.getPrevious();
//     if (!previous) return;
//     if (latest > previous && latest > 150) {
//       setHidden(true);
//     } else {
//       setHidden(false);
//     }
//   });

//   const toggleMenu = () => setIsOpen(!isOpen);

//   const closeMenu = () => setIsOpen(false);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setIsOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <motion.nav
//       className="fixed top-0 left-0 right-0 bg-white z-50"
//       initial={false}
//       animate={hidden ? "hidden" : "visible"}
//       transition={{ duration: 0.35, ease: "easeInOut" }}
//       variants={{
//         visible: { opacity: 1, y: 0 },
//         hidden: { opacity: 0, y: "-100%" },
//       }}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center">
//             <motion.div
//               className="flex-shrink-0"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//             </motion.div>
//             <h1 className="ml-2 text-2xl font-bold text-blue-600">Compyl</h1>
//           </div>

//           <div className="hidden md:block">
//             <ul className="ml-10 flex items-baseline space-x-4 gap-3">
//               {menuItems.map((item) => (
//                 <NavbarItem key={item.name} {...item} onClick={closeMenu} />
//               ))}
//             </ul>
//           </div>

//           <div className="hidden md:block">
//             {isAuthenticated ? (
//               <Link href={"/playground"}>
//                 <Button variant="secondary">Dashboard</Button>
//               </Link>
//             ) : (
//               <SignInButtons />
//             )}
//           </div>

//           <div className="md:hidden">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleMenu}
//               aria-label="Toggle menu"
//             >
//               {isOpen ? <X /> : <Menu />}
//             </Button>
//           </div>
//         </div>
//       </div>

//       <motion.div
//         className="md:hidden"
//         initial="closed"
//         animate={isOpen ? "open" : "closed"}
//         variants={{
//           open: { opacity: 1, height: "auto" },
//           closed: { opacity: 0, height: 0 },
//         }}
//       >
//         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
//           {menuItems.map((item) => (
//             <a
//               key={item.name}
//               href={item.href}
//               className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
//               onClick={closeMenu}
//             >
//               {item.name}
//             </a>
//           ))}
//           <div className="pt-4 pb-3 border-t border-gray-200">
//             <div className="px-2">
//               {isAuthenticated ? (
//                 <Button className="w-full">Dashboard</Button>
//               ) : (
//                 <SignInButtons />
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </motion.nav>
//   );
// }

import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SignInButtons from "@/components/signInButton";
import Link from "next/link";

const ModernLightningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="32"
    height="32"
  >
    <circle cx="50" cy="50" r="45" fill="#f0f4f8" />
    <path
      d="M55 20 L30 50 L48 50 L45 80 L70 50 L52 50 Z"
      fill="none"
      stroke="#3498db"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Docs", href: "/docs" },
  { name: "Playground", href: "/playground" },
];

const NavbarItem = ({
  name,
  href,
  onClick,
}: {
  name: string;
  href: string;
  onClick: () => void;
}) => (
  <motion.li
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative"
  >
    <Link href={href}>
      <p
        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 py-2"
        onClick={onClick}
      >
        {name}
        <motion.span
          className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
      </p>
    </Link>
  </motion.li>
);

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (!previous) return;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm"
      initial={false}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: "-100%" },
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center">
              <ModernLightningIcon />
              <h1 className="ml-2 text-2xl font-bold text-blue-600">Compyl</h1>
            </Link>
          </motion.div>

          <div className="hidden md:block">
            <ul className="ml-10 flex items-center space-x-6">
              {menuItems.map((item) => (
                <NavbarItem key={item.name} {...item} onClick={closeMenu} />
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            {isAuthenticated ? (
              <Link href="/playground">
                <Button variant="secondary">Dashboard</Button>
              </Link>
            ) : (
              <SignInButtons />
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        className="md:hidden"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 },
        }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              {item.name}
            </a>
          ))}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2">
              {isAuthenticated ? (
                <Link href="/playground">
                  <Button className="w-full">Dashboard</Button>
                </Link>
              ) : (
                <SignInButtons />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
