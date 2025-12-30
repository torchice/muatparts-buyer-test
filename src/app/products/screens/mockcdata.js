export const categoriesDummy = [
    {
        groupCategory: "Electronics",
        categories: [
            {
                category: "Mobile Phones",
                subCategories: [
                    {
                        subCategory: "Smartphones",
                        items: [
                            { itemId: 1, itemName: "iPhone 13", price: 799 },
                            { itemId: 2, itemName: "Samsung Galaxy S21", price: 699 }
                        ]
                    },
                    {
                        subCategory: "Feature Phones",
                        items: [
                            { itemId: 3, itemName: "Nokia 3310", price: 59 },
                            { itemId: 4, itemName: "Samsung Guru", price: 39 }
                        ]
                    }
                ]
            },
            {
                category: "Laptops",
                subCategories: [
                    {
                        subCategory: "Gaming Laptops",
                        items: [
                            { itemId: 5, itemName: "Alienware M15", price: 1499 },
                            { itemId: 6, itemName: "Razer Blade 15", price: 1799 }
                        ]
                    },
                    {
                        subCategory: "Ultrabooks",
                        items: [
                            { itemId: 7, itemName: "MacBook Air", price: 999 },
                            { itemId: 8, itemName: "Dell XPS 13", price: 1099 }
                        ]
                    }
                ]
            }
        ]
    },
    {
        groupCategory: "Fashion",
        categories: [
            {
                category: "Men's Clothing",
                subCategories: [
                    {
                        subCategory: "T-Shirts",
                        items: [
                            { itemId: 9, itemName: "Graphic Tee", price: 25 },
                            { itemId: 10, itemName: "Plain T-Shirt", price: 15 }
                        ]
                    },
                    {
                        subCategory: "Jeans",
                        items: [
                            { itemId: 11, itemName: "Slim Fit Jeans", price: 50 },
                            { itemId: 12, itemName: "Straight Leg Jeans", price: 45 }
                        ]
                    }
                ]
            },
            {
                category: "Women's Clothing",
                subCategories: [
                    {
                        subCategory: "Dresses",
                        items: [
                            { itemId: 13, itemName: "Summer Dress", price: 60 },
                            { itemId: 14, itemName: "Evening Gown", price: 120 }
                        ]
                    },
                    {
                        subCategory: "Tops",
                        items: [
                            { itemId: 15, itemName: "Blouse", price: 30 },
                            { itemId: 16, itemName: "Tank Top", price: 20 }
                        ]
                    }
                ]
            }
        ]
    },
    {
        groupCategory: "Home Appliances",
        categories: [
            {
                category: "Kitchen Appliances",
                subCategories: [
                    {
                        subCategory: "Blenders",
                        items: [
                            { itemId: 17, itemName: "Ninja Blender", price: 99 },
                            { itemId: 18, itemName: "Vitamix 5200", price: 399 }
                        ]
                    },
                    {
                        subCategory: "Microwaves",
                        items: [
                            { itemId: 19, itemName: "Samsung Microwave", price: 149 },
                            { itemId: 20, itemName: "Panasonic Microwave", price: 129 }
                        ]
                    }
                ]
            },
            {
                category: "Cleaning Appliances",
                subCategories: [
                    {
                        subCategory: "Vacuum Cleaners",
                        items: [
                            { itemId: 21, itemName: "Dyson V11", price: 599 },
                            { itemId: 22, itemName: "Shark Navigator", price: 199 }
                        ]
                    },
                    {
                        subCategory: "Air Purifiers",
                        items: [
                            { itemId: 23, itemName: "Levoit Air Purifier", price: 89 },
                            { itemId: 24, itemName: "Honeywell Air Purifier", price: 179 }
                        ]
                    }
                ]
            }
        ]
    }
];


const brands = [
    {
      id: 1,
      name: "Toyota"
    },
    {
      id: 2,
      name: "Honda"
    },
    {
      id: 3,
      name: "Daihatsu"
    },
    {
      id: 4,
      name: "Suzuki"
    },
    {
      id: 5,
      name: "Mitsubishi"
    },
    {
      id: 6,
      name: "Nissan"
    },
    {
      id: 7,
      name: "Wuling"
    },
    {
      id: 8,
      name: "Hyundai"
    },
    {
      id: 9,
      name: "Mazda"
    },
    {
      id: 10,
      name: "BMW"
    }
  ];
  

  const types = [
    {
      id: 1,
      name: "SUV"
    },
    {
      id: 2,
      name: "MPV"
    },
    {
      id: 3,
      name: "Sedan"
    },
    {
      id: 4,
      name: "Hatchback"
    },
    {
      id: 5,
      name: "Pickup"
    },
    {
      id: 6,
      name: "Sport"
    },
    {
      id: 7,
      name: "Wagon"
    },
    {
      id: 8,
      name: "Van"
    },
    {
      id: 9,
      name: "Convertible"
    },
    {
      id: 10,
      name: "Coupe"
    }
  ];
  const models = [
    {
      id: 1,
      name: "Avanza"
    },
    {
      id: 2,
      name: "Xenia"
    },
    {
      id: 3,
      name: "Innova"
    },
    {
      id: 4,
      name: "Brio"
    },
    {
      id: 5,
      name: "HR-V"
    },
    {
      id: 6,
      name: "Civic"
    },
    {
      id: 7,
      name: "Fortuner"
    },
    {
      id: 8,
      name: "Pajero Sport"
    },
    {
      id: 9,
      name: "Xpander"
    },
    {
      id: 10,
      name: "Rush"
    },
    {
      id: 11,
      name: "Terios"
    },
    {
      id: 12,
      name: "Ertiga"
    },
    {
      id: 13,
      name: "XL7"
    },
    {
      id: 14,
      name: "Almaz"
    },
    {
      id: 15,
      name: "Confero"
    }
  ];
  
  const years = [
    {
      id: 1,
      name: "2024"
    },
    {
      id: 2,
      name: "2023"
    },
    {
      id: 3,
      name: "2022"
    },
    {
      id: 4,
      name: "2021"
    },
    {
      id: 5,
      name: "2020"
    },
    {
      id: 6,
      name: "2019"
    },
    {
      id: 7,
      name: "2018"
    },
    {
      id: 8,
      name: "2017"
    },
    {
      id: 9,
      name: "2016"
    },
    {
      id: 10,
      name: "2015"
    }
  ];
  
  
export {types,brands,models,years};