import { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion";

export default function DecryptedText({
  text = "Conquer the next question!", // default motivational text
  speed = 25,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover', // 'hover', 'view', 'both'
  ...props
}) {
  // Always ensure displayText is a string
  const [displayText, setDisplayText] = useState(() => String(text || ""));
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  // Handle scrambling logic
  useEffect(() => {
    let interval;
    let currentIteration = 0;

    const getNextIndex = revealedSet => {
      const textLength = String(text || "").length;
      switch (revealDirection) {
        case 'start':
          return revealedSet.size;
        case 'end':
          return textLength - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) return nextIndex;
          for (let i = 0; i < textLength; i++) if (!revealedSet.has(i)) return i;
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(String(text || "").split(''))).filter(char => char !== ' ')
      : characters.split('');

    const shuffleText = (originalText, currentRevealed) => {
      const str = String(originalText || "");
      if (useOriginalCharsOnly) {
        const positions = str.split('').map((char, i) => ({
          char,
          isSpace: char === ' ',
          index: i,
          isRevealed: currentRevealed.has(i)
        }));
        const nonSpaceChars = positions.filter(p => !p.isSpace && !p.isRevealed).map(p => p.char);
        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
        }
        let charIndex = 0;
        return positions.map(p => {
          if (p.isSpace) return ' ';
          if (p.isRevealed) return str[p.index];
          return nonSpaceChars[charIndex++];
        }).join('');
      } else {
        return str.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return str[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        }).join('');
      }
    };

    if (isHovering) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setRevealedIndices(prevRevealed => {
          const newRevealed = new Set(prevRevealed);

          if (sequential) {
            if (newRevealed.size < String(text || "").length) {
              const nextIndex = getNextIndex(newRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              return prevRevealed;
            }
          } else {
            setDisplayText(shuffleText(text, newRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(interval);
              setIsScrambling(false);
              setDisplayText(String(text || ""));
            }
            return newRevealed;
          }
        });
      }, speed);
    } else {
      setDisplayText(String(text || ""));
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }

    return () => interval && clearInterval(interval);
  }, [isHovering, text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly]);

  // Animate when in view
  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'both') return;

    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsHovering(true);
          setHasAnimated(true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, { root: null, rootMargin: '0px', threshold: 0.1 });
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => currentRef && observer.unobserve(currentRef);
  }, [animateOn, hasAnimated]);

  const hoverProps = (animateOn === 'hover' || animateOn === 'both') ? {
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false)
  } : {};

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      {...hoverProps}
      {...props}
    >
      <span className="sr-only">{displayText}</span>
      <span aria-hidden="true">
        {String(displayText).split('').map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || !isScrambling || !isHovering;
          return (
            <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
