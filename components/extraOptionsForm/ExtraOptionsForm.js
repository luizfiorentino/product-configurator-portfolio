import React, { useState } from "react";
import styles from "./ExtraOptionsForm.module.css";
import { IoTrashBin } from "react-icons/io5";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaExclamationTriangle, FaCheck } from "react-icons/fa";
import Header from "../header/Header";

function AdditionalForm({
  extraOptions,
  setExtraOptions,
  formStep,
  setFormStep,
  productVariations,
  setDisplayButton,
  productName,
  keukenBladen,
  productData,
}) {
  const [spatrand, setSpatwand] = useState({
    length: null,
    width: null,
    afwerking: false,
    priceAfwerking: null,
  });
  const [addNewSpatwand, setAddNewSpatwand] = useState(false);
  const [extraSpatwandButton, setExtraSpatwandButton] = useState(true);
  const [afwerking, setAfwerking] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [specialConditionSB, setSpecialConditionSB] = useState(false);
  const [specialConditionKP, setSpecialConditionKP] = useState(false);
  const [agreeConditionSpoelbak, setAgreeConditionSpoelBak] = useState(false);
  const [agreeConditionKookplaat, setAgreeConditionKookplaat] = useState(false);
  const [aantalUitsparingSpoelbak, setAantalUitsparingSpoelbak] = useState(1);
  const [aantalUitsparingKookplaat, setAantalUitsparingKookplaat] = useState(1);

  let specialProductHandling;
  if (
    keukenBladen.find(
      (keukenBlad) =>
        keukenBlad.name.includes("2 cm") || keukenBlad.name.includes("2cm")
    ) &&
    productName.includes("Terrazzo")
  ) {
    specialProductHandling = true;
  } else {
    specialProductHandling = false;
  }
  const handleNumberChange = (optionName, value) => {
    setExtraOptions((prevOptions) => ({
      ...prevOptions,
      [optionName]: { ...prevOptions[optionName], aantal: value },
    }));
  };
  const handleTextAreaChange = (optionName, value) => {
    setExtraOptions((prevOptions) => ({
      ...prevOptions,
      [optionName]: value,
    }));
  };
  const findSmallestOption = (options) => {
    let smallestOption = null;
    options?.forEach((option) => {
      const thicknessMatch = option?.name?.match(/\d+([.,]\d+)?/);
      if (thicknessMatch) {
        const thickness = parseFloat(thicknessMatch[0].replace(",", "."));

        if (
          thickness >= 0.8 &&
          (!smallestOption || thickness < smallestOption.thickness)
        ) {
          smallestOption = { ...option, thickness };
        }
      }
    });
    return smallestOption;
  };
  const smallestOption = findSmallestOption(productVariations);
  const priceSpatwandOfRand = smallestOption?.price;
  const nextStep = () => {
    if (!extraOptions.Transport.chosen) {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Montage: {
          basicOption: { chosen: false, price: 325 },
          incrementedOption: { chosen: false, price: 650 },
          chosen: false, // Set the main chosen property to false
        },
      }));
    }
    const objectCheck = { chosen: true };
    const spatwandString = JSON.stringify(extraOptions.Spatwand_rand);
    const objectString = JSON.stringify(objectCheck);

    if (spatwandString === objectString) {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Spatwand_rand: [],
      }));
    } else {
      console.log("");
    }

    if (
      extraOptions.Uitsparing_spoelbak.chosen &&
      !(
        extraOptions.Uitsparing_spoelbak.onderbouwKlein.chosen ||
        extraOptions.Uitsparing_spoelbak.onderbouwGroot.chosen ||
        extraOptions.Uitsparing_spoelbak.opbouw.chosen ||
        extraOptions.Uitsparing_spoelbak.vlakbouw.chosen
      )
    ) {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Uitsparing_spoelbak: {
          ...prevOptions.Uitsparing_spoelbak,
          chosen: false,
        },
      }));
    }
    if (
      extraOptions.Uitsparing_spoelbak.chosen &&
      (extraOptions.Uitsparing_spoelbak.onderbouwKlein.chosen ||
        extraOptions.Uitsparing_spoelbak.onderbouwGroot.chosen ||
        extraOptions.Uitsparing_spoelbak.opbouw.chosen ||
        extraOptions.Uitsparing_spoelbak.vlakbouw.chosen)
    ) {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Uitsparing_spoelbak: {
          ...prevOptions.Uitsparing_spoelbak,
          chosen: true,
          aantal: aantalUitsparingSpoelbak,
        },
      }));
    }
    if (
      extraOptions.Uitsparing_kookplaat.chosen &&
      (extraOptions.Uitsparing_kookplaat.opbouw.chosen ||
        extraOptions.Uitsparing_kookplaat.vlakbouw.chosen)
    ) {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Uitsparing_kookplaat: {
          ...prevOptions.Uitsparing_kookplaat,
          chosen: true,
          aantal: aantalUitsparingKookplaat,
        },
      }));
    }

    // Check and update Uitsparing_kookplaat
    if (
      extraOptions.Uitsparing_kookplaat.chosen &&
      !(
        extraOptions.Uitsparing_kookplaat.opbouw.chosen ||
        extraOptions.Uitsparing_kookplaat.vlakbouw.chosen
      )
    ) {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Uitsparing_kookplaat: {
          ...prevOptions.Uitsparing_kookplaat,
          chosen: false,
        },
      }));
    }

    // Check and update Inmeten
    if (
      extraOptions.Inmeten.chosen &&
      !(
        extraOptions.Inmeten.max50km.chosen ||
        extraOptions.Inmeten["51-100km"].chosen ||
        extraOptions.Inmeten["101-200km"].chosen ||
        extraOptions.Inmeten["201-250km"].chosen
      )
    ) {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Inmeten: {
          ...prevOptions.Inmeten,
          chosen: false,
        },
      }));
    }

    // Check and update Montage
    if (
      extraOptions.Montage.chosen &&
      !(
        extraOptions.Montage.basicOption.chosen ||
        extraOptions.Montage.incrementedOption.chosen
      )
    ) {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Montage: {
          ...prevOptions.Montage,
          chosen: false,
        },
      }));
    }

    // Check and update Transport
    if (
      extraOptions.Transport.chosen &&
      !(
        extraOptions.Transport.max50km.chosen ||
        extraOptions.Transport["51-100km"].chosen ||
        extraOptions.Transport["101-200km"].chosen ||
        extraOptions.Transport["201-250km"].chosen ||
        extraOptions.Transport.ZelfAfhalenDelft.chosen ||
        extraOptions.Transport.ZelfAfhalenBreda.chosen
      )
    ) {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Transport: {
          ...prevOptions.Transport,
          chosen: false,
        },
      }));
    }
    if (spatrand.length === null) {
      setFormStep(formStep + 1);
      return;
    }

    setFormStep(formStep + 1);
  };
  const confirmSpatwand = () => {
    const priceAfwerking = calculateAfwerking();
    const spatwandArray = Array.isArray(extraOptions.Spatwand_rand)
      ? extraOptions.Spatwand_rand
      : [];
    const pricePerMeter = parseInt(priceSpatwandOfRand);
    const minArea = 0.36;
    const productArea = (spatrand.length / 100) * (spatrand.width / 100);
    const finalProductArea = Math.max(productArea, minArea);
    const quotationPrice = Math.ceil(finalProductArea * pricePerMeter);
    const newSpatwandObject = {
      length: spatrand.length,
      width: spatrand.width,
      price: quotationPrice,
      afwerking: spatrand.afwerking,
      priceAfwerking: afwerking ? priceAfwerking : 0,
    };
    setExtraOptions((prevOptions) => ({
      ...prevOptions,
      Spatwand_rand: [...spatwandArray, newSpatwandObject],
    }));
    setAddNewSpatwand(false);
    setExtraSpatwandButton(true);
    setAfwerking(false);
  };
  const handleCheckboxChange = (optionName) => {
    if (
      optionName === "Uitsparing_spoelbak" ||
      optionName === "Uitsparing_kookplaat" ||
      optionName === "Inmeten" ||
      optionName === "Transport" ||
      optionName === "Montage"
    ) {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        [optionName]: {
          chosen: !prevOptions[optionName].chosen,
          ...(optionName === "Uitsparing_spoelbak"
            ? {
                onderbouwKlein: { chosen: false, price: 220 },
                onderbouwGroot: { chosen: false, price: 315 },
                opbouw: { chosen: false, price: 132 },
                vlakbouw: { chosen: false, price: 170 },
              }
            : optionName === "Uitsparing_kookplaat"
            ? {
                opbouw: { chosen: false, price: 132 },
                vlakbouw: { chosen: false, price: 294 },
              }
            : optionName === "Inmeten"
            ? {
                max50km: { chosen: false, price: 135 },
                "51-100km": { chosen: false, price: 183 },
                "101-200km": { chosen: false, price: 267 },
                "201-250km": { chosen: false, price: 331 },
              }
            : optionName === "Transport"
            ? {
                max50km: { chosen: false, price: 162 },
                "51-100km": { chosen: false, price: 210 },
                "101-200km": { chosen: false, price: 294 },
                "201-250km": { chosen: false, price: 358 },
                ZelfAfhalenDelft: { chosen: false, price: 0 },
                ZelfAfhalenBreda: { chosen: false, price: 0 },
              }
            : optionName === "Montage"
            ? {
                basicOption: { chosen: false, price: 325 },
                incrementedOption: { chosen: false, price: 650 },
              }
            : {}),
        },
      }));
    } else {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        [optionName]: {
          ...prevOptions[optionName],
          chosen: !prevOptions[optionName].chosen,
        },
      }));
    }
    setExtraSpatwandButton(false);
  };
  const handleCheckboxAgreement = (option) => {
    if (option === "spoelbak") {
      setAgreeConditionSpoelBak(!agreeConditionSpoelbak);
    }
    if (option === "kookplaat") {
      setAgreeConditionKookplaat(!agreeConditionKookplaat);
    }
  };
  const handleCheckboxVariant = (optionName, variant) => {
    setExtraOptions((prevOptions) => {
      const updatedOptions = { ...prevOptions };
      Object.keys(updatedOptions[optionName]).forEach((key) => {
        if (key !== "chosen") {
          updatedOptions[optionName][key].chosen = false;
        }
      });
      updatedOptions[optionName][variant].chosen = true;
      updatedOptions[optionName].chosen = Object.keys(
        updatedOptions[optionName]
      ).some(
        (key) => key !== "chosen" && updatedOptions[optionName][key].chosen
      );
      return updatedOptions;
    });
  };
  const calculateAfwerking = () => {
    const totalAfwerkingPrice =
      (Math.ceil(spatrand.length / 100) * 100 * 35) / 100;
    setSpatwand((prevSpatwand) => ({
      ...prevSpatwand,
      afwerking: true,
      priceAfwerking: totalAfwerkingPrice,
    }));
    return totalAfwerkingPrice;
  };
  const openInputs = () => {
    setSpatwand({ ...spatrand, afwerking: false });
    setAddNewSpatwand(!addNewSpatwand);
  };
  const removeSpatwand = (index) => {
    setExtraOptions((prevOptions) => {
      const updatedSpatwand = [...prevOptions.Spatwand_rand];
      updatedSpatwand.splice(index, 1);
      return {
        ...prevOptions,
        Spatwand_rand: updatedSpatwand,
      };
    });
  };
  const resetOptions = (option) => {
    if (option === "spoelbak") {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Uitsparing_spoelbak: {
          ...prevOptions.Uitsparing_spoelbak,
          onderbouwKlein: { chosen: false, price: 220 },
          onderbouwGroot: { chosen: false, price: 315 },
          opbouw: { chosen: false, price: 132 },
          vlakbouw: { chosen: false, price: 170 },
          chosen: false,
        },
      }));
    }
    if (option === "kookplaat") {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Uitsparing_kookplaat: {
          ...prevOptions.Uitsparing_kookplaat,
          opbouw: { chosen: false, price: 132 },
          vlakbouw: { chosen: false, price: 294 },
          chosen: false,
        },
      }));
    }
    if (option === "inmeten") {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Inmeten: {
          ...prevOptions.Inmeten,
          chosen: false,
          max50km: { chosen: false, price: 135 },
          "51-100km": { chosen: false, price: 183 },
          "101-200km": { chosen: false, price: 267 },
          "201-250km": { chosen: false, price: 331 },
        },
      }));
    }
    if (option === "transport") {
      setExtraOptions((prevOptions) => ({
        ...prevOptions,
        Transport: {
          ...prevOptions.Transport,
          chosen: false,
          max50km: { chosen: false, price: 162 },
          "51-100km": { chosen: false, price: 210 },
          "101-200km": { chosen: false, price: 294 },
          "201-250km": { chosen: false, price: 358 },
        },
      }));
    }
  };

  return (
    <div className={styles.extraOptiesContainer}>
      <Header />
      <div className={styles.productTopImage}>
        <img
          src={productData && productData[0]?.images[0].src}
          alt="StoneCenter Natuursteen product"
          className={styles.productImage}
        />
      </div>
      <h2 className={styles.mainBanner}>Extra opties</h2>
      {extraOptions.Spatwand_rand.length !== 0 && (
        <div
          className={
            extraOptions.Spatwand_rand.length % 3 !== 0 &&
            extraOptions.Spatwand_rand.length % 2 !== 0
              ? styles.listOfSpatwanden
              : styles.listOfSpatwanden2
          }
        >
          {extraOptions.Spatwand_rand.length &&
            extraOptions.Spatwand_rand.map((onePiece, index) => (
              <div key={index} className={styles.srMeasures}>
                <div className={styles.srMeasuresInner}>
                  <h3 className={styles.spatwandBanner}>
                    Spatwand/rand{" "}
                    {extraOptions.Spatwand_rand.length === 1 ? "" : index + 1}
                  </h3>
                  <div className={styles.spatwandInfos}>
                    <div className={styles.SWValues}>
                      <div
                        className={`${styles.itemBanner} ${styles.SWmeasures}`}
                      >
                        <span className={styles.greenCheckIcon}>
                          <FaCheck />
                        </span>
                        <label>Lengte: {onePiece.length} cm</label>
                      </div>
                      <div
                        className={`${styles.itemBanner} ${styles.SWmeasures}`}
                      >
                        <span className={styles.greenCheckIcon}>
                          <FaCheck />
                        </span>
                        <label>Breedte: {onePiece.width} cm</label>
                      </div>
                    </div>
                    <div className={styles.spacingLeft}>
                      {/* <label className={`${styles.SWPrices} `}>
                        &bull; Prijs: € {onePiece.price}
                      </label> */}

                      {onePiece.priceAfwerking !== 0 ? (
                        <div
                          className={`${styles.itemBanner} ${styles.SWmeasures}`}
                        >
                          <span className={styles.greenCheckIcon}>
                            <FaCheck />
                          </span>
                          <label>Afwerking gekozen</label>
                        </div>
                      ) : (
                        <div
                          className={`${styles.itemBanner} ${styles.SWmeasures}`}
                        >
                          <span className={styles.greenCheckIcon}>
                            <FaCheck />
                          </span>
                          <label>Geen afwerking gekozen</label>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <label className={styles.SWPrices}>
                    Subtotaal:{" "}
                    <span className={styles.bold}>
                      € {onePiece.price + onePiece.priceAfwerking}
                    </span>
                  </label> */}
                </div>
                <div className={`${styles.spatwandDeleteIcon} `}>
                  <button
                    className={styles.deleteIcon}
                    onClick={() =>
                      removeSpatwand(
                        extraOptions.Spatwand_rand.indexOf(onePiece)
                      )
                    }
                  >
                    <div className={styles.binIconInner}>
                      <IoTrashBin />
                    </div>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      <div className={styles.inputContainer}>
        {!extraOptions.Spatwand_rand.length ? (
          <label
            className={
              !extraOptions.Spatwand_rand.chosen
                ? styles.innerInputUnchecked
                : `${styles.spatwandBanner} ${styles.bold}`
            }
          >
            <input
              type="checkbox"
              checked={extraOptions.Spatwand_rand.chosen}
              onChange={() => handleCheckboxChange("Spatwand_rand")}
              className={`${styles.innerInput}`}
            />
            Spatwand of rand
          </label>
        ) : null}
        {extraOptions.Spatwand_rand.chosen && (
          <div className={styles.inputContainer}>
            <div className={`${styles.montageTop} ${styles.margins}`}>
              <span className={styles.montageIcon}>
                <BsFillInfoSquareFill />
              </span>
              <label className={``}>
                De dunste variant van dit product vanaf 8mm wordt gebruikt voor
                de spatwand of rand.
              </label>
            </div>

            <label>Lengte: </label>
            <input
              type="number"
              //value={parseInt(spatrand.length)}
              // onChange={(e) =>
              //   setSpatwand({ ...spatrand, length: parseInt(e.target.value) })
              // }
              value={spatrand.length || ""}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (
                  inputValue === "" ||
                  (!isNaN(inputValue) && inputValue > 0)
                ) {
                  setSpatwand({
                    ...spatrand,
                    length: parseInt(inputValue) || undefined,
                  });
                }
              }}
              className={styles.innerInputMeasure}
            />
            {inputError && spatrand.length < 5 && (
              <p className={styles.errorMessage}>* Minimale lengte: 5 cm</p>
            )}
            <label>Breedte: </label>
            <input
              type="number"
              //value={parseInt(spatrand.width)}
              // onChange={(e) =>
              //   setSpatwand({ ...spatrand, width: parseInt(e.target.value) })
              // }
              className={`${styles.innerInputMeasure} ${styles.extraSpacing}`}
              value={spatrand.width || ""}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (
                  inputValue === "" ||
                  (!isNaN(inputValue) && inputValue > 0)
                ) {
                  setSpatwand({
                    ...spatrand,
                    width: parseInt(inputValue) || undefined,
                  });
                }
              }}
            />
            {inputError && spatrand.width < 5 && (
              <p className={styles.errorMessage}>* Minimale breedte: 5 cm</p>
            )}
            <div className={styles.spatwandAfwerkingButtons}>
              <button
                onClick={
                  !afwerking
                    ? () => setAfwerking(true)
                    : () => setAfwerking(false)
                }
                className={styles.backButton}
              >
                {!afwerking ? "Afwerking toevoegen" : "Afwerking verwijderen"}
              </button>
              <button
                onClick={() => {
                  if ((spatrand.length < 5) | (spatrand.width < 5)) {
                    setInputError(true);
                    return;
                  }
                  confirmSpatwand();
                }}
                className={`${styles.backButton} ${styles.editSpatwand}`}
                disabled={
                  isNaN(spatrand.length) ||
                  isNaN(spatrand.width) ||
                  spatrand.length === null ||
                  spatrand.width === null ||
                  spatrand.length === "" ||
                  spatrand.width === ""
                }
              >
                Bevestig
              </button>
            </div>
          </div>
        )}
        <div className={styles.spatwandDivider}></div>
        {extraOptions.Spatwand_rand.length !== 0 && extraSpatwandButton && (
          <button
            onClick={openInputs}
            disabled={!extraOptions?.Spatwand_rand[0]?.width}
            className={`${styles.backButton} ${styles.extraSpatwandButton}`}
          >
            Extra spatwand of rand
          </button>
        )}
        {addNewSpatwand && (
          <div className={styles.inputContainer}>
            <label>Lengte: </label>
            <input
              type="number"
              value={parseInt(spatrand.length)}
              onChange={(e) =>
                setSpatwand({ ...spatrand, length: parseInt(e.target.value) })
              }
              className={styles.innerInputMeasure}
            />
            {inputError && spatrand.length < 5 && (
              <p className={styles.errorMessage}>* Minimale lengte: 5 cm</p>
            )}
            <label>Breedte: </label>
            <input
              type="number"
              value={parseInt(spatrand.width)}
              onChange={(e) =>
                setSpatwand({ ...spatrand, width: parseInt(e.target.value) })
              }
              className={styles.innerInputMeasure}
            />
            {inputError && spatrand.width < 5 && (
              <p className={styles.errorMessage}>* Minimale breedte: 5 cm</p>
            )}
            <button
              onClick={
                !afwerking
                  ? () => setAfwerking(true)
                  : () => setAfwerking(false)
              }
              className={styles.backButton}
            >
              {!afwerking ? "Afwerking toevoegen" : "Afwerking verwijderen"}
            </button>

            {<h3>{spatrand.afwerking && `€ ${spatrand.priceAfwerking}`}</h3>}
            <button
              onClick={() => {
                if ((spatrand.length < 5) | (spatrand.width < 5)) {
                  setInputError(true);
                  return;
                }
                confirmSpatwand();
              }}
              className={`${styles.backButton} ${styles.editSpatwand}`}
              disabled={
                isNaN(spatrand.length) ||
                isNaN(spatrand.width) ||
                spatrand.length === null ||
                spatrand.width === null ||
                spatrand.length === "" ||
                spatrand.width === ""
              }
            >
              Bevestigen
            </button>
            {
              <h3>
                {spatrand.afwerking &&
                  `Prijs afwerking: € ${spatrand.priceAfwerking}`}
              </h3>
            }
          </div>
        )}
        <div className={`${styles.inputContainer} ${styles.optionsContainer}`}>
          <div className={styles.inputContainerTop}>
            <label
              className={
                !extraOptions.Uitsparing_spoelbak.chosen
                  ? styles.innerInputUnchecked
                  : styles.bold
              }
            >
              <input
                type="checkbox"
                checked={extraOptions.Uitsparing_spoelbak.chosen}
                onChange={() => handleCheckboxChange("Uitsparing_spoelbak")}
                className={styles.innerInput}
              />
              Uitsparing spoelbak
            </label>
            {extraOptions.Uitsparing_spoelbak.chosen && (
              <div className={styles.suboptionsSection}>
                {specialProductHandling && (
                  <label
                    className={`${styles.montageDisclaimer} ${styles.iconLabel}`}
                  >
                    <label>
                      <span className={styles.redIcon}>
                        <FaExclamationTriangle />
                      </span>
                      <span className={`${styles.redIcon} ${styles.spaceLeft}`}>
                        Let op:
                      </span>{" "}
                      Dit product heeft speciale voorwaarden. Lees het
                      alstublieft voordat u verdergaat.
                      {specialConditionSB && (
                        <div className={styles.uitsparingDisclaimer}>
                          <label className={styles.uitsparingDisclaimer}>
                            <span>
                              <BsFillInfoSquareFill />
                            </span>
                            Dit keukenblad kan niet vervoerd worden met een
                            volledige, afgewerkte uitsparing, om breuk te
                            vermijden. De uitsparing moet na het transport
                            voltooid worden door te slijpen op de plaats die is
                            aangegeven door de stippellijn met een diamantzaag,
                            om het binnenste gedeelte te verwijderen. Als u
                            kiest voor de montage optie, is deze service
                            inbegrepen; anders moet de klant het zelf doen. Om
                            deze situatie te vermijden, kunt u kiezen voor optie{" "}
                            <span className={styles.boldText}>
                              opgedikt in verstek{" "}
                            </span>
                            in Keukenbladen - Bladdikte. Neem bij twijfel
                            contact met ons op.
                          </label>
                        </div>
                      )}
                      <div>
                        <button
                          className={`${styles.backButton} ${styles.agreeButton}`}
                          onClick={() =>
                            setSpecialConditionSB(!specialConditionSB)
                          }
                        >
                          {!specialConditionSB ? "Klik hier" : "Verberg"}
                        </button>{" "}
                      </div>
                    </label>
                  </label>
                )}
                {specialProductHandling && (
                  <label className={styles.agreeCheckbox}>
                    <input
                      type="checkbox"
                      checked={agreeConditionSpoelbak}
                      onChange={() => handleCheckboxAgreement("spoelbak")}
                    />
                    Ik ga akkoord
                  </label>
                )}
                <label
                  className={`${styles.montageDisclaimer} ${styles.iconLabel}`}
                >
                  {/* <div className={styles.icon}>
                    <BsFillInfoSquareFill />
                  </div> */}
                  Kies de vorm van installatie voor uw spoelbak uitsparing:
                </label>

                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={extraOptions.Uitsparing_spoelbak.opbouw.chosen}
                    onChange={() =>
                      handleCheckboxVariant("Uitsparing_spoelbak", "opbouw")
                    }
                    className={styles.innerInput}
                  />
                  Opbouw
                </label>
                {!specialProductHandling && (
                  <>
                    <label className={styles.subOptions}>
                      <input
                        type="checkbox"
                        checked={
                          extraOptions.Uitsparing_spoelbak.onderbouwKlein.chosen
                        }
                        onChange={() =>
                          handleCheckboxVariant(
                            "Uitsparing_spoelbak",
                            "onderbouwKlein"
                          )
                        }
                        className={styles.innerInput}
                      />
                      Onderbouw kleiner dan 50cm x 40cm
                    </label>
                    <label className={styles.subOptions}>
                      <input
                        type="checkbox"
                        checked={
                          extraOptions.Uitsparing_spoelbak.onderbouwGroot.chosen
                        }
                        onChange={() =>
                          handleCheckboxVariant(
                            "Uitsparing_spoelbak",
                            "onderbouwGroot"
                          )
                        }
                        className={styles.innerInput}
                      />
                      Onderbouw 50cm x 40cm of groter
                    </label>
                    <label className={styles.subOptions}>
                      <input
                        type="checkbox"
                        checked={
                          extraOptions.Uitsparing_spoelbak.vlakbouw.chosen
                        }
                        onChange={() =>
                          handleCheckboxVariant(
                            "Uitsparing_spoelbak",
                            "vlakbouw"
                          )
                        }
                        className={styles.innerInput}
                      />
                      Vlakbouw
                    </label>
                  </>
                )}
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => resetOptions("spoelbak")}
                    className={styles.innerInput}
                  />
                  Geen uitsparing
                </label>
                <div className={styles.spaceLeftAmount}>
                  <label
                    className={`${styles.subOptions} ${styles.boldSingle}`}
                  >
                    Aantal:
                    <input
                      type="number"
                      value={aantalUitsparingSpoelbak}
                      onChange={(e) =>
                        setAantalUitsparingSpoelbak(
                          parseInt(e.target.value, 10)
                        )
                      }
                      min="1"
                      className={styles.quantityInput}
                    />
                  </label>
                </div>
              </div>
            )}
            <label
              className={
                extraOptions.Uitsparing_kookplaat.chosen
                  ? styles.bold
                  : styles.innerInputUnchecked
              }
            >
              <input
                type="checkbox"
                checked={extraOptions.Uitsparing_kookplaat.chosen}
                onChange={() => handleCheckboxChange("Uitsparing_kookplaat")}
                className={styles.innerInput}
              />
              Uitsparing kookplaat
            </label>
            {extraOptions.Uitsparing_kookplaat.chosen && (
              <div className={styles.suboptionsSection}>
                {specialProductHandling && (
                  <label
                    className={`${styles.montageDisclaimer} ${styles.iconLabel}`}
                  >
                    <label>
                      <span className={styles.redIcon}>
                        <FaExclamationTriangle />
                      </span>
                      <span className={`${styles.redIcon} ${styles.spaceLeft}`}>
                        Let op:
                      </span>{" "}
                      Dit product heeft speciale voorwaarden. Lees het
                      alstublieft voordat u verdergaat.
                    </label>
                    {specialConditionKP && (
                      <div className={styles.uitsparingDisclaimer}>
                        <label className={styles.uitsparingDisclaimer}>
                          <BsFillInfoSquareFill />
                          Dit keukenblad kan niet vervoerd worden met een
                          volledige, afgewerkte uitsparing, om breuk te
                          vermijden. De uitsparing moet na het transport
                          voltooid worden door te slijpen op de plaats die is
                          aangegeven door de stippellijn met een diamantzaag, om
                          het binnenste gedeelte te verwijderen. Als u kiest
                          voor de montage optie, is deze service inbegrepen;
                          anders moet de klant het zelf doen. Om deze situatie
                          te vermijden, kunt u kiezen voor optie{" "}
                          <span className={styles.boldText}>
                            opgedikt in verstek{" "}
                          </span>
                          in Keukenbladen - Bladdikte. Neem bij twijfel contact
                          met ons op.
                        </label>
                      </div>
                    )}
                    <div>
                      <button
                        className={`${styles.backButton} ${styles.agreeButton}`}
                        onClick={() =>
                          setSpecialConditionKP(!specialConditionKP)
                        }
                      >
                        {!specialConditionKP ? "Klik hier" : "Verberg"}
                      </button>{" "}
                    </div>
                  </label>
                )}
                {specialProductHandling && (
                  <label className={styles.agreeCheckbox}>
                    <input
                      type="checkbox"
                      checked={agreeConditionKookplaat}
                      onChange={() => handleCheckboxAgreement("kookplaat")}
                    />
                    Ik ga akkoord
                  </label>
                )}
                <label className={styles.montageDisclaimer}>
                  {/* <BsFillInfoSquareFill />  */}
                  Kies de vorm van installatie voor uw kookplaat uitsparing:
                </label>
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={extraOptions.Uitsparing_kookplaat.opbouw.chosen}
                    onChange={() =>
                      handleCheckboxVariant("Uitsparing_kookplaat", "opbouw")
                    }
                    className={styles.innerInput}
                  />
                  Opbouw
                </label>

                {!specialProductHandling && (
                  <>
                    <label className={styles.subOptions}>
                      <input
                        type="checkbox"
                        checked={
                          extraOptions.Uitsparing_kookplaat.vlakbouw.chosen
                        }
                        onChange={() =>
                          handleCheckboxVariant(
                            "Uitsparing_kookplaat",
                            "vlakbouw"
                          )
                        }
                        className={styles.innerInput}
                      />
                      Vlakbouw
                    </label>
                  </>
                )}
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => resetOptions("kookplaat")}
                    className={styles.innerInput}
                  />
                  Geen uitsparing
                </label>
                <div className={`${styles.subOptions} ${styles.boldSingle}`}>
                  <label className={styles.subOptions}>
                    Aantal:
                    <input
                      type="number"
                      value={aantalUitsparingKookplaat}
                      onChange={(e) =>
                        setAantalUitsparingKookplaat(
                          parseInt(e.target.value, 10)
                        )
                      }
                      min="1"
                      className={styles.quantityInput}
                    />
                  </label>
                </div>
              </div>
            )}
            <label className={`${styles.bold} ${styles.kraangatLabel}`}>
              <input
                type="checkbox"
                checked={extraOptions.Kraan_gat.chosen}
                onChange={() => handleCheckboxChange("Kraan_gat")}
                className={styles.innerInput}
              />
              Kraan gat(en)
            </label>
            {extraOptions.Kraan_gat.chosen && (
              <div
                className={`${styles.inputContainer} ${styles.holesContainer}`}
              >
                <label className={`${styles.totalHoles} ${styles.boldSingle}`}>
                  Aantal:{" "}
                </label>
                <input
                  type="number"
                  value={extraOptions.Kraan_gat.aantal}
                  // onChange={(e) =>
                  //   handleNumberChange("Kraan_gat", parseInt(e.target.value))
                  // }
                  onChange={(e) => {
                    const inputValue = parseInt(e.target.value, 10);
                    if (!isNaN(inputValue) && inputValue >= 0) {
                      handleNumberChange("Kraan_gat", inputValue);
                    }
                  }}
                  className={styles.holesSelector}
                />
              </div>
            )}
            <label
              className={
                !extraOptions.Inmeten.chosen
                  ? styles.innerInputUnchecked
                  : styles.bold
              }
            >
              <input
                type="checkbox"
                checked={extraOptions.Inmeten.chosen}
                onChange={() => handleCheckboxChange("Inmeten")}
                className={styles.innerInput}
              />
              Inmeting
            </label>
            {extraOptions.Inmeten.chosen && (
              <div className={styles.suboptionsSection}>
                <div className={styles.montageDisclaimer}>
                  <div className={styles.montageTop}>
                    <span className={styles.montageIcon}>
                      <BsFillInfoSquareFill />
                    </span>
                    <label>
                      Selecteer één afstandsoptie tussen uw locatie en ons
                      filiaal aan de Einsteinweg 20, Delft. 2627 BN:
                    </label>
                  </div>
                </div>
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={extraOptions.Inmeten.max50km.chosen}
                    onChange={() => handleCheckboxVariant("Inmeten", "max50km")}
                    className={styles.innerInput}
                  />
                  Maximaal 50km
                </label>
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={extraOptions.Inmeten["51-100km"].chosen}
                    onChange={() =>
                      handleCheckboxVariant("Inmeten", "51-100km")
                    }
                    className={styles.innerInput}
                  />
                  51 tot 100 km
                </label>
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={extraOptions.Inmeten["101-200km"].chosen}
                    onChange={() =>
                      handleCheckboxVariant("Inmeten", "101-200km")
                    }
                    className={styles.innerInput}
                  />
                  101 tot 200 km
                </label>
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={extraOptions.Inmeten["201-250km"].chosen}
                    onChange={() =>
                      handleCheckboxVariant("Inmeten", "201-250km")
                    }
                    className={styles.innerInput}
                  />
                  201 tot 250 km
                </label>
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => resetOptions("inmeten")}
                    className={styles.innerInput}
                  />
                  Geen inmeting
                </label>
              </div>
            )}{" "}
          </div>

          <div className={styles.inputContainerBottom}>
            <label
              className={
                !extraOptions.Transport.chosen
                  ? styles.innerInputUnchecked
                  : styles.bold
              }
            >
              <input
                type="checkbox"
                checked={extraOptions.Transport.chosen}
                onChange={() => handleCheckboxChange("Transport")}
                className={styles.innerInput}
              />
              Transport
            </label>

            {extraOptions.Transport.chosen && (
              <div className={styles.suboptionsSection}>
                <div className={styles.montageDisclaimer}>
                  <div className={styles.montageTop}>
                    <span className={styles.montageIcon}>
                      <BsFillInfoSquareFill />
                    </span>
                    <label>
                      Selecteer één afstandsoptie tussen uw locatie en ons
                      filiaal aan de Einsteinweg 20, Delft. 2627 BN:
                    </label>
                  </div>
                </div>
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={extraOptions.Transport.max50km.chosen}
                    onChange={() =>
                      handleCheckboxVariant("Transport", "max50km")
                    }
                    className={styles.innerInput}
                  />
                  Maximaal 50km
                </label>
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={extraOptions.Transport["51-100km"].chosen}
                    onChange={() =>
                      handleCheckboxVariant("Transport", "51-100km")
                    }
                    className={styles.innerInput}
                  />
                  51 tot 100 km
                </label>
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={extraOptions.Transport["101-200km"].chosen}
                    onChange={() =>
                      handleCheckboxVariant("Transport", "101-200km")
                    }
                    className={styles.innerInput}
                  />
                  101 tot 200km
                </label>
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={extraOptions.Transport["201-250km"].chosen}
                    onChange={() =>
                      handleCheckboxVariant("Transport", "201-250km")
                    }
                    className={styles.innerInput}
                  />
                  201 tot 250km
                </label>
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => resetOptions("transport")}
                    className={styles.innerInput}
                  />
                  Geen transport
                </label>
              </div>
            )}

            <label className={`${styles.bold} ${styles.spacingBottom}`}>
              <input
                type="checkbox"
                checked={extraOptions.Transport.ZelfAfhalenDelft.chosen}
                onChange={() =>
                  setExtraOptions((prevOptions) => ({
                    ...prevOptions,
                    Transport: {
                      ...prevOptions.Transport,
                      ZelfAfhalenDelft: {
                        ...prevOptions.Transport.ZelfAfhalenDelft,
                        chosen: !prevOptions.Transport.ZelfAfhalenDelft.chosen,
                      },
                      chosen: false,
                      ZelfAfhalenBreda: { chosen: false, price: 0 },
                    },
                  }))
                }
                className={styles.innerInput}
              />
              Zelf Afhalen in Delft
            </label>

            <label className={styles.innerInputUnchecked}>
              <input
                type="checkbox"
                checked={extraOptions.Transport.ZelfAfhalenBreda.chosen}
                onChange={() =>
                  setExtraOptions((prevOptions) => ({
                    ...prevOptions,
                    Transport: {
                      ...prevOptions.Transport,
                      ZelfAfhalenBreda: {
                        ...prevOptions.Transport.ZelfAfhalenBreda,
                        chosen: !prevOptions.Transport.ZelfAfhalenBreda.chosen,
                      },
                      chosen: false,
                      ZelfAfhalenDelft: { chosen: false, price: 0 },
                    },
                  }))
                }
                className={styles.innerInput}
              />
              Zelf Afhalen in Breda
            </label>

            <div className={styles.afhalenOptions}>
              <label
                className={
                  !extraOptions.Montage.chosen
                    ? styles.montageUnchecked
                    : styles.montageBold
                }
              >
                <input
                  type="checkbox"
                  checked={extraOptions.Montage.chosen}
                  onChange={() => handleCheckboxChange("Montage")}
                  className={styles.innerInput}
                  disabled={
                    !extraOptions.Transport.chosen |
                    (!extraOptions.Transport.max50km.chosen &&
                      !extraOptions.Transport["51-100km"].chosen &&
                      !extraOptions.Transport["101-200km"].chosen &&
                      !extraOptions.Transport["201-250km"].chosen)
                  }
                />
                Montage<span className={!styles.notBold}>*</span>
              </label>
              {!extraOptions.Montage.chosen && (
                <label className={styles.transportToelichting}>
                  <span className={styles.italic}>
                    * er moet één transportoptie worden aangevinkt
                  </span>
                </label>
              )}

              {extraOptions.Montage.chosen && (
                <div className={styles.montageDisclaimer}>
                  <div className={styles.montageTop}>
                    <span className={styles.montageIcon}>
                      <BsFillInfoSquareFill />
                    </span>
                    <label>
                      <span className={`${styles.redIcon} `}>Let op:</span> Als
                      de installatie één van de volgende opties omvat wat
                      betreft keukeninstallatie:
                    </label>
                  </div>
                  {/* <div className={styles.spaceBottom}></div> */}
                  <div className={styles.uitgebreidOptions}>
                    <li className={styles.reduceTopSpacing}>
                      keukenopstelling: eiland
                    </li>
                    <li>keukenblad langer dan 250 cm </li>
                    <li> meer dan 5 onderdelen</li>
                  </div>
                  <p className={styles.uitgebreidBanner}>
                    Kies dan <span className={styles.bold}>Uitgebreid</span>{" "}
                    optie a.u.b.
                  </p>
                </div>
              )}
              {extraOptions.Montage.chosen && (
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={extraOptions.Montage.basicOption.chosen}
                    onChange={() =>
                      handleCheckboxVariant("Montage", "basicOption")
                    }
                    className={styles.innerInput}
                  />
                  Basis
                </label>
              )}
              {extraOptions.Montage.chosen && (
                <label className={styles.subOptions}>
                  <input
                    type="checkbox"
                    checked={extraOptions.Montage.incrementedOption.chosen}
                    onChange={() =>
                      handleCheckboxVariant("Montage", "incrementedOption")
                    }
                    className={styles.innerInput}
                  />
                  Uitgebreid
                </label>
              )}
            </div>
          </div>
        </div>
        <div
          className={`${styles.inputContainer} ${styles.opmerkingContainer}`}
        >
          <label className={`${styles.bold} ${styles.spaceBottomOpmerking}`}>
            Opmerking
          </label>{" "}
          <textarea
            value={extraOptions.Opmerking}
            onChange={(e) => handleTextAreaChange("Opmerking", e.target.value)}
            className={styles.textArea}
          />
        </div>
      </div>
      <div className={styles.step3Buttons}>
        <button
          className={styles.backButton}
          onClick={() => {
            setDisplayButton(false);
            setFormStep(formStep - 1);
          }}
        >
          Vorig
        </button>
        <button
          className={styles.submitButton}
          disabled={
            (specialProductHandling &&
              !agreeConditionSpoelbak &&
              extraOptions.Uitsparing_spoelbak.opbouw.chosen) ||
            (specialProductHandling &&
              !agreeConditionKookplaat &&
              extraOptions.Uitsparing_kookplaat.opbouw.chosen)
          }
          onClick={() =>
            nextStep(
              parseInt(extraOptions.Spatwand_rand.length),
              parseInt(extraOptions.Spatwand_rand.width)
            )
          }
        >
          Volgende
        </button>
      </div>
    </div>
  );
}

export default AdditionalForm;
