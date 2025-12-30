
function CategoriesServices() {
    async function fetchCategories(params) {
        try {
            const response = axios.get(process.env.NEXT_PUBLIC_GLOBAL_API+'v1/muatparts/product_category_list/'+params)
            return (await response).data
        } catch (error) {
            return []
        }
    }
    return {fetchCategories}
}
export default CategoriesServices