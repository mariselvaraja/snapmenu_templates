// Define interfaces for combo-related types
export interface ComboProduct {
  pk_id: string;
  sku_id: string;
  name: string;
  price: string | number;
  product_description: string;
  image?: string;
  is_enabled: boolean | string;
  modifiers_list?: any[];
  [key: string]: any; // For additional properties
}

export interface ComboItem {
  combo_id: string;
  restaurant_id: string;
  title: string;
  description: string;
  products: ComboProduct[];
  combo_price: string;
  offer_percentage?: string;
  combo_image: string;
  is_enabled: boolean;
  created_date?: string;
}

export interface ComboDetailProps {
  combo: ComboItem;
  loading: boolean;
  error: string | null;
}

export interface ComboHeaderProps {
  combo: ComboItem;
  handleAddToCart: () => void;
  isPaymentAvilable: boolean;
  showPrice: boolean;
  calculateSavings: () => number;
  calculateIndividualTotal: () => number;
}

export interface ComboProductsListProps {
  combo: ComboItem;
  showPrice: boolean;
}

export interface ComboDetailsSectionProps {
  combo: ComboItem;
}
