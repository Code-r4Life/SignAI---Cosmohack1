import React from "react";
import { motion } from "framer-motion";
import { Code, Database, Globe, Brain, Zap, Shield, Activity, Github, Linkedin, Cpu } from "lucide-react";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const slideRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-24 pb-24">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-start"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            About <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">SignAI</span>
          </h1>
          <p className="text-xl text-gray-400">
            Advanced Real-time Sign Language Recognition
          </p>
        </motion.div>

        {/* Mission Section (Split Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white">Mission Overview</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              SignAI represents a leap forward in accessible communication technology. 
              Our mission is to bridge the gap between sign language users and the digital world 
              through intelligent, real-time transcription.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              Using state-of-the-art <span className="text-blue-400 font-semibold">Deep Learning</span> and Computer Vision, 
              our system instantly identifies and translates Indian Sign Language gestures with high precision, 
              empowering users to communicate naturally and effectively.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
               The project combines <strong>advanced AI algorithms</strong> with a modern, intuitive web interface,
               making cutting-edge accessibility tools available to everyone.
            </p>
          </motion.div>

          {/* Right: Feature Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              { 
                icon: <Zap className="text-blue-400" size={24} />, 
                title: "Real-time Processing", 
                desc: "Instant gesture detection and classification at 60 FPS" 
              },
              { 
                icon: <Activity className="text-purple-400" size={24} />, 
                title: "High Accuracy", 
                desc: "Trained on diverse ISL datasets for robust prediction" 
              },
              { 
                icon: <Shield className="text-green-400" size={24} />, 
                title: "Secure & Private", 
                desc: "All processing can be handled locally or securely" 
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={slideRight}
                className="bg-surface/50 border border-white/10 p-6 rounded-xl flex items-start gap-4 hover:bg-surface/80 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Tech Stack Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-12">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "React", icon: <Globe size={32} className="text-cyan-400" />, sub: "Frontend" },
              { name: "Tailwind CSS", icon: <Code size={32} className="text-sky-400" />, sub: "Styling" },
              { name: "Flask", icon: <Database size={32} className="text-gray-200" />, sub: "Backend" },
              { name: "TensorFlow", icon: <Brain size={32} className="text-orange-400" />, sub: "Deep Learning" },
            ].map((tech, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center justify-center p-8 bg-surface border border-white/10 rounded-2xl group hover:border-blue-500/50 transition-all"
              >
                <div className="mb-4 p-4 bg-white/5 rounded-full group-hover:bg-blue-500/10 transition-colors">
                  {tech.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{tech.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{tech.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
           <h2 className="text-3xl font-bold mb-12 text-center">Meet The Team</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Shinjan Saha", role: "Team Lead", linkedin: "https://www.linkedin.com/in/shinjan-saha-1bb744319/", github: "https://github.com/Code-r4Life/" },
              { name: "Satyabrata Das Adhikari", role: "Developer", linkedin: "https://www.linkedin.com/in/satyabrata-das-adhikari-1813a7324/", github: "https://github.com/satya-py/" },
              { name: "Sayan Sk", role: "Developer", linkedin: "https://www.linkedin.com/in/sayan-sk-092203318/", github: "https://github.com/Sayan474/" },
            ].map((member, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-surface border border-white/10 rounded-2xl p-8 text-center hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mb-6 flex items-center justify-center text-3xl font-bold border-2 border-white/10">
                  {member.name[0]}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 mb-6 font-medium">{member.role}</p>
                <div className="flex justify-center gap-4">
                  <a href={member.linkedin} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Linkedin size={20} />
                  </a>
                  <a href={member.github} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Github size={20} />
                  </a>
                </div>
              </motion.div>
            ))}
           </div>
        </motion.div>

      </div>
    </div>
  );
};

export default About;