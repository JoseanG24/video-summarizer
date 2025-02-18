"use client";

import React, { useEffect, useRef } from "react";
import { useAnimation, useInView, motion } from "framer-motion";
import Link from "next/link";

const VideoSummarizerHero: React.FC = () => {
  return (
    <section className="text-white overflow-hidden bg-gray-900 px-8 py-24 md:px-12 md:py-32 h-screen">
      <div className="relative mx-auto max-w-5xl text-center">
        <div className="relative z-10">
          <Reveal>
            <h1 className="text-6xl font-black text-white md:text-8xl">
              AI Video Summarizer<span className="text-red-500">.</span>
            </h1>
          </Reveal>
          <Reveal>
            <h2 className="my-4 text-2xl text-gray-400 md:text-4xl">
              Save time,{" "}
              <span className="font-semibold text-red-500">
                get the key points
              </span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="max-w-xl mx-auto text-sm text-gray-300 md:text-base">
              Upload a video or paste a link, and let our AI generate a concise
              summary with the most important details. Perfect for students,
              professionals, and anyone who values efficiency.
            </p>
          </Reveal>
          <Reveal>
            <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <button className="rounded bg-red-600 px-6 py-3 text-white font-medium transition-all hover:bg-red-700 active:scale-95">
                  Get Started
                </button>
              </Link>
              <Link href="/sign-in">
                <button className="rounded border border-red-600 px-6 py-3 text-red-600 font-medium transition-all hover:bg-red-600 hover:text-white active:scale-95">
                  Sign In
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Reveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
  }, [isInView]);

  return (
    <div ref={ref} className="relative w-fit overflow-hidden">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: 0.5, ease: "easeIn" }}
        className="absolute bottom-1 left-0 right-0 top-1 z-20 bg-red-600"
      />
    </div>
  );
};

export default VideoSummarizerHero;
