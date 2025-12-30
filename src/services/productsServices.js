import axios from "axios"

function ProductsServices(url,options) {
    async function fetchProductDetail(params){
        try {
            const response= await axios.get(process.env.NEXT_PUBLIC_GLOBAL_API+'v1/muatparts/buyer/product/'+params)
            return response.data
        } catch (error) {
            console.log(error,'ERROR FetchProducts')
        }
    }
    return {fetchProductDetail}
}
export default ProductsServices