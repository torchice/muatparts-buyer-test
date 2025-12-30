import style from "./ProductItem.module.scss";

const ProductPrice = ({
  discount = null,
  priceBeforeDiscount,
  priceAfterDiscount,
  qty = null,
}) => {
  return (
    <div>
      {discount ? (
        <>
          <div className="mb-1">
            <div className={style.priceBeforeDiscount}>
              {priceBeforeDiscount}
            </div>
            <div className={style.discount}>{discount}% OFF</div>
          </div>
          <h1 className={style.price}>
            {qty && `${qty} x`} {priceAfterDiscount}
          </h1>
        </>
      ) : (
        <h1 className={style.price}>
          {qty && `${qty} x`} {priceBeforeDiscount}
        </h1>
      )}
    </div>
  );
};

export default ProductPrice;
