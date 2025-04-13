import React from 'react';
import { UtensilsCrossed, Heart, Users } from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size = 24 }: IconProps) {
  const props = {
    className,
    size
  };

  switch (name) {
    case 'UtensilsCrossed':
      return <UtensilsCrossed {...props} />;
    case 'Heart':
      return <Heart {...props} />;
    case 'Users':
      return <Users {...props} />;
    default:
      return null;
  }
}
