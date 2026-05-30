export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value || 0);
}

export function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
}
