import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => {
        setLocation('/login');
      }, 500); // Wait for animation to complete
      return () => clearTimeout(timer);
    }
  }, [clicked, setLocation]);

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      <motion.div
        initial={false}
        animate={{
          x: clicked ? "-100%" : 0,
        }}
        transition={{
          type: "tween",
          duration: 0.5,
          ease: "easeInOut"
        }}
        className="w-full h-full cursor-pointer"
        onClick={() => setClicked(true)}
      >
        <img
          src="https://i.ibb.co/QXZyJz7/Design-sem-nome-37.png"
          alt="Landing Page"
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  );
}
