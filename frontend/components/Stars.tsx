import Icon from './Icon';

interface StarsProps {
  rating: number;
  size?: 'sm' | 'md';
}

export default function Stars({ rating, size = 'sm' }: StarsProps) {
  const px = size === 'md' ? 16 : 13;
  const textSize = size === 'md' ? 'text-sm' : 'text-xs';

  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center gap-0.5 text-amber-400">
        {[0, 1, 2, 3, 4].map((i) => (
          <Icon key={i} name="star" size={px} filled={i < Math.round(rating)} strokeWidth={i < Math.round(rating) ? 0 : 1.5}
            className={i < Math.round(rating) ? 'text-amber-400' : 'text-gray-600'} />
        ))}
      </span>
      <span className={`font-semibold text-gray-200 ${textSize}`}>{rating.toFixed(1)}</span>
    </span>
  );
}
