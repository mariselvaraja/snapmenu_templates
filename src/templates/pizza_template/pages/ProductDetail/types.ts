import { CartItem, MenuItem } from '../../../../common/redux';

// Define interfaces for modifiers
export interface ModifierOption {
    name: string;
    price: number | string;  // Allow both number and string types
    isEnabled?: boolean;
    selectedByDefult?: string;
    attrSortIndex?: number;
    visibility?: string;
}

export interface Modifier {
    name: string;
    options: ModifierOption[];
    is_multi_select?: string;
    is_forced?: string;
}

export interface SelectedModifier {
    name: string;
    options: {
        name: string;
        price: number | string;
    }[];
}

export interface ProductDetailProps {
    product: MenuItem;
    loading: boolean;
    error: string | null;
}
