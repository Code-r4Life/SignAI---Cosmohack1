import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Signs = () => {
  const [signs, setSigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSigns = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/signs");
        setSigns(response.data);
      } catch (error) {
        console.error("Error fetching signs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSigns();
  }, []);

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">
            Learn Indian Sign Language
          </h1>
          <p className="text-gray-400 italic max-w-2xl mx-auto mb-8">
            "Till now we have made our model to predict just within these
            styles, but we would surely expand our model to predict other signs
            as well, our work is reproducible for other datasets as well"
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {signs.map((sign, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-surface border border-white/10 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group"
              >
                <div className="aspect-video bg-black relative">
                  <video
                    src={sign.video_url}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                  />
                </div>
                <div className="p-4 bg-white/5">
                  <h3 className="text-xl font-semibold text-center group-hover:text-blue-400 transition-colors">
                    {sign.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Signs;
