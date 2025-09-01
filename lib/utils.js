import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const DB_NAME = process.env.NEXT_PUBLIC_API_DB_NAME;
// utils/base64.js
export const stripMimeType = (base64String = "") => {
  // Remove "data:[mime];base64," prefix if it exists
  return base64String.replace(/^data:[^;]+;base64,/, "");
};

export const sampleProducts = [
  {
    id: "1",
    name: "BIOBALANCE Premium Supplement",
    list_price: 299.99,
    pricelist_price: 249.99,
    description_sale: "High-quality health supplement for daily wellness",
    rating_count: 4.5,
    quantity: 15,
  },
  {
    id: "2",
    name: "VitaBoost Energy Complex",
    list_price: 189.99,
    pricelist_price: 189.99,
    description_sale: "Natural energy booster with essential vitamins",
    rating_count: 4.2,
    quantity: 8,
  },
  {
    id: "3",
    name: "GreenLife Organic Capsules",
    list_price: 149.99,
    pricelist_price: 119.99,
    description_sale: "100% organic health capsules for immunity",
    rating_count: 4.8,
    quantity: 22,
  },
  {
    id: "4",
    name: "ProHealth Multivitamin",
    list_price: 99.99,
    pricelist_price: 79.99,
    description_sale: "Complete multivitamin for daily nutrition",
    rating_count: 4.1,
    quantity: 0,
  },
  {
    id: "5",
    name: "NutriMax Protein Powder",
    list_price: 349.99,
    pricelist_price: 299.99,
    description_sale: "High-protein supplement for fitness enthusiasts",
    rating_count: 4.6,
    quantity: 12,
  },
  {
    id: "6",
    name: "PureWell Detox Formula",
    list_price: 199.99,
    pricelist_price: 169.99,
    description_sale: "Natural detox formula for body cleansing",
    rating_count: 4.3,
    quantity: 7,
  },
];
