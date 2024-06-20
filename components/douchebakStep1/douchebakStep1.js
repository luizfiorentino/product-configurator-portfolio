import React, { useState } from "react";
import styles from "./DouchebakStep1.module.css";
import { FaCheck } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { BsFillInfoSquareFill } from "react-icons/bs";

export default function DouchebakStep1({
  formStep,
  productData,
  length,
  setLength,
  width,
  setWidth,
  thicknessOption,
  setThicknessOption,
  thicknessOptions,
  lichtGezoetChecked,
  setLichtGezoetChecked,
  donkerGezoetChecked,
  setDonkerGezoetChecked,
  vlakkeOppervlakteChecked,
  setVlakkeOppervlakteChecked,
  ingefreesdeOppervlakteChecked,
  setIngefreesdeOppervlakteChecked,
  doucheBak,
  inputError,
  setInputError,
  addDouchebak,
  element,
  removeProduct,
  elementInfoArea,
  setElementInfoArea,
  elementInputs,
  setElementInputs,
  opmerking,
  setOpmerking,
  nextStep,
  stepBouchebak,
  setStepDouchebak,
  productMode,
  setProductMode,
  numberOfPieces,
  setNumberOfPieces,
}) {
  const nameProduct = productData ? productData.name : "";
  const editedNameProduct = nameProduct.replace(/\bmaat\b/i, "Maat");

  return (
    <div className={styles.externalContainer}>
      <h2 className={styles.productBanner}>{editedNameProduct}</h2>
      <div className={styles.desktopBlock}>
        <div className={styles.innerTop}>
          <div>
            <div className={styles.productImg}>
              <img
                src={productData && productData.images[0].src}
                className={styles.productImgInner}
              />
              <h4 className={styles.materialBannerTablet}>
                Materiaal: Belgische Hardsteen
              </h4>
            </div>
          </div>
          <h4 className={styles.materialBanner}>
            Materiaal: Belgische Hardsteen
          </h4>
          {doucheBak.length ? (
            <div className={styles.productsSummary}>
              <h4 className={styles.overviewBanner}>Douchebak</h4>
              <div className={styles.itemBanner}>
                <span className={styles.greenCheckIcon}>
                  <FaCheck />
                </span>
                <label>Lengte: {doucheBak.length} cm</label>
              </div>
              <div className={styles.itemBanner}>
                <span className={styles.greenCheckIcon}>
                  <FaCheck />
                </span>
                <label>Breedte: {doucheBak.width} cm</label>
              </div>
              <div className={styles.itemBanner}>
                <span className={styles.greenCheckIcon}>
                  <FaCheck />
                </span>
                <label>Variatie: {doucheBak.thickness}</label>
              </div>
              <h4 className={styles.optionBanner}>Oppervlakte afwerking</h4>
              <div className={styles.itemBanner}>
                <span className={styles.greenCheckIcon}>
                  <FaCheck />
                </span>
                <label>{doucheBak.afwerkingType}</label>
              </div>
              <h4 className={styles.optionBanner}>Toepassing</h4>
              <div className={styles.itemBanner}>
                <span className={styles.greenCheckIcon}>
                  <FaCheck />
                </span>
                <label>{doucheBak.toepassingType}</label>
              </div>
              {doucheBak.amountOfPieces > 1 ? (
                <>
                  <h4>Aantal</h4>
                  <div className={styles.itemBanner}>
                    <span className={styles.greenCheckIcon}>
                      <FaCheck />
                    </span>
                    <label>{doucheBak.amountOfPieces}</label>
                  </div>
                </>
              ) : (
                ""
              )}
              <div className={styles.deleteContainer}>
                <button
                  className={`${styles.deleteIcon} ${styles.spaceUp}`}
                  onClick={() => removeProduct("douchebak")}
                >
                  <div className={styles.deleteIconInner}>
                    {" "}
                    <IoTrashBin />
                  </div>
                </button>
              </div>
              {element.length && <div className={styles.divider}></div>}
            </div>
          ) : (
            ""
          )}
          {element.length && (
            <div className={styles.spaceUnder}>
              <h4
                className={`${styles.overviewBanner} ${styles.productsSummary}`}
              >
                Element
              </h4>
              <div className={styles.itemBanner}>
                <span className={styles.greenCheckIcon}>
                  <FaCheck />
                </span>
                <label>Lengte: {element.length} cm</label>
              </div>
              <div className={styles.itemBanner}>
                <span className={styles.greenCheckIcon}>
                  <FaCheck />
                </span>
                <label>Breedte: {element.width} cm</label>
              </div>
              <div className={styles.itemBanner}>
                <span className={styles.greenCheckIcon}>
                  <FaCheck />
                </span>
                <label>Dikte: {element.thickness}</label>
              </div>
              <h4 className={styles.optionBanner}>Oppervlakte afwerking</h4>
              <div className={styles.itemBanner}>
                <span className={styles.greenCheckIcon}>
                  <FaCheck />
                </span>
                <label>{element.afwerkingType}</label>
              </div>
              <h4 className={styles.optionBanner}>Toepassing</h4>
              <div className={styles.itemBanner}>
                <span className={styles.greenCheckIcon}>
                  <FaCheck />
                </span>
                <label>{element.toepassingType}</label>
              </div>
              {element.amountOfPieces > 1 ? (
                <>
                  <h4>Aantal</h4>
                  <div className={styles.itemBanner}>
                    <span className={styles.greenCheckIcon}>
                      <FaCheck />
                    </span>
                    <label>{element.amountOfPieces}</label>
                  </div>
                </>
              ) : (
                ""
              )}
              <div className={styles.deleteContainer}>
                <button
                  className={`${styles.deleteIcon} ${styles.spaceUp}`}
                  onClick={() => removeProduct("element")}
                >
                  <div className={styles.deleteIconInner}>
                    <IoTrashBin />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
        {(!doucheBak.length && stepBouchebak === 1) |
        (!element.length && stepBouchebak === 1 && elementInputs) ? (
          <div className={styles.inputsContainer}>
            <label className={styles.inputLabel}>
              <span className={`${styles.bold} ${styles.afmetingBanner}`}>
                {`${productMode} Stap 1: Afmetingen`}
              </span>
            </label>
            <label className={styles.inputLabel}>
              <span className={styles.bold}> Lengte (cm)</span>
              <span className={styles.red}>*</span>
            </label>
            <input
              className={styles.inputField}
              type="number"
              placeholder="lengte in cm"
              value={length}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (
                  inputValue === "" ||
                  (!isNaN(inputValue) && inputValue > 0)
                ) {
                  setLength(inputValue);
                }
              }}
            />
            {inputError && length < 5 && (
              <p className={styles.errorMessage}>*Minimale lengte: 5 cm</p>
            )}
            <label className={styles.inputLabel}>
              <span className={styles.bold}> Breedte (cm)</span>
              <span className={styles.red}>*</span>
            </label>
            <input
              className={styles.inputField}
              type="number"
              placeholder="breedte in cm"
              value={width}
              //onChange={(e) => setWidth(e.target.value)}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (
                  inputValue === "" ||
                  (!isNaN(inputValue) && inputValue > 0)
                ) {
                  setWidth(inputValue);
                }
              }}
            />
            {inputError && width < 5 && (
              <p className={styles.errorMessage}>*Minimale breedte: 5 cm</p>
            )}
            <label className={styles.inputLabel}>
              <span className={styles.bold}> Diktevariatie</span>
              <span className={styles.red}>*</span>
            </label>
            <select
              className={`${styles.inputField} ${styles.selectContainer}`}
              value={thicknessOption}
              onChange={(e) => {
                setThicknessOption(e.target.value);
              }}
            >
              <option value={""} className={styles.optionContainer}>
                -- Kies --
              </option>
              {thicknessOptions &&
                thicknessOptions.map((option, index) => (
                  <option key={index} value={option.name}>
                    {`${option} cm`}
                  </option>
                ))}
            </select>
            {/* <label className={styles.inputLabel}>
              <span className={styles.bold}>Aantal</span>
            </label>
            <input
              className={styles.inputField}
              type="number"
              value={numberOfPieces}
              //onChange={(e) => setWidth(e.target.value)}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (
                  inputValue === "" ||
                  (!isNaN(inputValue) && inputValue > 0)
                ) {
                  setNumberOfPieces(inputValue);
                }
              }}
            /> */}
            <label className={styles.inputLabel}>
              <span className={styles.bold}>Hoeveelheid stuks</span>
            </label>
            <input
              className={styles.inputField}
              type="number"
              value={numberOfPieces}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Check if the input value is a positive number
                if (/^\d+$/.test(inputValue) && inputValue > 0) {
                  setNumberOfPieces(inputValue);
                }
              }}
            />

            <div className={styles.addDouchebakSingle}>
              <button
                onClick={() => {
                  if ((length < 5) | (width < 5)) {
                    setInputError(true);
                    return;
                  }
                  setStepDouchebak(2);
                }}
                disabled={
                  (length === "") | (width === "") | (thicknessOption === "")
                }
                className={
                  (length === "") | (width === "") | (thicknessOption === "")
                    ? `${styles.inactiveButton} ${styles.spaceUnder}`
                    : `${styles.sumbitButton} ${styles.spaceUnder}`
                }
              >
                Volgende
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className={styles.stap2Container}>
          {(!doucheBak.length && stepBouchebak === 2) |
          (!element.length && stepBouchebak === 2 && elementInputs) ? (
            <div className={styles.afwerkingToepassingExternal}>
              <div className={styles.afwerkingAndToepassing}>
                <div className={styles.afwerkingToepassingTop}>
                  <label
                    className={`${styles.inputLabel} ${styles.extraPadding}`}
                  >
                    <span className={`${styles.bold} ${styles.afmetingBanner}`}>
                      {`${productMode}  Stap 2: Oppervlakte afwerking`}
                      <span className={styles.red}>*</span>
                    </span>
                  </label>
                  <div
                    className={`${styles.checkboxesContainer} ${styles.sideBySide}`}
                  >
                    <div>
                      <div className={styles.imageContainer}>
                        <img
                          className={styles.afwerkingThumbnail}
                          src={productData && productData.images[4].src}
                          alt="product variatie afbeelding"
                        />
                      </div>
                      <label
                        className={`${styles.afwerkingBanner} ${styles.toepassingLabel}`}
                      >
                        <input
                          type="checkbox"
                          checked={donkerGezoetChecked}
                          onChange={() => {
                            setDonkerGezoetChecked(!donkerGezoetChecked);
                            setLichtGezoetChecked(false);
                          }}
                        />
                        Donker gezoet
                      </label>
                    </div>
                    <div>
                      <div className={styles.imageContainer}>
                        <img
                          className={styles.afwerkingThumbnail}
                          src={productData && productData.images[2].src}
                          alt="product variatie afbeelding"
                        />
                      </div>
                      <label
                        className={`${styles.toepassingLabel} ${styles.extraPaddingSmall}`}
                      >
                        <input
                          type="checkbox"
                          checked={lichtGezoetChecked}
                          onChange={() => {
                            setLichtGezoetChecked(!lichtGezoetChecked);
                            setDonkerGezoetChecked(false);
                          }}
                        />
                        Licht gezoet**
                      </label>
                    </div>
                  </div>{" "}
                  <label
                    className={`${styles.red} ${styles.spacingRed} ${styles.paddingBottomLarge}`}
                  >
                    **Let op: deze optie is vlekke gevoelieg
                  </label>
                </div>
              </div>
              <div
                className={`${styles.addDouchebak} ${styles.buttonMarginUp}`}
              >
                <button
                  onClick={() => {
                    if ((length < 5) | (width < 5)) {
                      setInputError(true);
                      return;
                    }
                    setStepDouchebak(3);
                  }}
                  disabled={!donkerGezoetChecked && !lichtGezoetChecked}
                  className={
                    !donkerGezoetChecked && !lichtGezoetChecked
                      ? `${styles.inactiveButton} ${styles.spaceUnderLarge}`
                      : `${styles.sumbitButton} ${styles.spaceUnderLarge}`
                  }
                >
                  Volgende
                </button>
                <button
                  className={styles.backButton}
                  onClick={() => setStepDouchebak(stepBouchebak - 1)}
                >
                  Vorig
                </button>
              </div>
            </div>
          ) : (
            ""
          )}

          {(!doucheBak.length && stepBouchebak === 3) |
          (!element.length && stepBouchebak === 3 && elementInputs) ? (
            <div className={styles.toepassingExternal}>
              <div className={styles.toepassingContainer}>
                <div className={styles.checkboxesContainerElement}>
                  <h4 className={`${styles.bold} ${styles.afmetingBanner}`}>
                    {`${productMode}  Stap 3: Toepassing`}

                    <span className={styles.red}>*</span>
                  </h4>
                  <label className={styles.toepassingLabel}>
                    <input
                      type="checkbox"
                      checked={vlakkeOppervlakteChecked}
                      onChange={() => {
                        setVlakkeOppervlakteChecked(!vlakkeOppervlakteChecked);
                        setIngefreesdeOppervlakteChecked(false);
                      }}
                    />
                    Vlakke oppervlakte, rondom afgewerkt
                  </label>
                  <label className={styles.toepassingLabel}>
                    <input
                      type="checkbox"
                      checked={ingefreesdeOppervlakteChecked}
                      onChange={() => {
                        setIngefreesdeOppervlakteChecked(
                          !ingefreesdeOppervlakteChecked
                        );
                        setVlakkeOppervlakteChecked(false);
                      }}
                    />
                    Ingefreesde oppervlakte, rondom afgewerkt
                  </label>
                </div>
              </div>
              <div
                className={`${styles.addDouchebak} ${styles.buttonMarginUp}`}
              >
                <button
                  onClick={() => {
                    if ((length < 5) | (width < 5)) {
                      setInputError(true);
                      return;
                    }
                    addDouchebak(
                      !elementInputs ? "doucheBakOption" : "elementOption"
                    );
                  }}
                  disabled={
                    (length === "") |
                    (width === "") |
                    (thicknessOption === "") |
                    (!vlakkeOppervlakteChecked &&
                      !ingefreesdeOppervlakteChecked) |
                    (!donkerGezoetChecked && !lichtGezoetChecked)
                  }
                  className={
                    (length === "") |
                    (width === "") |
                    (thicknessOption === "") |
                    (!vlakkeOppervlakteChecked &&
                      !ingefreesdeOppervlakteChecked) |
                    (!donkerGezoetChecked && !lichtGezoetChecked)
                      ? `${styles.inactiveButton} ${styles.spaceUnderLarge}`
                      : `${styles.sumbitButton} ${styles.spaceUnderLarge}`
                  }
                >
                  Bevestigen
                </button>
                <button
                  className={styles.backButton}
                  onClick={() => setStepDouchebak(stepBouchebak - 1)}
                >
                  Vorig
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {!element.length && (
        <div
          className={styles.elementInfoIcon}
          onClick={() => setElementInfoArea(!elementInfoArea)}
        >
          <h4 className={styles.addElementBanner}>Element toevoegen</h4>
          <div className={styles.hoverMe}>
            <BsFillInfoSquareFill />
          </div>
        </div>
      )}
      {!element.length && elementInfoArea && (
        <label className={`${styles.spaceUnder} ${styles.elementToelichting}`}>
          Met het element kunt u een extra stuk bewerkt natuursteen toevoegen
          naast de douchebak.
        </label>
      )}
      {!element.length && (
        <button
          onClick={() => setElementInputs(!elementInputs)}
          className={`${styles.elementButton} ${styles.spaceUnderElement}`}
        >
          {" "}
          Klik hier
        </button>
      )}

      <div className={`${styles.inputContainer} ${styles.opmerkingContainer}`}>
        <label className={`${styles.bold} ${styles.shortSpaceUnder}`}>
          Opmerking
        </label>{" "}
        <textarea
          value={opmerking}
          //onChange={(e) => handleInputChange("Opmerking", e.target.value)}
          onChange={(e) => setOpmerking(e.target.value)}
          className={styles.textArea}
        />
      </div>
      <div className={styles.nextButton}>
        <button
          disabled={!doucheBak.length && !element.length}
          className={
            doucheBak.length | element.length
              ? styles.sumbitButton
              : styles.inactiveButton
          }
          onClick={nextStep}
        >
          Volgende
        </button>
      </div>
    </div>
  );
}

// {formStep === 1 && !doucheBak.length && (
//   <div className={styles.inputsContainer}>
//     <div className={styles.inputContainerInner}>
//       <label className={styles.inputLabel}>
//         Lengte (cm)<span className={styles.red}>*</span>
//       </label>
//       <input
//         className={styles.inputField}
//         type="number"
//         placeholder="lengte in cm"
//         value={length}
//         // onChange={(e) => {
//         //   setLength(e.target.value);
//         // }}
//         onChange={(e) => {
//           const inputValue = e.target.value;
//           if (
//             inputValue === "" ||
//             (!isNaN(inputValue) && inputValue > 0)
//           ) {
//             setLength(inputValue);
//           }
//         }}
//       />
//       {inputError && length < 5 && (
//         <p className={styles.errorMessage}>* Minimale lengte: 5 cm</p>
//       )}
//       <label className={styles.inputLabel}>
//         Breedte (cm)<span className={styles.red}>*</span>
//       </label>
//       <input
//         className={styles.inputField}
//         type="number"
//         placeholder="breedte in cm"
//         value={width}
//         //onChange={(e) => setWidth(e.target.value)}
//         onChange={(e) => {
//           const inputValue = e.target.value;
//           if (
//             inputValue === "" ||
//             (!isNaN(inputValue) && inputValue > 0)
//           ) {
//             setWidth(inputValue);
//           }
//         }}
//       />
//       {inputError && width < 5 && (
//         <p className={styles.errorMessage}>
//           * Minimale breedte: 5 cm
//         </p>
//       )}
//       <label className={styles.inputLabel}>
//         Dikte<span className={styles.red}>*</span>
//       </label>
//       <select
//         className={`${styles.inputField} ${styles.selectContainer}`}
//         value={thicknessOption}
//         onChange={(e) => {
//           setThicknessOption(e.target.value);
//         }}
//       >
//         <option value={""} className={styles.optionContainer}>
//           -- Kies --
//         </option>
//         {thicknessOptions &&
//           thicknessOptions.map((option, index) => (
//             <option key={index} value={option.name}>
//               {`${option} cm`}
//             </option>
//           ))}
//       </select>
//     </div>
//     <h4 className={styles.extraOptionBanner}>
//       Oppervlakte afwerking <span className={styles.red}>*</span>
//     </h4>
//     {/* Vraag: "vlakke oppervlakte, rondom afgewerkt" is één optie
// of "vlakke" heeft tween (sub) opties: 1) "oppervlakte" en 2) "rondom afgewerkt"?
// En hetzelfde voor "ingefreesde"?
// */}
//     <div className={styles.checkboxesContainer}>
//       <div className={styles.imageContainer}>
//         <img
//           className={styles.afwerkingThumbnail}
//           src={productData && productData.images[4].src}
//           alt="product variatie afbeelding"
//         />
//       </div>
//       <label
//         className={`${styles.afwerkingBanner} ${styles.toepassingLabel}`}
//       >
//         <input
//           type="checkbox"
//           checked={donkerGezoetChecked}
//           onChange={() => {
//             setDonkerGezoetChecked(!donkerGezoetChecked);
//             setLichtGezoetChecked(false);
//           }}
//         />
//         Donker gezoet
//       </label>
//       {/* {productData.images.map((image) => (
//     <img src={image.src} />
//   ))} */}
//       <div className={styles.imageContainer}>
//         <img
//           className={styles.afwerkingThumbnail}
//           src={productData && productData.images[2].src}
//           alt="product variatie afbeelding"
//         />
//       </div>
//       <label className={styles.toepassingLabel}>
//         <input
//           type="checkbox"
//           checked={lichtGezoetChecked}
//           onChange={() => {
//             setLichtGezoetChecked(!lichtGezoetChecked);
//             setDonkerGezoetChecked(false);
//           }}
//         />
//         Licht gezoet**
//       </label>
//       <label className={styles.red}>
//         **Let op: deze optie is vlekke gevoelieg
//       </label>
//     </div>

//     <h4 className={styles.extraOptionBanner}>
//       Toepassing <span className={styles.red}>*</span>
//     </h4>
//     <div className={styles.checkboxesContainerElement}>
//       <label className={styles.toepassingLabel}>
//         <input
//           type="checkbox"
//           checked={vlakkeOppervlakteChecked}
//           onChange={() => {
//             setVlakkeOppervlakteChecked(!vlakkeOppervlakteChecked);
//             setIngefreesdeOppervlakteChecked(false);
//           }}
//         />
//         Vlakke oppervlakte, rondom afgewerkt
//       </label>
//       <label className={styles.toepassingLabel}>
//         <input
//           type="checkbox"
//           checked={ingefreesdeOppervlakteChecked}
//           onChange={() => {
//             setIngefreesdeOppervlakteChecked(
//               !ingefreesdeOppervlakteChecked
//             );
//             setVlakkeOppervlakteChecked(false);
//           }}
//         />
//         Ingefreesde oppervlakte, rondom afgewerkt
//       </label>
//     </div>
//     <button
//       onClick={() => {
//         if ((length < 5) | (width < 5)) {
//           setInputError(true);
//           return;
//         }
//         addDouchebak("doucheBakOption");
//       }}
//       disabled={
//         (length === "") |
//         (width === "") |
//         (thicknessOption === "") |
//         (!vlakkeOppervlakteChecked &&
//           !ingefreesdeOppervlakteChecked) |
//         (!donkerGezoetChecked && !lichtGezoetChecked)
//       }
//       className={
//         (length === "") |
//         (width === "") |
//         (thicknessOption === "") |
//         (!vlakkeOppervlakteChecked &&
//           !ingefreesdeOppervlakteChecked) |
//         (!donkerGezoetChecked && !lichtGezoetChecked)
//           ? `${styles.inactiveButton} ${styles.spaceUnder}`
//           : `${styles.sumbitButton} ${styles.spaceUnder}`
//       }
//     >
//       Bevestigen
//     </button>
//   </div>
// )}
// test debug

//element inputs
// {doucheBak.length ? (
//   <div className={styles.productsSummary}>
//     <h4 className={styles.overviewBanner}>Douchebak</h4>
//     <div className={styles.itemBanner}>
//       <span className={styles.greenCheckIcon}>
//         <FaCheck />
//       </span>
//       <label>Lengte: {doucheBak.length} cm</label>
//     </div>
//     <div className={styles.itemBanner}>
//       <span className={styles.greenCheckIcon}>
//         <FaCheck />
//       </span>
//       <label>Breedte: {doucheBak.width} cm</label>
//     </div>
//     <div className={styles.itemBanner}>
//       <span className={styles.greenCheckIcon}>
//         <FaCheck />
//       </span>
//       <label>Variatie: {doucheBak.thickness}</label>
//     </div>
//     <h4>Oppervlakte afwerking</h4>
//     <div className={styles.itemBanner}>
//       <span className={styles.greenCheckIcon}>
//         <FaCheck />
//       </span>
//       <label>{doucheBak.afwerkingType}</label>
//     </div>
//     <h4>Toepassing</h4>
//     <div className={styles.itemBanner}>
//       <span className={styles.greenCheckIcon}>
//         <FaCheck />
//       </span>
//       <label>{doucheBak.toepassingType}</label>
//     </div>
//     <div className={styles.deleteContainer}>
//       <button
//         className={`${styles.deleteIcon} ${styles.spaceUp}`}
//         onClick={() => removeProduct("douchebak")}
//       >
//         <div className={styles.deleteIconInner}>
//           {" "}
//           <IoTrashBin />
//         </div>
//       </button>
//     </div>
//     {element.length && <div className={styles.divider}></div>}
//   </div>
// ) : (
//   ""
// )}
