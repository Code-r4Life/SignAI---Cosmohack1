import React from "react";
import { motion } from "framer-motion";
import { Camera, BarChart2, Eye, Crosshair, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center pt-16">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/20 to-background -z-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -z-10 animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10 mt-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400">
            Bridging Silence with
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Intelligent AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 max-w-2xl text-xl text-gray-400 mb-10"
        >
          Real-time Indian Sign Language transcription powered by advanced
          computer vision. Experience seamless communication with modern
          technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/detection"
            className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            Start Detection <ArrowRight size={20} />
          </Link>
          <Link
            to="/signs"
            className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm transition-all flex items-center justify-center"
          >
            Learn Signs
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 w-full max-w-5xl"
        >
          {[
            {
              icon: <Camera className="w-8 h-8 text-blue-400" />,
              title: "Live Detection",
              desc: "Real-time camera feed analysis",
            },
            {
              icon: <BarChart2 className="w-8 h-8 text-purple-400" />,
              title: "Smart Analytics",
              desc: "Instant confidence scoring",
            },
            {
              icon: <Eye className="w-8 h-8 text-pink-400" />,
              title: "Visual Overlay",
              desc: "Landmark tracking & feedback",
            },
            {
              icon: <Crosshair className="w-8 h-8 text-cyan-400" />,
              title: "Precision Mode",
              desc: "High accuracy model",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="mb-4 p-3 rounded-full bg-white/5">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
