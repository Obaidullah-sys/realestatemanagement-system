import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import AgentCarousel from "../components/AgentCarousel";
import BuyRentOptions from "../components/BuyRentOptions";
import ExploreCities from "../components/ExploreCities";
import Hero from "../components/Hero";
import PropertyCategories from "../components/PropertyCategories";
import PropertySlider from "../components/PropertySlider";
import Testimonials from "../components/Testimonials";

// Reusable fade-up animation (matches AboutPage Reveal)
const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Wrapper for scroll-based reveal
function Reveal({ children, delay = 0 }) {
  const { ref, inView } = useInView({
    triggerOnce: true, // animate only on first view
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeUpVariant}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-gray-100">
      <Reveal>
        <Hero />
      </Reveal>

      <Reveal delay={0.1}>
        <ExploreCities />
      </Reveal>

      {/* Uncomment if you want categories section */}
      {/* <Reveal delay={0.15}>
        <PropertyCategories />
      </Reveal> */}

      <Reveal delay={0.2}>
        <PropertySlider />
      </Reveal>

      <Reveal delay={0.25}>
        <Testimonials />
      </Reveal>

      <Reveal delay={0.3}>
        <BuyRentOptions />
      </Reveal>

      <Reveal delay={0.35}>
        <AgentCarousel />
      </Reveal>
    </div>
  );
}
