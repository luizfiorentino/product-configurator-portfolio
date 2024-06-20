import React, { useState } from "react";
import styles from "./KeukenbladForm.module.css";
import stylesRoot from "../../styles/Home.module.css";
import {
  calculateAfwerkingen,
  calculateStollewandPrice,
  priceStollenwanden,
} from "../../utils";
import { IoTrashBin } from "react-icons/io5";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import Header from "../header/Header";

export default function KeukenbladForm({
  width,
  setWidth,
  length,
  setLength,
  selectedOption,
  setSelectedOption,
  setSelectedOption1,
  variationOption,
  priceCalculation,
  thickness,
  keukenBladen,
  setKeukenBladen,
  formStep,
  setFormStep,
  selectedAfwerking,
  setSelectedAfwerking,
  displayButton,
  setDisplayButton,
  productData,
  setStollewandOption,
  stollenwandArray,
  setStollenwandArray,
}) {
  const [editMode, setEditMode] = useState(null);
  const [addInputs, setAddInputs] = useState(false);
  const [displayEditButton, setDisplayEditButton] = useState(true);
  const [inputError, setInputError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [infoClicked, setInfoClicked] = useState(false);
  const [displayInputs, setDisplayInputs] = useState({
    chosen: false,
    id: null,
  });
  const [stollewandData, setStollewandData] = useState({
    height: null,
    width: null,
    aantal: 1,
    optie: "",
  });
  const filteredOptions = variationOption?.filter((option) => {
    const thickness = parseFloat(
      option.name.match(/\d+([.,]\d+)?/)?.[0].replace(",", ".")
    );
    return thickness >= 1.2;
  });
  const addKitchenTop = () => {
    setDisplayButton(true);
    setAddInputs(true);
  };
  const submitValues = () => {
    priceCalculation(length, width, thickness);
    setStollewandData((prevStollenwand) => {
      const updatedStollenwandData = {
        ...prevStollenwand,
        width: Number(width),
        aantal: 1,
      };
      return updatedStollenwandData;
    });
  };
  const editKeukenblad = () => {
    const chosenKeukenblad = editMode.keukenBlad;
    const index = keukenBladen.findIndex(
      (keukenBlad) => keukenBlad === chosenKeukenblad
    );

    const pricePerMeter = parseInt(selectedOption.price) * 1.67;
    const productArea = (width / 100) * (length / 100);
    const quotationPrice = Math.ceil(productArea * pricePerMeter);

    const priceAfwerkingen = calculateAfwerkingen(
      parseInt(width),
      parseInt(length),
      selectedAfwerking,
      selectedOption
    );
    const sidesAfwerkingen = selectedAfwerking.map((oneSide) => oneSide);
    setKeukenBladen((prevKeukenBladen) => {
      const updatedKeukenBladen = [...prevKeukenBladen];
      updatedKeukenBladen[chosenKeukenblad] = {
        ...updatedKeukenBladen[chosenKeukenblad],
        width,
        length,
        price: quotationPrice,
        sidesAfwerkingen,
        priceAfwerking: priceAfwerkingen ? priceAfwerkingen : null,
      };
      setDisplayEditButton(true);
      return updatedKeukenBladen;
    });

    setEditMode(null);
  };
  const removeKeukenblad = (index) => {
    if (keukenBladen.length === 1) {
      setDisplayButton(true);
    }

    setStollenwandArray((prevStollenwandArray) =>
      prevStollenwandArray.filter(
        (stollenwand) => stollenwand.keukenbladId !== index
      )
    );

    setKeukenBladen((prevKeukenBladen) => {
      const updatedKeukenBladen = [...prevKeukenBladen];
      updatedKeukenBladen.splice(index, 1);

      return updatedKeukenBladen;
    });
  };
  const handleAfwerkingChange = (afwerkingType) => {
    setSelectedAfwerking((prevSelectedAfwerking) => {
      if (prevSelectedAfwerking.includes(afwerkingType)) {
        return prevSelectedAfwerking.filter((type) => type !== afwerkingType);
      } else {
        return [...prevSelectedAfwerking, afwerkingType];
      }
    });
  };
  const handleInfoClick = () => {
    setInfoClicked(!infoClicked);
  };

  if (
    selectedAfwerking.includes("voor") &&
    selectedAfwerking.includes("achter")
  ) {
    setStollewandOption("eiland");
  } else {
    setStollewandOption("normal");
  }

  const options = ["geheel", "kort", "lang"];
  let variationOptionSW;
  if (selectedOption?.name?.includes("massief")) {
    variationOptionSW = "massief";
  }
  if (selectedOption?.name?.includes("opgedikt")) {
    variationOptionSW = "opgedikt";
  }
  const handleCheckboxChange = (option) => {
    setStollewandData({
      ...stollewandData,
      optie: stollewandData.optie === option ? "" : `${option}`,
    });
  };
  const addStollewand = (keukenbladId, keukenbladObject) => {
    const { optie, width, height, aantal } = stollewandData;
    const stollewandOption =
      keukenbladObject?.sidesAfwerkingen?.includes("voor") &&
      keukenbladObject?.sidesAfwerkingen?.includes("achter")
        ? "eiland"
        : "normal";
    //const pricePerSquareMeter = parseInt(selectedOption.price);
    const pricePerSquareMeter = keukenBladen[keukenbladId].m2Price;
    const stollenwandOption = `${stollewandOption} ${variationOptionSW} ${optie}`;
    //console.log("kb form, stollenwandoptie", stollenwandOption);
    const { subtotal, totalPrice } = calculateStollewandPrice(
      width !== null ? Number(width) : Number(keukenbladObject.width),
      height,
      aantal,
      `${stollewandOption} ${variationOptionSW} ${optie}`,
      pricePerSquareMeter
    );

    const newStollewand = {
      optie: stollenwandOption,
      width: width !== null ? Number(width) : Number(keukenbladObject.width),
      height: height,
      aantal,
      subtotal,
      totalPrice,
      keukenbladId: keukenbladId,
    };
    setStollenwandArray([...stollenwandArray, newStollewand]);

    setStollewandData((prevStollenwand) => {
      const updatedStollenwandData = {
        ...prevStollenwand,
        height: null,
        aantal: 1,
      };
      return updatedStollenwandData;
    });

    setDisplayInputs(false);
  };
  const openSelectedInput = (id) => {
    setDisplayInputs({ chosen: !displayInputs.chosen, id: id });
  };
  const totalStollenwanden = (kbIndex, stollenwandArray) => {
    const sumOfPrices = priceStollenwanden(kbIndex, stollenwandArray);
    return sumOfPrices;
  };

  return (
    <div className={styles.inputFields}>
      <Header />
      <h3 className={styles.productName}>
        {productData && productData[0]?.name}
      </h3>
      <div className={styles.productImageAndInputs}>
        <div className={styles.KBTopImage}>
          <img
            // src={productData?.data[0]?.images[0]?.src}
            src={productData && productData[0]?.images[0].src}
            alt="StoneCenter NatuurSteen product"
            className={styles.productImage}
          />
        </div>
        <div className={styles.listOfKeukenbladen}>
          {keukenBladen.length > 0 &&
            keukenBladen.map((keukenBlad, index) => (
              <div key={index} className={styles.KBExternalContainer}>
                <div
                  className={
                    keukenBladen.length <= 2
                      ? styles.largerKB
                      : styles.singleKBinner
                  }
                >
                  <div className={styles.spacingBottom}>
                    <p
                      className={`${styles.bold} ${styles.KBLabel} ${styles.noMarginTop}`}
                    >{`Keukenblad ${
                      keukenBladen.length === 1 ? "" : index + 1
                    }`}</p>
                    <div>
                      <div className={styles.kbMeasures}>
                        <div className={styles.itemBanner}>
                          <span className={styles.greenCheckIcon}>
                            <FaCheck />
                          </span>
                          <label>{keukenBlad.name}</label>
                        </div>
                        <div className={styles.itemBanner}>
                          <span className={styles.greenCheckIcon}>
                            <FaCheck />
                          </span>
                          <label>Lengte: {keukenBlad.length} cm</label>
                        </div>
                        <div className={styles.itemBanner}>
                          <span className={styles.greenCheckIcon}>
                            <FaCheck />
                          </span>
                          <label>Breedte: {keukenBlad.width} cm</label>
                        </div>
                      </div>
                    </div>
                    {/* <div className={styles.spacingBottom}>
                      <label className={` ${styles.priceLabel}`}>
                        &bull; Prijs:{" "}
                        {isNaN(keukenBlad.price) ? (
                          <span>Sorry, er is hier een probleem opgetreden</span>
                        ) : (
                          <span>€ {keukenBlad.price}</span>
                        )}
                      </label>
                    </div> */}
                  </div>
                  <div>
                    {keukenBlad["sidesAfwerkingen"].length ? (
                      <div className={styles.priceAfwerking}>
                        <div className={styles.afwerkingPrice}>
                          <div
                            className={`${styles.bold} ${styles.KBLabel} ${styles.spacingBottom} `}
                          >
                            <p className={`${styles.afwerkingZijdenLabel} `}>
                              Zijden afwerking
                            </p>
                          </div>
                          <div
                            className={`${styles.itemBanner} ${styles.afwerkingItems}`}
                          >
                            <label>
                              {keukenBlad["sidesAfwerkingen"].map(
                                (oneSide, index) => (
                                  <div
                                    key={index}
                                    className={` ${styles.itemBanner}`}
                                  >
                                    <span className={styles.greenCheckIcon}>
                                      <FaCheck />
                                    </span>{" "}
                                    <label key={index}>{oneSide}</label>
                                  </div>
                                )
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.noAfwerkingLabel}>
                        <div
                          className={`${styles.bold} ${styles.KBLabel} ${styles.spacingBottom} ${styles.alignment}`}
                        >
                          <label className={styles.afwerkingZijdenLabelNone}>
                            Geen afwerking gekozen
                          </label>
                        </div>
                        <div className={styles.bigScreen}>
                          <label> &bull; Geen afwerking gekozen</label>
                        </div>
                      </div>
                    )}
                  </div>
                  {editMode?.keukenBlad ===
                    keukenBladen.indexOf(keukenBlad) && (
                    <div>
                      <label>
                        Bladlengte (cm)<span className={styles.red}>*</span>{" "}
                      </label>
                      <input
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
                        className={styles.measureInput}
                      />
                      <label>Bladbreedte (cm)* </label>
                      <input
                        type="number"
                        placeholder="breedte in cm"
                        value={width}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (
                            inputValue === "" ||
                            (!isNaN(inputValue) && inputValue > 0)
                          ) {
                            setWidth(inputValue);
                          }
                        }}
                        className={stylesRoot.measureInput}
                      />
                      <div className={styles.editKBDikte}>
                        <label>Bladdikte (cm) </label>
                        <select
                          value={selectedOption?.name}
                          onChange={(e) => {
                            const selectedOptionData = filteredOptions.find(
                              (option) => option.name === e.target.value
                            );
                            setSelectedOption({
                              name: e.target.value,
                              price: selectedOptionData
                                ? selectedOptionData.price
                                : "",
                              id: selectedOptionData.id,
                              parentId: selectedOptionData.parentId,
                            });
                          }}
                          className={stylesRoot.selectTag}
                        >
                          <option className={styles.selectOption} value="kies">
                            -- Kies --
                          </option>
                          {filteredOptions &&
                            filteredOptions.map((option, index) => (
                              <option
                                key={index}
                                value={option.name}
                                className={styles.selectOption}
                              >
                                {`${option.name} - €${option.price}`}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className={styles.afwerkingContainer}>
                        <p>
                          Afwerking{" "}
                          <span className={styles.spaceLeft}>
                            <BsFillInfoSquareFill />
                          </span>
                        </p>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedAfwerking.includes("links")}
                            onChange={() => handleAfwerkingChange("links")}
                          />
                          Links
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedAfwerking.includes("rechts")}
                            onChange={() => handleAfwerkingChange("rechts")}
                          />
                          Rechts
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedAfwerking.includes("voor")}
                            onChange={() => handleAfwerkingChange("voor")}
                          />
                          Voor
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedAfwerking.includes("achter")}
                            onChange={() => handleAfwerkingChange("achter")}
                          />
                          Achter
                        </label>
                      </div>
                    </div>
                  )}

                  <div className={styles.editRemoveButtons}>
                    {editMode && (
                      <button
                        onClick={editKeukenblad}
                        className={styles.editButton}
                      >
                        Bevestig
                      </button>
                    )}
                  </div>
                </div>
                {displayInputs.chosen &&
                displayInputs.id === keukenBladen.indexOf(keukenBlad) ? (
                  <div className={styles.stollewandInputs}>
                    <div className={styles.optionStollenwand}>
                      <label
                        className={`${styles.measureLabel} ${styles.paddingBottom}`}
                      >
                        Kies een optie
                        <span
                          className={`${styles.bold} ${styles.KBLabel} ${styles.noMarginTop} ${styles.red}`}
                        >
                          *
                        </span>{" "}
                      </label>
                      {productData[0]?.name
                        .toLowerCase()
                        .includes("keramiek") &&
                      variationOptionSW === "massief" ? (
                        <label className={styles.stollenwandDisclaimer}>
                          {" "}
                          <span className={styles.infoIcon}>
                            <BsFillInfoSquareFill />
                          </span>{" "}
                          Dit is een stollenwand uit keramiek en daarom heeft de
                          achterkant van het product niet dezelfde
                          aderingsuitstraling als de voorkant.
                        </label>
                      ) : (
                        ""
                      )}
                      {options.map((option) => (
                        <label key={option} className={styles.afwerkingCB}>
                          <input
                            type="checkbox"
                            checked={stollewandData?.optie?.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    <div className={styles.KBinputFields}>
                      <label className={styles.measureLabel}>
                        Wandbreedte (cm)<span className={styles.red}>*</span>{" "}
                      </label>
                      <input
                        type="number"
                        placeholder="lengte in cm"
                        value={stollewandData.width}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (
                            inputValue === "" ||
                            (!isNaN(inputValue) && inputValue > 0)
                          ) {
                            setStollewandData((prevData) => ({
                              ...prevData,
                              width: Number(inputValue),
                            }));
                          }
                        }}
                        className={styles.measureInput}
                      />
                      {inputError && stollewandData.width < 5 && (
                        <p className={styles.errorMessage}>
                          * Minimale breedte: 5 cm
                        </p>
                      )}
                      <label className={styles.measureLabel}>
                        Wandhoogte (cm)<span className={styles.red}>*</span>{" "}
                      </label>
                      <input
                        type="number"
                        placeholder="hoogte in cm"
                        value={stollewandData.hoogte}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (
                            inputValue === "" ||
                            (!isNaN(inputValue) && inputValue > 0)
                          ) {
                            setStollewandData((prevData) => ({
                              ...prevData,
                              height: Number(inputValue),
                            }));
                          }
                        }}
                        className={styles.measureInput}
                      />
                      {inputError &&
                        (stollewandData.height < 5 ||
                          stollewandData.height === null) && (
                          <p className={styles.errorMessage}>
                            * Minimale hoogte: 5 cm
                          </p>
                        )}
                      <label className={styles.measureLabel}>Aantal</label>
                      <input
                        type="number"
                        placeholder="aantal stollewand"
                        value={stollewandData.aantal}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (
                            inputValue === "" ||
                            (!isNaN(inputValue) && inputValue > 0)
                          ) {
                            setStollewandData((prevData) => ({
                              ...prevData,
                              aantal: Number(inputValue),
                            }));
                          }
                        }}
                        className={styles.measureInput}
                      />
                      <button
                        onClick={() => {
                          if (
                            (stollewandData.width < 5) |
                            (stollewandData.height < 5) |
                            (stollewandData.aantal === 0)
                          ) {
                            setInputError(true);
                            return;
                          }
                          addStollewand(
                            keukenBladen.indexOf(keukenBlad),
                            keukenBlad
                          );
                        }}
                        disabled={
                          stollewandData.optie === "" ||
                          stollewandData.height === null ||
                          stollewandData.width === null
                        }
                        className={
                          stollewandData.optie === ""
                            ? `${styles.inactiveNextButton}`
                            : `${styles.sumbitNextButton} ${styles.spacingTop} ${styles.addStollenwand}`
                        }
                      >
                        Toevoegen
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {stollenwandArray.length ? (
                  <div className={styles.stollewandList}>
                    {stollenwandArray
                      .filter(
                        (stollewand) =>
                          stollewand.keukenbladId ===
                          keukenBladen.indexOf(keukenBlad)
                      )
                      .map((stollenwand, index) => (
                        <div
                          key={index}
                          className={styles.stollenwandContainer}
                        >
                          <p
                            className={`${styles.bold} ${styles.KBLabel} ${styles.noMarginTop}`}
                          >
                            {stollenwandArray.length === 1
                              ? "Stollenwand"
                              : `Stollenwand ${index + 1}`}
                          </p>
                          <div className={styles.kbMeasures}>
                            <div className={styles.itemBanner}>
                              <span className={styles.greenCheckIcon}>
                                <FaCheck />
                              </span>
                              <label>Optie: {stollenwand.optie}</label>
                            </div>

                            <div className={styles.itemBanner}>
                              <span className={styles.greenCheckIcon}>
                                <FaCheck />
                              </span>
                              <label>Wandbreedte: {stollenwand.width} cm</label>
                            </div>
                            <div className={styles.itemBanner}>
                              <span className={styles.greenCheckIcon}>
                                <FaCheck />
                              </span>
                              <label>Wandhoogte: {stollenwand.height} cm</label>
                            </div>

                            {stollenwand.aantal > 1 ? (
                              <>
                                <div className={styles.itemBanner}>
                                  <span className={styles.greenCheckIcon}>
                                    <FaCheck />
                                  </span>
                                  <label> Aantal: {stollenwand.aantal}</label>
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                          </div>

                          {/* <label className={` ${styles.priceLabel}`}>
                            &bull; Prijs: &euro; {stollenwand.totalPrice}
                          </label> */}
                        </div>
                      ))}
                  </div>
                ) : (
                  ""
                )}
                <div className={styles.addStollewandButton}>
                  <button
                    onClick={() =>
                      openSelectedInput(keukenBladen.indexOf(keukenBlad))
                    }
                    className={
                      !keukenBladen.length
                        ? `${styles.inactiveNextButton}`
                        : `${styles.sumbitNextButton} ${styles.spacingTop} ${styles.addStollenwand}`
                    }
                  >
                    Stollenwand toevoegen
                  </button>
                </div>

                {/* <label
                  className={
                    keukenBladen.length > 2
                      ? ` ${styles.subTotalLabelNarrow}`
                      : ` ${styles.subTotalLabel}`
                  }
                >
                  Subtotaal:{" "}
                  {isNaN(keukenBlad.price) ? (
                    <span>Sorry, er is hier een probleem opgetreden</span>
                  ) : (
                    <span className={styles.bold}>
                      €{" "}
                      {keukenBlad.price +
                        keukenBlad.priceAfwerking +
                        totalStollenwanden(
                          keukenBladen.indexOf(keukenBlad),
                          stollenwandArray
                        )}
                    </span>
                  )}
                </label> */}
                <div
                  className={
                    keukenBladen.length > 2
                      ? styles.deleteButtonNarrow
                      : styles.deleteButtonContainer
                  }
                >
                  <button
                    onClick={() =>
                      removeKeukenblad(keukenBladen.indexOf(keukenBlad))
                    }
                    className={styles.deleteButton}
                  >
                    <div className={styles.binIconInner}>
                      {" "}
                      <IoTrashBin className={styles.deleteIcon} />
                    </div>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.keukenBladData}>
        <div className={styles.KBinputFields}>
          <label className={styles.measureLabel}>
            Bladlengte (cm)<span className={styles.red}>*</span>{" "}
          </label>
          <input
            type="number"
            placeholder="lengte in cm"
            value={length}
            // onChange={(e) => {
            //   setLength(e.target.value);
            // }}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue === "" || (!isNaN(inputValue) && inputValue > 0)) {
                setLength(inputValue);
              }
            }}
            className={styles.measureInput}
          />
          {inputError && length < 5 && (
            <p className={styles.errorMessage}>* Minimale lengte: 5 cm</p>
          )}
          <label className={styles.measureLabel}>
            Bladbreedte (cm)<span className={styles.red}>*</span>{" "}
          </label>
          <input
            type="number"
            placeholder="breedte in cm"
            value={width}
            //onChange={(e) => setWidth(e.target.value)}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue === "" || (!isNaN(inputValue) && inputValue > 0)) {
                setWidth(inputValue);
              }
            }}
            className={styles.measureInput}
          />
          {inputError && width < 5 && (
            <p className={styles.errorMessage}>* Minimale breedte: 5 cm</p>
          )}
          <div className={styles.thicknessSelector}>
            <label className={styles.measureLabel}>
              Bladdikte (cm)<span className={styles.red}>*</span>{" "}
            </label>
            <select
              value={selectedOption?.name}
              onChange={(e) => {
                const selectedOptionData = filteredOptions.find(
                  (option) => option.name === e.target.value
                );
                setSelectedOption({
                  name: e.target.value,
                  price: selectedOptionData ? selectedOptionData.price : "",
                  id: selectedOptionData.id,
                  parentId: selectedOptionData.parentId,
                });
              }}
              className={styles.selectTag}
            >
              <option>-- Kies --</option>
              {filteredOptions &&
                filteredOptions.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className={styles.afwerkingContainer}>
          <p
            className={`${styles.afwerkingBanner} ${
              infoClicked && styles.clicked
            }`}
            tabIndex="0"
          >
            Randafwerking{" "}
            <span className={styles.spaceLeft}>
              <BsFillInfoSquareFill onClick={handleInfoClick} />
            </span>
          </p>
          {infoClicked && (
            <label className={styles.infoAfwerking}>
              Vink aan de randen waar er in zicht komt.
            </label>
          )}
          <label className={styles.afwerkingCB}>
            <input
              type="checkbox"
              checked={selectedAfwerking.includes("links")}
              onChange={() => handleAfwerkingChange("links")}
            />
            Links
          </label>
          <label label className={styles.afwerkingCB}>
            <input
              type="checkbox"
              checked={selectedAfwerking.includes("rechts")}
              onChange={() => handleAfwerkingChange("rechts")}
            />
            Rechts
          </label>
          <label label className={styles.afwerkingCB}>
            <input
              type="checkbox"
              checked={selectedAfwerking.includes("voor")}
              onChange={() => handleAfwerkingChange("voor")}
            />
            Voor
          </label>
          <label label className={styles.afwerkingCB}>
            <input
              type="checkbox"
              checked={selectedAfwerking.includes("achter")}
              onChange={() => handleAfwerkingChange("achter")}
            />
            Achter
          </label>
        </div>
        <div className={styles.stolleWandContainer}></div>
      </div>
      <div className={styles.submitButtonContainer}>
        <div className={styles.addAndExtraButtons}>
          <div className={styles.toevoegenAndExtraButtons}>
            {displayButton && (
              <button
                onClick={() => {
                  if ((length < 5) | (width < 5)) {
                    setInputError(true);
                    return;
                  }
                  submitValues();
                  setAddInputs(false);
                  setDisplayButton(false);
                }}
                // className="sumbitButton"
                className={
                  (length === "") |
                  (width === "") |
                  (Object.keys(selectedOption).length === 0) |
                  (selectedOption.name === "-- Kies --")
                    ? `${styles.inactiveButton}`
                    : `${styles.sumbitButton} `
                }
                //disabled={length === "" || width === "" || Object.keys(selectedOption).length === 0}
                disabled={
                  (length === "") |
                  (width === "") |
                  (Object.keys(selectedOption).length === 0) |
                  (selectedOption.name === "-- Kies --")
                }
              >
                Toevoegen
              </button>
            )}
            <button
              onClick={addKitchenTop}
              className={
                !keukenBladen.length
                  ? `${styles.standardButton}`
                  : `${styles.keukenBladInactive}`
              }
              disabled={!keukenBladen.length}
            >
              Extra keukenblad
            </button>{" "}
          </div>
        </div>
        <div className={styles.nextButtonContainer}>
          <button
            onClick={() => {
              setSelectedOption1(selectedOption);
              setFormStep(formStep + 1);
            }}
            className={
              !keukenBladen.length
                ? `${styles.inactiveNextButton}`
                : `${styles.sumbitNextButton}`
            }
            disabled={!keukenBladen.length}
          >
            Volgende
          </button>
        </div>
      </div>
    </div>
  );
}
