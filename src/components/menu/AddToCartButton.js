'use client';

import React from 'react';

export default function AddToCartButton({
  hasSizesOrExtras,
  onClick,
  basePrice,
}) {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(basePrice);

  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 bg-primary hover:bg-yellow-600 text-white border-none rounded-full px-8 py-2"
    >
      Add to cart {formattedPrice}
    </button>
  );
}
