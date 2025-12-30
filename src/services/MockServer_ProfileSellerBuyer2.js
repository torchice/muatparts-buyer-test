// src/services/MockServer_ProfileSellerBuyer.js

// Helper function to generate product data
const generateProduct = () => {
  return {
    id: "62f45925-023b-4f78-aa74-cb547984a959",
    imageSrc: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736910668429.webp",
    title: "Kunci Roda",
    originalPrice: 67000,
    discountedPrice: 67000,
    discount: 0,
    quality: "Genuine",
    rating: 4.4, // RATING PRODUK 
    sales: 100, // JUMLAH TERJUAL
    isGrosir: true, // TRUE OR FALSE
    stock: 50,
    bonus: "Garansi 3 Bulan",
    isWishlisted: false, // SUDAH DITAMBAHKAN KE WISHLIST ATAU BELUM
  };
};

// Mock Data
export const profileSellerBuyerData = {
  storeInfo: {
    id: "cf7c0d3c-58a0-4b6f-b009-78f335d198be", // UUID
    name: "Makmur Jaya",
    isOnline: false, // false or true
    location: "Surabaya",
    lastOnline: "2 Jam Lalu", 
    // Terakhir online dihitung berdasarkan jam :
    // < 1 jam = menit
    // > 60 menit = jam
    // > 24 jam = hari
    // > 7 hari = hari
    // > 30 hari = bulan
    logo: "/img/FloatingMenu.png",
    metrics: [
      {
        value: 4.9,
        label: "Rating & Ulasan",
      },
      {
        value: 3000, // TOTAL PRODUK SUDAH TERJUAL
        label: "Produk",
      },
      {
        value: "08:00 - 21:00", // "08:00 - 21:00" atau "Tutup" atau "24 Jam"
        label: "Jam Operasional",
      }
    ],
    rating: {
      averageRating: 4.9,
      totalReviews: 100, // TOTAL ULASAN DARI PEMBELI
      totalRatings: 120, // TOTAL RATING DARI PEMBELI
      ratingDistribution:{
        "5": 10,
        "4": 20,
        "3": 30,
        "4": 40,
        "5": 50
      }
    },
    // KALO SUDAH PERNAH DIATUR DI PENGATURAN  MERCHANT
    operationalHours: [
      { day:  "1", type: "custom", openTime: "10.00", closeTime: "20.00" }, // KALO ADA RENTANG WAKTUNYA
      { day:  "2", type: "24h", openTime: null, closeTime: null }, // KALO BUKA 24 JAM
      { day:  "3", type: "closed", openTime: null, closeTime: null }, // KALO TUTUP
      // SETERUSNYA SAMPAI HARI MINGGU
    ],
    // KALO BELUM PERNAH DIATUR DI PENGATURAN MERCHANT
    operationalHours: []
  },

  etalase: [
    "Etalase 1",
    "Etalase 2",
    "Etalase 3",
    "Etalase 4",
    "Etalase 5",
    "Etalase 6",
  ],

  products: Array(10).fill().map((_, index) => generateProduct(200 + index)),

  reviews: Array(10).fill().map((_, index) => ({
    id: index + 1,
    rating: Math.floor(Math.random() * 5) + 1, // 1 s/d 5 bintang
    date: `${Math.floor(Math.random() * 28) + 1} Nov 2024`,
    time: `${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    productImage: "/img/temp-review.png",
    productName: [
      "Piston Set Standar RX-King",
      "Kampas Rem Depan GL Pro",
      "Filter Oli Mesin CB150R",
      "Bearing Roda Depan Vario",
      "Shock Absorber Belakang Supra",
      "Radiator Coolant Ninja 250",
      "Timing Belt Set Jazz RS",
      "Pompa Air Radiator Avanza",
      "Disc Brake Rotor Xenia",
      "Master Rem Atas Vixion"
    ][index],
    quality: ["Genuine", "OEM", "Aftermarket"][Math.floor(Math.random() * 3)],
    userImage: "/img/temp-josh.png",
    userName: [
      "John Doe",
      "Jane Smith",
      "Mike Johnson",
      "Sarah Wilson",
      "David Brown",
      "Emma Davis",
      "James Miller",
      "Lisa Anderson",
      "Robert Taylor",
      "Mary Martin"
    ][index],
    reviewTitle: [
      "Bagus sekali",
      "Recommended seller",
      "Sesuai deskripsi",
      "Pengiriman cepat",
      "Barang original",
      "Harga terjangkau",
      "Kualitas terjamin",
      "Puas dengan produk",
      "Seller responsive",
      "Barang berkualitas"
    ][index],
    reviewText: "Barang sesuai dengan deskripsi, pengiriman cepat, packing rapi dan aman. Seller sangat responsive. Sangat puas dengan pelayanannya. Recommended seller!",
    images: Array(3).fill().map(() => 
      "/img/temp-review.png"
    )
  }))
};

// Mock API functions
const mockAPI = {
  getStoreInfo: (storeId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(profileSellerBuyerData.storeInfo);
      }, 500);
    });
  },

  getProducts: ({
    productName = "",
    etalase = "",
    sort = "", // terbaru, terfavorit, terlaris 
    order = "" // ASC OR DESC
  }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredProducts = profileSellerBuyerData.products;
        // DIFILTER SESUAI
        // if (category === 'best-seller') {
        //   filteredProducts = profileSellerBuyerData.products.bestSeller;
        // } else if (category === 'favorite') {
        //   filteredProducts = profileSellerBuyerData.products.favorite;
        // } else if (category === 'new') {
        //   filteredProducts = profileSellerBuyerData.products.new;
        // } else if (category === 'etalase') {
        //   filteredProducts = profileSellerBuyerData.etalase.products;
        // } else {
        //   filteredProducts = [
        //     ...profileSellerBuyerData.products.bestSeller,
        //     ...profileSellerBuyerData.products.favorite,
        //     ...profileSellerBuyerData.products.new,
        //     ...profileSellerBuyerData.etalase.products
        //   ];
        // }

        // if (search) {
        //   filteredProducts = filteredProducts.filter(product => 
        //     product.title.toLowerCase().includes(search.toLowerCase())
        //   );
        // }

        // if (sort === 'newest') {
        //   filteredProducts.sort((a, b) => b.id - a.id);
        // } else if (sort === 'oldest') {
        //   filteredProducts.sort((a, b) => a.id - b.id);
        // }

        resolve(filteredProducts.slice(0, 10));
      }, 500);
    });
  },

  getEtalaseShowcases: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(profileSellerBuyerData.etalase);
      }, 500);
    });
  },

  getReviews: (storeId, filter = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredReviews = [...profileSellerBuyerData.reviews];
        
        // Filter berdasarkan rating jika ada
        if (filter.rating) {
          filteredReviews = filteredReviews.filter(review => 
            review.rating === filter.rating
          );
        }
        
        // Filter berdasarkan keberadaan media jika diminta
        if (filter.withMedia) {
          filteredReviews = filteredReviews.filter(review => 
            review.images && review.images.length > 0
          );
        }

        // Filter berdasarkan pencarian jika ada
        if (filter.search) {
          filteredReviews = filteredReviews.filter(review => 
            review.productName.toLowerCase().includes(filter.search.toLowerCase()) ||
            review.reviewText.toLowerCase().includes(filter.search.toLowerCase()) ||
            review.userName.toLowerCase().includes(filter.search.toLowerCase())
          );
        }

        // Sort berdasarkan tanggal jika diminta
        if (filter.sort === 'newest') {
          filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (filter.sort === 'oldest') {
          filteredReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        
        resolve(filteredReviews);
      }, 500);
    });
  },
};

export default mockAPI;