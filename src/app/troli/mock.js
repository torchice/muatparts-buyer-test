export const sellerItems = [
  {
    storeName: "Apple Store",
    voucher: '',
    sendFrom: "Jl. Raya Bogor, Jakarta",
    sendTo: "Graha BIP, Jakarta",
    items: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        selected: false,
        name: "iPhone 13 Pro",
        image: "https://prd.place/170?id=3.png",
        stock: 2,
        initialPrice: 15449000, 
        discount: 42, 
        finalPrice: 8999000, 
        variant: "Space Gray",
        liked: true,
        quantity: 3,
        note: "This is a note for iPhone 13 Pro Space Gray tolong dipacking kayu dan jangan sampai rusak"
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        selected: false,
        name: "MacBook Pro 2021",
        image: "https://prd.place/170?id=4.png",
        stock: 100,
        initialPrice: 24999000, 
        discount: 0, 
        finalPrice: 24999000, 
        variant: "Space Gray",
        liked: false,
        quantity: 1,
        note: ""
      }
    ]
  },
  {
    storeName: "Samsung Store",
    voucher: '',
    sendFrom: "Jl. Raya Bogor, Jakarta",
    sendTo: "Graha BIP, Jakarta",
    items: [
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        selected: false,
        name: "Samsung Galaxy S21",
        image: "https://prd.place/170?id=5.png",
        stock: 100,
        initialPrice: 14999000, 
        discount: 15, 
        finalPrice: 12749150, 
        variant: "Phantom Black",
        liked: false,
        quantity: 1,
        note: "This is a note"
      }
    ]
  },
  {
    storeName: "Xiaomi Store",
    voucher: '',
    sendFrom: "Jl. Raya Bogor, Jakarta",
    sendTo: "Graha BIP, Jakarta",
    items: [
      {
        id: '123e4567-e89b-12d3-a456-426614174003',
        selected: false,
        name: "Xiaomi Mi 11",
        image: "https://prd.place/170?id=6.png",
        stock: 100,
        initialPrice: 10999000, 
        discount: 20, 
        finalPrice: 8799200, 
        variant: "Midnight Gray",
        liked: false,
        quantity: 1,
        note: "This is a note"
      }
    ]
  }
]

export const voucherData = [
  {
    id: 1,
    name: "DISKONPENGGUNABARU",
    value: 200000,
    type: "muatparts",
    applied: true,
  },
  {
    id: 2,
    name: "DISKONTOKOBANGUNANBURIK",
    value: 200000,
    type: "seller",
    applied: false,
  },
]