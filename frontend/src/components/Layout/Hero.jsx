import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "../../assets/hero.webp";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Hero Image */}
      <motion.img
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        src={heroImg}
        alt="Fancy"
        className="w-full h-[430px] md:h-[620px] lg:h-[760px] object-cover opacity-70 mix-blend-screen"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/30 to-transparent" />
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle_at_top,_rgba(255,154,98,0.35),transparent_60%)] blur-3xl -top-64 -right-32 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.25),transparent_60%)] blur-3xl -bottom-40 -left-10 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="p-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-5 py-2 mb-6 text-xs tracking-[0.35em] uppercase rounded-full bg-white/10 border border-white/20 backdrop-blur"
          >
            <span className="inline-flex w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            Resort Essentials
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8 text-4xl font-semibold uppercase md:text-7xl lg:text-8xl tracking-tight leading-tight"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-rose-200 to-sky-200"
            >
              Vacation
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="block text-white"
            >
              Ready
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mb-10 text-base md:text-lg lg:text-xl tracking-wide max-w-2xl mx-auto leading-relaxed text-white/80"
          >
            Explore our vacation-ready outfits with fast worldwide shipping
          </motion.p>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/collections/all"
                className="inline-flex items-center justify-center gap-3 px-10 py-4 text-lg font-semibold text-slate-950 rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 shadow-[0_20px_45px_rgba(255,122,24,0.35)] hover:shadow-[0_25px_55px_rgba(255,122,24,0.45)] transition-all duration-300"
              >
                Shop Now
                <motion.span 
                  className="inline-block"
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Decorative floating dots */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white/40"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 8}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-white/70"
        >
          <span className="text-sm mb-2 tracking-wider">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
