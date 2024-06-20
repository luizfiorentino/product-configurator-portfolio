import React from "react";
import styles from "./ListAddedProducts.module.css";
import { array } from "zod";

export default function ListAddedProducts({
  arrayOfProducts,
  setArrayOfProducts,
}) {
  const deleteProduct = (index) => {
    setArrayOfProducts((prevProducts) =>
      prevProducts.filter((_, i) => i !== index)
    );
  };

  return arrayOfProducts ? (
    <div>
      {arrayOfProducts.map((product, index) => (
        <div key={index}>
          <p>
            {arrayOfProducts.length > 1
              ? `Vensterbank ${index + 1}`
              : "Vensterbank"}
          </p>
          <p>Bankbreedte: {product.width} cm</p>
          <p>Banklengte: {product.length} cm</p>
          {product.aantal > 1 ? <p>Aantal: {product.aantal}</p> : ""}
          <button onClick={() => deleteProduct(index)}>Remove</button>
        </div>
      ))}
    </div>
  ) : (
    <p>Geen product toegevoegd</p>
  );
}
