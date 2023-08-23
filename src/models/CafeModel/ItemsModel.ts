export interface CafeAddonGroup {
  id: string;
  name: string;
  minSelection: number;
  maxSelection: number;
}

export interface CafeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  addonGroups: CafeAddonGroup[];
  outOfStock: boolean;
  imageUrl: string;
  coverImageUrl?: string;
}

export interface CafeItemOption {
  id: string;
  name: string;
  price: number;
  outOfStock: boolean;
  calories?: number;
}
