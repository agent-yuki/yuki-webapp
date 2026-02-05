import { useState, useEffect } from 'react';

const TypingHeading: React.FC = () => {
  const [text, setText] = useState('Your Crypto Assets');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = ['Your Crypto Assets', 'NFT Collections', 'Smart Contracts', 'DeFi Protocols', 'dApps'];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500); // Pause at end
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, phrases, typingSpeed]);

  return (
    <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight text-foreground">
      Defend <span className="text-accent">{text}</span>
      <span className="animate-pulse text-accent">|</span>
    </h1>
  );
};

export default TypingHeading;