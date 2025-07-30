import ProductForm from "./ProductForm";
import React from "react";

export default async function ProductPage({ params }) {
  const { id } = await params;
  return <ProductForm id={id} />;
}
