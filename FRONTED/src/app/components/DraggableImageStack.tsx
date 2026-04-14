import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1706078358584-defe860ad199?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHNjaG9vbCUyMGNhbXB1cyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzYxMzgxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    label: 'Campus',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1752920299180-e8fd9276c202?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwbGlicmFyeSUyMGJvb2tzfGVufDF8fHx8MTc3NjEzODE3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    label: 'Library',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1758413350815-7b06dbbfb9a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjBtb2Rlcm4lMjBlZHVjYXRpb24lMjBsZWFybmluZ3xlbnwxfHx8fDE3NzYxMzgxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    label: 'Classroom',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1608037222011-cbf484177126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFiJTIwc2Nob29sJTIwZXhwZXJpbWVudHxlbnwxfHx8fDE3NzYxMzgxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    label: 'Science Lab',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1771909712504-900d75c7eccb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBzcG9ydHMlMjBmaWVsZCUyMG91dGRvb3IlMjBhY3Rpdml0eXxlbnwxfHx8fDE3NzYxMzgxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    label: 'Sports',
  },
];

const DRAG_THRESHOLD = 80;
const VISIBLE_CARDS = 3;

function StackCard({
  image,
  index,
  total,
  onDragEnd,
  isTop,
}: {
  image: (typeof IMAGES)[0];
  index: number; // 0 = top card
  total: number;
  onDragEnd: (dir: 'left' | 'right') => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -80, 0, 80, 200], [0.4, 1, 1, 1, 0.4]);

  const stackRotate = index === 0 ? 0 : index === 1 ? -4 : 4;
  const stackY = index * -6;
  const stackScale = 1 - index * 0.045;
  const zIndex = total - index;

  const handleDragEnd = useCallback(() => {
    const val = x.get();
    if (val < -DRAG_THRESHOLD) {
      animate(x, -400, { duration: 0.25 });
      setTimeout(() => { onDragEnd('left'); x.set(0); }, 260);
    } else if (val > DRAG_THRESHOLD) {
      animate(x, 400, { duration: 0.25 });
      setTimeout(() => { onDragEnd('right'); x.set(0); }, 260);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  }, [x, onDragEnd]);

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : stackRotate,
        opacity: isTop ? opacity : 1,
        y: stackY,
        scale: stackScale,
        zIndex,
        originX: 0.5,
        originY: 1,
      }}
      animate={{
        rotate: isTop ? undefined : stackRotate,
        y: stackY,
        scale: stackScale,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.03 }}
    >
      <img
        src={image.url}
        alt={image.label}
        draggable={false}
        className="w-full h-full object-cover pointer-events-none"
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(10,20,14,0.7) 0%, transparent 50%)' }}
      />
      {/* Label */}
      {isTop && (
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <span className="text-white text-xs font-semibold tracking-wide px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(88,129,87,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(163,177,138,0.25)' }}>
            {image.label}
          </span>
          <span className="text-xs" style={{ color: 'rgba(163,177,138,0.7)' }}>drag ←→</span>
        </div>
      )}
    </motion.div>
  );
}

export function DraggableImageStack() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = IMAGES.length;

  const visibleImages = Array.from({ length: Math.min(VISIBLE_CARDS, total) }, (_, i) => {
    const idx = (currentIndex + i) % total;
    return { image: IMAGES[idx], stackIndex: i };
  });

  const goNext = useCallback(() => setCurrentIndex((p) => (p + 1) % total), [total]);
  const goPrev = useCallback(() => setCurrentIndex((p) => (p - 1 + total) % total), [total]);

  const handleDragEnd = useCallback((dir: 'left' | 'right') => {
    if (dir === 'left') goNext();
    else goPrev();
  }, [goNext, goPrev]);

  return (
    <div className="absolute bottom-8 right-6 z-10 flex flex-col items-center gap-3 select-none" style={{ width: 220 }}>
      {/* Card stack */}
      <div className="relative" style={{ width: 220, height: 148 }}>
        {[...visibleImages].reverse().map(({ image, stackIndex }) => (
          <StackCard
            key={image.id}
            image={image}
            index={stackIndex}
            total={VISIBLE_CARDS}
            onDragEnd={handleDragEnd}
            isTop={stackIndex === 0}
          />
        ))}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3">
        <button
          onClick={goPrev}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: 'rgba(88,129,87,0.25)', border: '1px solid rgba(163,177,138,0.2)', backdropFilter: 'blur(12px)' }}
        >
          <ChevronLeft size={13} style={{ color: '#A3B18A' }} />
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentIndex ? 16 : 5,
                height: 5,
                background: i === currentIndex ? '#588157' : 'rgba(163,177,138,0.3)',
              }}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: 'rgba(88,129,87,0.25)', border: '1px solid rgba(163,177,138,0.2)', backdropFilter: 'blur(12px)' }}
        >
          <ChevronRight size={13} style={{ color: '#A3B18A' }} />
        </button>
      </div>
    </div>
  );
}
