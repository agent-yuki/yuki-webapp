import HeroBadge from './hero/HeroBadge';
import TypingHeading from './hero/TypingHeading';
import HeroStats from './hero/HeroStats';
import InputForm from './hero/InputForm';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-24 pb-32 px-4 overflow-hidden min-h-[80vh] flex items-center justify-center">
      {/* Aurora / Mesh Background removed (now global) */}

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <HeroBadge />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <TypingHeading />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <HeroStats />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <InputForm />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground font-medium"
        >
          ⚠️ AI may not always be accurate, please be cautious and verify
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;