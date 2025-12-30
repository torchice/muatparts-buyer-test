export const resPaymentMethods = {
	"Message": {
		"Code": 200,
		"Text": "OK"
	},
	"Data": [
		{
			"channel": "VA",
			"category": "Virtual Account",
			"icon": "va-channel-icon.png",
			"methods": [
				{
					"id": "3979a72f-5aa6-41d3-91cf-1d9d555fab8b",
					"name": "BCA Virtual Account terpanjang di muka bumi hingga tak cukup",
					"code": "bca",
					"icon": "https://i.pinimg.com/736x/29/61/0b/29610b7dbf7e4ea5070626923a12cba8.jpg",
					"paymentType": "bank_transfer"
				},
				{
					"id": "ab419aa7-3516-4d7a-a1a4-158bb3b090cf",
					"name": "Mandiri Virtual Account",
					"code": "mandiri",
					"icon": "mandiri.png",
					"paymentType": "echannel"
				},
				{
					"id": "6ddfd8f7-0d03-4419-8de3-0fe1e9c0c332",
					"name": "BNI Virtual Account",
					"code": "bni",
					"icon": "bni.png",
					"paymentType": "bank_transfer"
				},
				{
					"id": "4ab586cc-baa1-4ac6-a9d5-27fbcbab5e55",
					"name": "BRI Virtual Account",
					"code": "bri",
					"icon": "bri.png",
					"paymentType": "bank_transfer"
				},
				{
					"id": "ccf90ac8-9c5d-4fec-9f7f-71502de94cf2",
					"name": "Permata Virtual Account",
					"code": "permata",
					"icon": "permata.png",
					"paymentType": "permata"
				},
				{
					"id": "81cdd768-b357-4f85-8d73-7366e872f00d",
					"name": "CIMB Virtual Account",
					"code": "cimb",
					"icon": "cimb.png",
					"paymentType": "bank_transfer"
				}
			]
		},
		{
			"channel": "CREDIT_CARD",
			"category": "Kartu Kredit",
			"icon": "credit-card-channel-icon.png",
			"methods": [
				{
					"id": "e3221eaf-0c31-46de-8619-01e08f92f4c3",
					"name": "Credit Card",
					"code": "credit_card",
					"icon": "credit-card.png",
					"paymentType": "credit_card"
				}
			]
		}
	],
	"Type": "/v1/payment/methods"
}