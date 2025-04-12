import React from 'react';
import { UtensilsCrossed, Heart, Users } from 'lucide-react';

interface IconProps {
  name: string;
}

export function Icon({ name }: IconProps) {
  switch (name) {
    case 'UtensilsCrossed':
      return <UtensilsCrossed />;
    case 'Heart':
      return <Heart />;
    case 'Users':
      return <Users />;
    default:
      return null;
  }
}
