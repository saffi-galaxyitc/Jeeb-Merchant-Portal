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
export const isImageUrl = (url) => {
  return /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(url);
};
export const shallowEqual = (a, b) => {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => a[key] === b[key]);
};
export const componentCategories = [
  {
    name: "Content",
    components: [
      {
        type: "banner",
        name: "Banner",
        icon: "/Images/bannerLogo.gif",
        description:
          "A full-width promotional banner that supports images and auto-play functionality for marketing highlights.",
      },
      {
        type: "imageRow",
        name: "Image Row",
        icon: "/Images/imageRowLogo.gif",
        description:
          "A horizontally scrollable layout with two rows of rounded image blocks and titles, ideal for showcasing categories or collections.",
      },
      {
        type: "subHeaderGrid",
        name: "Sub Header Grid",
        icon: "/Images/subHeaderGridLogo.gif",
        description:
          "A horizontally scrollable grid of bordered image tiles with title text, designed for subcategories or secondary navigation.",
      },
      {
        type: "videoText",
        name: "Video Text",
        icon: "/Images/videoTextLogo.gif",
        description:
          "A section combining video with descriptive text and a call-to-action button, perfect for storytelling or product demos.",
      },
      {
        type: "imageText",
        name: "Image Text",
        icon: "/Images/imageTextLogo.gif",
        description:
          "A flexible image and text layout with an optional button, commonly used for promotional highlights or feature sections.",
      },
      {
        type: "bodyHalf",
        name: "Body Half",
        icon: "/Images/bodyHalfLogo.gif",
        description:
          "An interactive carousel with split-image layouts that transition smoothly, great for emphasizing featured content.",
      },
      {
        type: "subBodyGrid",
        name: "Sub Body Grid",
        icon: "/Images/subBodyGridLogo.gif",
        description:
          "A grid-style carousel that combines sliding images with titles, suitable for subcategories or grouped promotions.",
      },
      {
        type: "bodyPlain",
        name: "Body Plain",
        icon: "/Images/bodyPlainLogo.gif",
        description:
          "A clean promotional slider featuring plain image slides with auto-play functionality for campaigns or featured products.",
      },
      {
        type: "bodyRound",
        name: "Body Round",
        icon: "/Images/bodyRoundLogo.gif",
        description:
          "A rounded-style promotional slider with auto-play, perfect for displaying featured categories or seasonal campaigns.",
      },
      {
        type: "brands",
        name: "Brands",
        icon: "/Images/brandsLogo.gif",
        description:
          "A dynamic brand carousel featuring logo slides, brand names, and optional background imagery to highlight partnerships or collections.",
      },
      {
        type: "subCategBrands",
        name: "Sub Category Brands",
        icon: "/Images/bodyHalfLogo.gif",
        description:
          "A brand showcase slider tailored for subcategories, displaying logos with titles in a clean, rectangular format.",
      },
      {
        type: "productsGrid",
        name: "Products Grid",
        icon: "/Images/productsGridLogo.gif",
        description:
          "A horizontally scrollable product showcase that highlights featured or best-selling items in a grid format.",
      },
    ],
  },
];

export function getComponentByType(type) {
  for (const category of componentCategories) {
    const comp = category.components.find((c) => c.type === type);
    if (comp) {
      return comp; // return full object { type, name, icon, description }
    }
  }
  return { type, name: type, icon: "", description: "" }; // fallback
}

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
