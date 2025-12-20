import React from "react";
import Hero from "../components/Hero";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Additional content could go here if needed, but Hero covers most features */}
      <div className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-8"
          >
            Why Choose Our Platform?
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We leverage state-of-the-art Deep Learning models trained on the
            comprehensive Indian Sign Language dataset to provide accurate and
            real-time transcriptions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
