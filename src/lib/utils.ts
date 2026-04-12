export const formatPrice = (price: string | number): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
  return `$${numericPrice.toLocaleString('es-MX')} MXN`;
};
