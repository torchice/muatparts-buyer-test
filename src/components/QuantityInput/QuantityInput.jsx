import { Minus, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function QuantityInput({
  maxStock = 5,
  minQuantity = 1,
  initialValue = 1,
  onChange,
}) {
  const [quantity, setQuantity] = useState();

  useEffect(() => {
    // Ensure initial value is within bounds
    const boundedInitialValue = Math.max(
      minQuantity,
      Math.min(initialValue, maxStock)
    );
    setQuantity(boundedInitialValue);
  }, [initialValue, minQuantity, maxStock]);

  const prevQuantityRef = useRef();

  useEffect(() => {
    if (prevQuantityRef.current !== quantity) {
      onChange(quantity);
    }
    prevQuantityRef.current = quantity;
  }, [quantity, onChange]);

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > minQuantity) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      if (value < minQuantity) {
        setQuantity(minQuantity);
      } else if (value > maxStock) {
        setQuantity(maxStock);
      } else {
        setQuantity(value);
      }
    }
  };

  return (
    <div className="flex items-start text-xs font-medium leading-tight text-center text-black whitespace-nowrap">
      <div className="flex gap-2 items-center px-3 py-2 bg-white rounded-md border border-solid border-neutral-500 hover:border-primary-700 min-h-[32px] w-[110px]">
        <button
          onClick={handleDecrement}
          disabled={quantity <= minQuantity}
          aria-label="Decrease quantity"
          className={`object-contain shrink-0 self-stretch my-auto w-4 aspect-square ${
            quantity <= minQuantity
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-primary-700"
          }`}
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={minQuantity}
          max={maxStock}
          aria-label="Quantity"
          className="flex-1 shrink self-stretch my-auto basis-0 text-center focus:outline-none"
        />
        <button
          onClick={handleIncrement}
          disabled={quantity >= maxStock}
          aria-label="Increase quantity"
          className={`object-contain shrink-0 self-stretch my-auto w-4 aspect-square ${
            quantity >= maxStock
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-primary-700"
          }`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}