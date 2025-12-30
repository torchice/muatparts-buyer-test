
import CategoriesPage from '@/containers/CategoriesPage/CategoriesPage';
import DetailProductPage from '@/containers/DetailProductPage/DetailProductPage';
import CategoriesServices from '@/services/categoriesServices';
import ProductsServices from '@/services/productsServices';
import {validate} from 'uuid'
async function Page(props) {
    const {fetchCategories}=CategoriesServices()
    const {fetchProductDetail}=ProductsServices()
    const fetchCategoriesData = validate(props?.params?.routes?.[0])?await fetchCategories(props?.params?.routes?.toString()?.replaceAll(',','/')):[]
    const fetchProductDetailData=!validate(props?.params?.routes?.[0])?await fetchProductDetail(`${props?.params?.routes?.[0]?.toString()?.replaceAll(' ','%2f')}/${props?.params?.routes?.slice(1)?.toString()?.replaceAll(",",'%2f')?.replaceAll('/','%2f')}`):{}
 
    if(validate(props?.params?.routes?.[0])) return <CategoriesPage allCategories={fetchCategoriesData} params={props?.params?.routes} searchParams={props?.searchParams} {...props} />
    if(!validate(props?.params?.routes?.[0])) return <DetailProductPage product={fetchProductDetailData} params={props?.params?.routes?.toString()?.replaceAll(',','/')} />
}

export default Page;
  