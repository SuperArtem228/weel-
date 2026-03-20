import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import FloatingProps from '../FloatingProps/FloatingProps';
import './FinalOffer.css';

interface FinalOfferProps {
  onRegister?: () => void;
  onReady?: () => void;
}

export default function FinalOffer({ onRegister, onReady }: FinalOfferProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => onReady?.(),
    });

    // Background blur/fade in
    if (containerRef.current) {
      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }

    // Card reveal with scale + slide
    if (cardRef.current) {
      tl.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.88, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'back.out(1.3)' },
        '-=0.25'
      );
    }

    return () => { tl.kill(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="final-offer" ref={containerRef}>
      <FloatingProps variant="offer" />

      <div className="fo-card" ref={cardRef}>
        <h2 className="fo-title">Поздравляем!</h2>
        <p className="fo-subtitle">Твой выигрыш</p>

        <div className="fo-value-wrap">
          <span className="fo-value">150%</span>
        </div>

        <p className="fo-deposit">НА ПЕРВЫЙ ДЕПОЗИТ</p>

        <button className="fo-cta" onClick={onRegister}>
          РЕГИСТРАЦИЯ
        </button>
      </div>
    </div>
  );
}
