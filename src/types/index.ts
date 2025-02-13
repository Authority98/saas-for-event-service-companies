export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  size?: string;
  type: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  status: 'available' | 'booked' | 'maintenance';
  extras?: {
    [key: string]: {
      selected: boolean;
      quantity?: number;
      options?: {
        [key: string]: {
          selected: boolean;
          quantity: number;
        };
      };
    };
  };
};

export type ExtraType = 'CHECKBOX' | 'RANGE' | 'TOGGLE_WITH_QUANTITY';

export type ExtraOption = {
  id: string;
  name: string;
  price: number;
};

export type ToggleOption = {
  id: string;
  name: string;
  price: number;
  min_quantity?: number;
  max_quantity?: number;
};

export type Extra = {
  id: string;
  name: string;
  description?: string;
  type: ExtraType;
  price: number;
  price_per_unit?: number;
  min_quantity?: number;
  max_quantity?: number;
  left_label?: string;  // For toggle switch left side text
  right_label?: string; // For toggle switch right side text
  created_at?: string;
  updated_at?: string;
};

export interface EventDetails {
  eventDate: Date;
  venueLocation: string;
  totalGuests: number;
  formalDiningSeats: number;
  interestedIn: Record<string, boolean>;
}

export interface ContactDetails {
  name: string;
  email: string;
  eventType: string;
  referralSource: string;
  telephone: string;
  comments: string;
  sendBrochure: boolean;
}

export interface TentType {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}