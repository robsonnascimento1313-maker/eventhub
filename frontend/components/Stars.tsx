interface StarsProps {
  rating: number;
  size?: 'sm' | 'md';
}

export default function Stars({ rating, size = 'sm' }: StarsProps) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const textSize = size === 'md' ? 'text-base' : 'text-xs';

  return (
    <span className={`inline-flex items-center gap-0.5 ${textSize}`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < full;
        const isHalf = i === full && half;
        return (
          <span key={i} className={filled || isHalf ? 'text-amber-400' : 'text-gray-300'}>
            {isHalf ? '★' : '★'}
          </span>
        );
      })}
      <span className="ml-1 font-semibold text-gray-700">{rating.toFixed(1)}</span>
    </span>
  );
}
