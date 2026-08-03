export const applyDynamicBadges = (productsList: any[], badgesConfig: any) => {
  // If dynamic badges are disabled, return original list untouched
  if (badgesConfig?.enableDynamicBadges === false) {
    return productsList;
  }

  const trendingCount = badgesConfig?.trendingCount ?? 15;
  const newArrivalCount = badgesConfig?.newArrivalCount ?? 5;
  const bestSellerCount = badgesConfig?.bestSellerCount ?? 5;

  // First reset badges to false to override any legacy flags
  const resetList = productsList.map(p => ({
    ...p,
    is_trending: false,
    is_new_arrival: false,
    is_best_seller: false
  }));

  // Sort by price descending (highest price first)
  const sortedByPrice = [...resetList].sort((a, b) => {
    const priceA = Number(a.price || a.sale_price || 0);
    const priceB = Number(b.price || b.sale_price || 0);
    return priceB - priceA;
  });

  // Trending Now badges (top N highest priced)
  const trendingIds = new Set(sortedByPrice.slice(0, trendingCount).map(p => p.id));

  // The remaining products
  const remaining = sortedByPrice.slice(trendingCount);

  // New Arrival badges (next M)
  const newArrivalIds = new Set(remaining.slice(0, newArrivalCount).map(p => p.id));

  // Best Seller badges (next K)
  const bestSellerIds = new Set(remaining.slice(newArrivalCount, newArrivalCount + bestSellerCount).map(p => p.id));

  return resetList.map(p => {
    if (trendingIds.has(p.id)) {
      return { ...p, is_trending: true };
    }
    if (newArrivalIds.has(p.id)) {
      return { ...p, is_new_arrival: true };
    }
    if (bestSellerIds.has(p.id)) {
      return { ...p, is_best_seller: true };
    }
    return p;
  });
};
