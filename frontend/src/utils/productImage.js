const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?auto=format&fit=crop&w=900&q=80';

const NAME_IMAGE_MAP = [
  {
    patterns: ['iphone', 'apple iphone'],
    image:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
  },
  {
    patterns: ['samsung galaxy', 'galaxy s'],
    image:
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80',
  },
  {
    patterns: ['redmi', 'xiaomi'],
    image:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
  },
  {
    patterns: ['macbook', 'apple macbook'],
    image:
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  },
  {
    patterns: ['rog', 'gaming laptop', 'rtx'],
    image:
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80',
  },
  {
    patterns: ['wh-1000xm5', 'sony headphones', 'noise cancelling'],
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  },
  {
    patterns: ['airpods', 'apple airpods'],
    image:
      'https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?auto=format&fit=crop&w=900&q=80',
  },
  {
    patterns: ['playstation 5', 'ps5', 'playstation'],
    image:
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=900&q=80',
  },
  {
    patterns: ['nintendo switch', 'switch oled', 'nintendo'],
    image:
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=900&q=80',
  },
  {
    patterns: ['mx master', 'logitech mouse', 'logitech'],
    image:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
  },
];

const getKeywordImage = (product) => {
  const query = encodeURIComponent(`${product?.name || ''} ${product?.category || 'electronics'}`.trim());
  return `https://loremflickr.com/900/600/${query}?lock=1`;
};

export const getProductImage = (product) => {
  if (product?.imageUrl?.trim()) {
    return product.imageUrl.trim();
  }

  const name = (product?.name || '').toLowerCase();
  const mapped = NAME_IMAGE_MAP.find((entry) =>
    entry.patterns.some((pattern) => name.includes(pattern))
  );

  if (mapped) {
    return mapped.image;
  }

  return getKeywordImage(product) || DEFAULT_IMAGE;
};

export const getFallbackProductImage = () => DEFAULT_IMAGE;
