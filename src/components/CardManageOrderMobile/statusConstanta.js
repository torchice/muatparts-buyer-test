export const statusOrder={
    Menunggu Pembayaran:{
        status:[
            {
                id:'batasPembayaran',
            }
        ]
    },
    menerimaPesanan:{
      status:[
        {
          id:'batasRespon',
          name:'Batas Respon'
        }
      ]
    },
    siapKirim:{
      status:[
        {
          id:'menungguPickUpKurir',
          name:'Menunggu Pick Up oleh Kurir'
        },
        {
          id:'perluDikirim',
          name:'Perlu Dikirim'
        },
      ]
    },
    dikirim:{
      status:[
        {
          id:'dalamPengiriman',
          name:'Dalam Pengiriman'
        },
        {
          id:'diterimaOlehPembeli',
          name:'Diterima oleh Pembeli'
        },
      ]
    },
  }