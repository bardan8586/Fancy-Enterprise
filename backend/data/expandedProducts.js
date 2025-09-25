const expandedProducts = [
  // MEN'S TOP WEAR
  {
    name: "Executive Black Tuxedo",
    description: "Elegant black tuxedo perfect for formal events and black-tie occasions. Crafted from premium wool blend.",
    price: 899.99,
    sku: "TUX-BLK-001",
    collections: "Formal",
    countInStock: 50,
    images: [
      { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=85", altText: "Executive Black Tuxedo" },
      { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=85", altText: "Tuxedo Detail" }
    ],
    category: "Top Wear",
    gender: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    material: "Wool",
    brand: "ChicStyle",
    isPublished: true,
    isFeatured: true
  },
  {
    name: "Professional Navy Blazer",
    description: "Classic navy blazer for business meetings and professional occasions. Modern fit with premium finish.",
    price: 249.99,
    sku: "BLZ-NVY-002",
    collections: "Business",
    countInStock: 75,
    images: [
      { url: "https://images.unsplash.com/photo-1566479179817-c0b3d8dcd2c6?auto=format&fit=crop&w=600&q=85", altText: "Professional Navy Blazer" },
      { url: "https://images.unsplash.com/photo-1594938374547-288c60c60c84?auto=format&fit=crop&w=600&q=85", altText: "Blazer Side View" }
    ],
    category: "Top Wear",
    gender: "Men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Black"],
    material: "Cotton",
    brand: "Modern Fit",
    isPublished: true,
    isFeatured: true
  },
  {
    name: "Casual Button-Down Shirt",
    description: "Versatile cotton shirt perfect for casual or semi-formal occasions. Comfortable and stylish.",
    price: 79.99,
    sku: "SHT-CTN-003",
    collections: "Casual",
    countInStock: 120,
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=85", altText: "Casual Button-Down Shirt" },
      { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=85", altText: "Shirt Detail" }
    ],
    category: "Top Wear",
    gender: "Men",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Blue", "Light Blue"],
    material: "Cotton",
    brand: "Urban Threads",
    isPublished: true,
    isFeatured: false
  },
  {
    name: "Premium Cashmere Sweater",
    description: "Luxurious cashmere sweater for ultimate comfort and style. Perfect for cold weather sophistication.",
    price: 299.99,
    sku: "SWT-CSH-004",
    collections: "Luxury",
    countInStock: 30,
    images: [
      { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=85", altText: "Premium Cashmere Sweater" },
      { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=85", altText: "Cashmere Texture" }
    ],
    category: "Top Wear",
    gender: "Men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gray", "Navy", "Black"],
    material: "Cashmere",
    brand: "Fashionista",
    isPublished: true,
    isFeatured: true
  },
  {
    name: "Streetwear Oversized Hoodie",
    description: "Comfortable oversized hoodie perfect for casual streetwear. Made from premium cotton blend.",
    price: 89.99,
    sku: "HOD-OSZ-005",
    collections: "Street",
    countInStock: 90,
    images: [
      { url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=85", altText: "Streetwear Oversized Hoodie" },
      { url: "https://images.unsplash.com/photo-1556821840-3a9fbc86b7c0?auto=format&fit=crop&w=600&q=85", altText: "Hoodie Back View" }
    ],
    category: "Top Wear",
    gender: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gray", "Black", "White"],
    material: "Cotton",
    brand: "Street Style",
    isPublished: true,
    isFeatured: false
  },

  // MEN'S BOTTOM WEAR
  {
    name: "Classic Dress Trousers",
    description: "Tailored dress trousers perfect for business and formal occasions. Precision cut for the modern gentleman.",
    price: 159.99,
    sku: "TRS-DRS-006",
    collections: "Business",
    countInStock: 60,
    images: [
      { url: "https://images.unsplash.com/photo-1506629905607-bb019664ea75?auto=format&fit=crop&w=600&q=85", altText: "Classic Dress Trousers" },
      { url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=85", altText: "Trouser Detail" }
    ],
    category: "Bottom Wear",
    gender: "Men",
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Black", "Navy", "Charcoal"],
    material: "Wool",
    brand: "Modern Fit",
    isPublished: true,
    isFeatured: true
  },
  {
    name: "Premium Denim Jeans",
    description: "High-quality denim jeans with perfect fit and durability. Classic style meets modern comfort.",
    price: 129.99,
    sku: "JNS-DNM-007",
    collections: "Casual",
    countInStock: 100,
    images: [
      { url: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=600&q=85", altText: "Premium Denim Jeans" },
      { url: "https://images.unsplash.com/photo-1541840031508-326b77c9a17e?auto=format&fit=crop&w=600&q=85", altText: "Denim Detail" }
    ],
    category: "Bottom Wear",
    gender: "Men",
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Dark Blue", "Light Blue", "Black"],
    material: "Denim",
    brand: "Urban Threads",
    isPublished: true,
    isFeatured: false
  },
  {
    name: "Casual Chino Pants",
    description: "Versatile chino pants perfect for smart-casual occasions. Comfortable fit with timeless style.",
    price: 89.99,
    sku: "CHN-CSL-008",
    collections: "Casual",
    countInStock: 80,
    images: [
      { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=85", altText: "Casual Chino Pants" },
      { url: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=600&q=85", altText: "Chino Style" }
    ],
    category: "Bottom Wear",
    gender: "Men",
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Khaki", "Navy", "Black"],
    material: "Cotton",
    brand: "Beach Breeze",
    isPublished: true,
    isFeatured: false
  },

  // WOMEN'S TOP WEAR
  {
    name: "Elegant Silk Blouse",
    description: "Luxurious silk blouse perfect for professional and formal occasions. Timeless elegance with modern cut.",
    price: 189.99,
    sku: "BLS-SLK-009",
    collections: "Business",
    countInStock: 45,
    images: [
      { url: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=600&q=85", altText: "Elegant Silk Blouse" },
      { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=85", altText: "Silk Detail" }
    ],
    category: "Top Wear",
    gender: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Cream", "Black"],
    material: "Silk",
    brand: "ChicStyle",
    isPublished: true,
    isFeatured: true
  },
  {
    name: "Cashmere V-Neck Sweater",
    description: "Premium cashmere sweater with elegant V-neck design. Perfect for sophisticated casual wear.",
    price: 259.99,
    sku: "SWT-VNK-010",
    collections: "Luxury",
    countInStock: 35,
    images: [
      { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=85", altText: "Cashmere V-Neck Sweater" },
      { url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=85", altText: "Sweater Detail" }
    ],
    category: "Top Wear",
    gender: "Women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Cream", "Gray", "Pink"],
    material: "Cashmere",
    brand: "Fashionista",
    isPublished: true,
    isFeatured: true
  },
  {
    name: "Designer Blazer Jacket",
    description: "Tailored blazer jacket perfect for business and professional settings. Modern fit with classic appeal.",
    price: 279.99,
    sku: "BLZ-DSG-011",
    collections: "Business",
    countInStock: 50,
    images: [
      { url: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=600&q=85", altText: "Designer Blazer Jacket" },
      { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=85", altText: "Blazer Detail" }
    ],
    category: "Top Wear",
    gender: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray"],
    material: "Wool",
    brand: "Modern Fit",
    isPublished: true,
    isFeatured: false
  },
  {
    name: "Casual Cotton T-Shirt",
    description: "Comfortable cotton t-shirt perfect for everyday casual wear. Soft fabric with modern fit.",
    price: 39.99,
    sku: "TSH-CTN-012",
    collections: "Casual",
    countInStock: 150,
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=85", altText: "Casual Cotton T-Shirt" },
      { url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&q=85", altText: "T-Shirt Detail" }
    ],
    category: "Top Wear",
    gender: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Pink", "Blue"],
    material: "Cotton",
    brand: "Beach Breeze",
    isPublished: true,
    isFeatured: false
  },

  // WOMEN'S BOTTOM WEAR
  {
    name: "High-Waisted Trousers",
    description: "Elegant high-waisted trousers perfect for professional and formal occasions. Flattering fit with modern style.",
    price: 149.99,
    sku: "TRS-HWT-013",
    collections: "Business",
    countInStock: 70,
    images: [
      { url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=85", altText: "High-Waisted Trousers" },
      { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=85", altText: "Trouser Detail" }
    ],
    category: "Bottom Wear",
    gender: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray"],
    material: "Polyester",
    brand: "ChicStyle",
    isPublished: true,
    isFeatured: true
  },
  {
    name: "Designer Skinny Jeans",
    description: "Premium skinny jeans with perfect stretch and fit. Contemporary style for modern women.",
    price: 119.99,
    sku: "JNS-SKN-014",
    collections: "Casual",
    countInStock: 95,
    images: [
      { url: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=600&q=85", altText: "Designer Skinny Jeans" },
      { url: "https://images.unsplash.com/photo-1541840031508-326b77c9a17e?auto=format&fit=crop&w=600&q=85", altText: "Jeans Detail" }
    ],
    category: "Bottom Wear",
    gender: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Dark Blue", "Black", "Light Blue"],
    material: "Denim",
    brand: "Urban Threads",
    isPublished: true,
    isFeatured: false
  },
  {
    name: "Flowy Midi Skirt",
    description: "Elegant midi skirt with beautiful flow and movement. Perfect for both casual and dressy occasions.",
    price: 89.99,
    sku: "SKT-MDI-015",
    collections: "Casual",
    countInStock: 60,
    images: [
      { url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=85", altText: "Flowy Midi Skirt" },
      { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=85", altText: "Skirt Movement" }
    ],
    category: "Bottom Wear",
    gender: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Floral"],
    material: "Viscose",
    brand: "Fashionista",
    isPublished: true,
    isFeatured: true
  },
  {
    name: "Classic A-Line Skirt",
    description: "Timeless A-line skirt perfect for office wear and formal occasions. Flattering cut for all body types.",
    price: 79.99,
    sku: "SKT-ALN-016",
    collections: "Business",
    countInStock: 85,
    images: [
      { url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=85", altText: "Classic A-Line Skirt" },
      { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=85", altText: "A-Line Style" }
    ],
    category: "Bottom Wear",
    gender: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray"],
    material: "Polyester",
    brand: "Modern Fit",
    isPublished: true,
    isFeatured: false
  },

  // ADDITIONAL ITEMS
  {
    name: "Elegant Red Evening Gown",
    description: "Stunning red evening gown perfect for special occasions and formal events. Luxurious design with elegant silhouette.",
    price: 599.99,
    sku: "GWN-EVN-017",
    collections: "Formal",
    countInStock: 25,
    images: [
      { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=85", altText: "Elegant Red Evening Gown" },
      { url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=85", altText: "Evening Gown Detail" }
    ],
    category: "Top Wear",
    gender: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Red", "Black", "Navy"],
    material: "Silk",
    brand: "ChicStyle",
    isPublished: true,
    isFeatured: true
  },
  {
    name: "Italian Leather Loafers",
    description: "Premium Italian leather loafers crafted for comfort and style. Perfect for both casual and formal wear.",
    price: 299.99,
    sku: "SHO-LFR-018",
    collections: "Luxury",
    countInStock: 40,
    images: [
      { url: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=85", altText: "Italian Leather Loafers" },
      { url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&q=85", altText: "Leather Detail" }
    ],
    category: "Footwear",
    gender: "Men",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Brown", "Black"],
    material: "Leather",
    brand: "Urban Threads",
    isPublished: true,
    isFeatured: false
  },
  {
    name: "Designer Silk Scarf",
    description: "Luxurious silk scarf with beautiful patterns. Perfect accessory for adding elegance to any outfit.",
    price: 149.99,
    sku: "SCF-SLK-019",
    collections: "Luxury",
    countInStock: 55,
    images: [
      { url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=85", altText: "Designer Silk Scarf" },
      { url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=85", altText: "Silk Pattern" }
    ],
    category: "Accessories",
    gender: "Women",
    sizes: ["One Size"],
    colors: ["Gold", "Blue", "Red"],
    material: "Silk",
    brand: "Fashionista",
    isPublished: true,
    isFeatured: true
  },
  {
    name: "Luxury Steel Watch",
    description: "Premium steel watch with precision movement. Perfect blend of functionality and luxury design.",
    price: 899.99,
    sku: "WTH-STL-020",
    collections: "Luxury",
    countInStock: 20,
    images: [
      { url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=85", altText: "Luxury Steel Watch" },
      { url: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=85", altText: "Watch Detail" }
    ],
    category: "Accessories",
    gender: "Unisex",
    sizes: ["One Size"],
    colors: ["Silver", "Gold", "Black"],
    material: "Steel",
    brand: "ChicStyle",
    isPublished: true,
    isFeatured: true
  }
];

module.exports = expandedProducts;