import ProductSlider from "./ProductSlider";

// LBM - OLIVER - PASSING STATE LOADING UNTUK SKELETON - MP - 020
const ProductSection = ({ title, products, isLoading, sellerProfile }) => (
  <ProductSlider 
    title={title}
    products={products}
    sellerProfile={sellerProfile}
    isLoading={isLoading}
  />
)

export default ProductSection