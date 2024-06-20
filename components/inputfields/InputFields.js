import React from "react";
import { useState } from "react";
import styles from "./InputFields.module.css";
import { FaCheck } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";

export default function InputFields({
  formStep,
  setFormStep,
  productName,
  productPrefix,
  getter,
  setter,
  productFormula,
  arrayOfProducts,
  setArrayOfProducts,
  width,
  length,
  variation,
  uitsparing,
  aantal,
  dropdownOptions,
  opmerking,
  setOpmerking,
}) {
  const [productSpecifications, setProductSpecifications] = useState({
    name: productName,
    variation: "",
    width: 0,
    length: 0,
    variation: "",
    aantal: 1,
    uitsparing: 0,
  });

  const [displayButton, setDisplayButton] = useState(true);
  const [addInputs, setAddInputs] = useState(true);
  const [inputError, setInputError] = useState(false);
  const deleteProduct = (index) => {
    setArrayOfProducts((prevProducts) =>
      prevProducts.filter((_, i) => i !== index)
    );
  };

  const extraProduct = () => {
    setDisplayButton(true);
    setAddInputs(true);
  };

  const addProduct = () => {
    setAddInputs(true);
    setDisplayButton(true);
    if (
      (productSpecifications.length < 5) |
      (productSpecifications.width < 5)
    ) {
      return;
    }

    const unitPrice = productFormula(
      productSpecifications.width,
      productSpecifications.length,
      productSpecifications.variation,
      productSpecifications.uitsparing
    );

    const newProduct = {
      name: productName,
      width: productSpecifications.width,
      length: productSpecifications.length,
      variation: productSpecifications.variation,
      uitsparing: productSpecifications.uitsparing,
      priceUitsparingen: unitPrice.priceUitsparingen,
      aantal: productSpecifications.aantal,
      pricePerUnit: unitPrice.pricePerUnit,
      totalPrice: unitPrice.pricePerUnit * productSpecifications.aantal,
    };
    setter({
      ...getter,
      width: productSpecifications.width,
      length: productSpecifications.length,
      variation: productSpecifications.variation,
      uitsparing: uitsparing,
      aantal: productSpecifications.aantal,
    });
    arrayOfProducts.push(newProduct);
    setInputError(false);
  };

  return (
    <div className={styles.extranalContainer}>
      <div className={styles.spaceUp}></div>
      {arrayOfProducts.length ? (
        <div className={styles.productList}>
          {arrayOfProducts.map((product, index) => (
            <div key={index} className={styles.KBExternalContainer}>
              <div className={styles.kbMeasures}>
                <p className={`${styles.bold} ${styles.KBLabel} `}>
                  {arrayOfProducts.length > 1
                    ? `Vensterbank ${index + 1}`
                    : "Vensterbank"}
                </p>
                <div className={styles.itemBanner}>
                  <span className={styles.greenCheckIcon}>
                    <FaCheck />
                  </span>
                  <label>
                    <span className={styles.bold}>Variatie: </span>
                    {product.variation}
                  </label>
                </div>
                <div className={styles.itemBanner}>
                  <span className={styles.greenCheckIcon}>
                    <FaCheck />
                  </span>
                  <span className={styles.bold}>Bankbreedte: </span>
                  <label> {product.width} cm</label>
                </div>
                <div className={styles.itemBanner}>
                  <span className={styles.greenCheckIcon}>
                    <FaCheck />
                  </span>
                  <label>
                    <span className={styles.bold}>Banklengte:</span>{" "}
                    {product.length} cm
                  </label>
                </div>

                {product.uitsparing ? (
                  <div className={styles.itemBanner}>
                    <span className={styles.greenCheckIcon}>
                      <FaCheck />
                    </span>
                    <label>
                      {" "}
                      <span className={styles.bold}>
                        Aantal uitsparingen:{" "}
                      </span>{" "}
                      {product.uitsparing}
                    </label>
                  </div>
                ) : (
                  <div className={styles.itemBanner}>
                    {"\u2022"}
                    <label>Geen uitsparing gekozen</label>
                  </div>
                )}
                {product.aantal > 1 ? (
                  <div className={styles.itemBanner}>
                    <span className={styles.greenCheckIcon}>
                      <FaCheck />
                    </span>
                    <label>
                      {" "}
                      <span className={styles.bold}>
                        Aantal vensterbanken:{" "}
                      </span>{" "}
                      {product.aantal}
                    </label>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.deleteButtonContainer}>
                <button
                  onClick={() => deleteProduct(index)}
                  className={styles.deleteButton}
                >
                  {" "}
                  <div className={styles.binIconInner}>
                    {" "}
                    <IoTrashBin className={styles.deleteIcon} />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
      {arrayOfProducts.length === 0 || addInputs ? (
        <div className={styles.inputContainer}>
          <div className={styles.inputsUpperSection}>
            <label className={styles.measureLabel}>
              {productPrefix}breedte<span className={styles.red}>*</span>{" "}
            </label>
            <input
              type="number"
              placeholder="breedte in cm"
              value={
                productSpecifications.width === 0
                  ? ""
                  : productSpecifications.width
              }
              onChange={(e) => {
                const inputValue = e.target.value;
                if (
                  inputValue === "" ||
                  (!isNaN(inputValue) && inputValue > 0)
                ) {
                  setProductSpecifications({
                    ...productSpecifications,
                    width: Number(e.target.value),
                  });
                }
              }}
              className={styles.measureInput}
            />
            {inputError && productSpecifications.width < 5 && (
              <p className={styles.errorMessage}>* Minimale breedte: 5 cm</p>
            )}
            <label className={styles.measureLabel}>
              {productPrefix}lengte<span className={styles.red}>*</span>{" "}
            </label>
            <input
              type="number"
              placeholder="lengte in cm"
              value={
                productSpecifications.length === 0
                  ? ""
                  : productSpecifications.length
              }
              onChange={(e) => {
                const inputValue = e.target.value;
                if (
                  inputValue === "" ||
                  (!isNaN(inputValue) && inputValue > 0)
                ) {
                  setProductSpecifications({
                    ...productSpecifications,
                    length: Number(e.target.value),
                  });
                }
              }}
              className={styles.measureInput}
            />
            {inputError && productSpecifications.length < 5 && (
              <p className={styles.errorMessage}>* Minimale breedte: 5 cm</p>
            )}
            <div className={`${styles.thicknessSelector} `}>
              <label className={styles.measureLabel}>
                Dikte variatie<span className={styles.red}>*</span>{" "}
              </label>
              <div className={styles.thicknessSelector}>
                <select
                  value={productSpecifications.variation}
                  onChange={(e) =>
                    setProductSpecifications({
                      ...productSpecifications,
                      variation: e.target.value,
                    })
                  }
                  className={styles.selectTag}
                >
                  <option>-- Kies --</option>
                  {dropdownOptions
                    ? dropdownOptions.map((option, index) => (
                        <option key={index}>{option}</option>
                      ))
                    : ""}
                </select>
                {inputError && productSpecifications.variation === "" && (
                  <p className={styles.errorMessage}>
                    * Kiest u een optie a.u.b.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className={styles.lowerInputs}>
            <label className={styles.measureLabel}>Aantal Uitsparingen</label>
            <input
              type="number"
              value={productSpecifications.uitsparing}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (
                  inputValue === "" ||
                  (!isNaN(inputValue) && inputValue > 0)
                ) {
                  setProductSpecifications({
                    ...productSpecifications,
                    uitsparing: Number(e.target.value),
                  });
                }
              }}
              className={styles.measureInput}
            />
            <label className={styles.measureLabel}>
              Aantal Vensterbanken<span className={styles.red}>*</span>{" "}
            </label>
            <input
              type="number"
              value={productSpecifications.aantal}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue !== "" && !isNaN(inputValue) && inputValue > 0) {
                  setProductSpecifications({
                    ...productSpecifications,
                    aantal: Number(inputValue),
                  });
                }
              }}
              className={styles.measureInput}
            />
          </div>
        </div>
      ) : (
        ""
      )}

      <div className={`${styles.opmerkingContainer}`}>
        <label className={`${styles.bold} ${styles.shortSpaceUnder}`}>
          Opmerking
        </label>
        <textarea
          value={opmerking}
          onChange={(e) => setOpmerking(e.target.value)}
          className={styles.textArea}
        />
      </div>

      <div className={styles.toevoegenAndExtraButtons}>
        {(arrayOfProducts.length === 0 || displayButton) && (
          <button
            onClick={() => {
              if (
                (productSpecifications.length < 5) |
                (productSpecifications.width < 5)
              ) {
                setInputError(true);
                return;
              }
              addProduct();
              setAddInputs(false);
              setDisplayButton(false);
            }}
            className={
              (productSpecifications.length === 0) |
              (productSpecifications.width === 0) |
              (productSpecifications.variation === "")
                ? `${styles.inactiveButton}`
                : `${styles.sumbitButton} `
            }
            disabled={
              (productSpecifications.length === 0) |
              (productSpecifications.width === 0) |
              (productSpecifications.variation === "")
            }
          >
            Toevoegen
          </button>
        )}
        {!displayButton ? (
          <button
            onClick={extraProduct}
            className={
              !arrayOfProducts.length
                ? `${styles.standardButton}`
                : `${styles.keukenBladInactive}`
            }
            disabled={!arrayOfProducts.length}
          >
            Extra {productPrefix}
          </button>
        ) : (
          ""
        )}
        {!displayButton || arrayOfProducts.length ? (
          <button
            onClick={() => setFormStep(2)}
            className={styles.sumbitButton}
          >
            Volgende
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
