import React, { useState } from "react";
import styles from "./OverzichtForm.module.css";
import { FaCheck } from "react-icons/fa";
import Header from "../header/Header";
import { generateOfferteData, priceStollenwanden } from "@/utils";
import axios from "axios";

export default function OverzichtForm({
  keukenBladen,
  clientData,
  extraOptions,
  linkProduct,
  productData,
  stollenwandArray,
}) {
  const [purchaseTotalPrice, setPurchaseTotalPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const offerteName = `Online Offerte: ${
    productData ? productData[0].name : "offerte"
  }`;
  const offerteImage = productData ? productData[0].images[0].src : "image";

  function getSelectedOptionInfo(option) {
    const options = extraOptions[option];
    let selectedOptionName;
    let selectedOption;
    Object.keys(options).forEach((key) => {
      if (key !== "chosen" && options[key].chosen) {
        selectedOptionName = key;
        selectedOption = options[key];
      }
    });

    return { selectedOptionName, selectedOption };
  }
  const uitsparingSpoelbakInfo = getSelectedOptionInfo("Uitsparing_spoelbak");
  const { selectedOptionName: spoelbakName, selectedOption: spoelbakOption } =
    uitsparingSpoelbakInfo;
  const uitsparingKookplaatInfo = getSelectedOptionInfo("Uitsparing_kookplaat");
  const { selectedOptionName: kookplaatName, selectedOption: kookplaatOption } =
    uitsparingKookplaatInfo;
  const inmetenOptionsInfo = getSelectedOptionInfo("Inmeten");
  const { selectedOptionName: inmetenName, selectedOption: inmetenOption } =
    inmetenOptionsInfo;
  const montageOptionsInfo = getSelectedOptionInfo("Montage");
  const { selectedOptionName: montageName, selectedOption: montageOption } =
    montageOptionsInfo;

  const transportOptionsInfo = getSelectedOptionInfo("Transport");
  const { selectedOptionName: transportName, selectedOption: transportOption } =
    transportOptionsInfo;
  function isNumber(value) {
    return typeof value === "number" && !isNaN(value);
  }
  let priceGaten;
  if (extraOptions.Kraan_gat.chosen) {
    priceGaten =
      extraOptions.Kraan_gat.aantal * extraOptions.Kraan_gat.pricePerNumber;
  }
  const totalPrice = () => {
    let arrayOfPrices = [];
    const pricesToCheck = [
      spoelbakOption?.price * extraOptions?.Uitsparing_spoelbak?.aantal,
      kookplaatOption?.price * extraOptions?.Uitsparing_kookplaat?.aantal,
      priceGaten,
      inmetenOption?.price,
      transportOption?.price,
      montageOption?.price,
    ];

    pricesToCheck.forEach((price) => {
      if (isNumber(price)) {
        arrayOfPrices.push(price);
      }
    });

    const keukenBladenPrice = keukenBladen.map((oneKB) => {
      arrayOfPrices.push(oneKB.price + oneKB.priceAfwerking);
      return oneKB.price + oneKB.priceAfwerking;
    });

    const spatWandenPrice = Array.isArray(extraOptions?.Spatwand_rand)
      ? extraOptions.Spatwand_rand.map((oneSW) => {
          arrayOfPrices.push(oneSW.price + oneSW.priceAfwerking);
          return oneSW.price + oneSW.priceAfwerking;
        })
      : [];

    const stollewandenPrice = stollenwandArray.map((stollenwand) => {
      arrayOfPrices.push(stollenwand.totalPrice);
      return stollenwand.totalPrice;
    });

    const sum = arrayOfPrices.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

    const maxLength = Math.max(
      keukenBladenPrice.length,
      spatWandenPrice.length
    );

    const sumArray = Array.from({ length: maxLength }, (_, index) => {
      const num1 =
        index < keukenBladenPrice.length && !isNaN(keukenBladenPrice[index])
          ? keukenBladenPrice[index]
          : 0;

      const num2 =
        index < spatWandenPrice.length && !isNaN(spatWandenPrice[index])
          ? spatWandenPrice[index]
          : 0;

      return !isNaN(num1) && !isNaN(num2) ? num1 + num2 : 0;
    });

    const totalSum = sumArray.reduce((acc, value) => acc + value, 0);

    return sum;
  };
  const priceWithBTW = () => {
    return Math.ceil(totalPrice() * 1.21);
  };
  const navigateToStoneCenter = () => {
    const stoneCenterUrl = linkProduct;
    window.location.href = stoneCenterUrl;
  };
  const addToCart = async (productId, variationId = null, quantity = 1) => {
    // Build the base URL
    let url = "https://stonecenter-shop.nl/winkelwagen/";

    // Add parameters for the first product
    url += `?add-to-cart=${productId}`;
    if (variationId) {
      url += `&variation_id=${variationId}`;
    }
    url += `&quantity=${quantity}`;

    // Check if adding a second product
    if (arguments.length > 2) {
      // Get additional product arguments
      const secondProductId = arguments[2];
      const secondQuantity = arguments.length > 3 ? arguments[3] : 1;
      const secondVariationId = arguments.length > 4 ? arguments[4] : null;

      // Add separator for second product
      url += "&add-to-cart=";

      // Add parameters for the second product
      url += `${secondProductId}`;
      if (secondVariationId) {
        url += `&variation_id=${secondVariationId}`;
      }
      url += `&quantity=${secondQuantity}`;
    }

    // Redirect to the constructed URL
    window.location.href = url;
  };
  const offerteDataString = generateOfferteData(
    clientData,
    keukenBladen,
    stollenwandArray,
    extraOptions
  );
  const createProduct = async () => {
    try {
      const newProductData = {
        name: offerteDataString,
        type: "simple",
        regular_price: `${priceWithBTW()}`,
        description: generateOfferteData(
          clientData,
          keukenBladen,
          stollenwandArray,
          extraOptions
        ),
        categories: [{ id: 602 }],
        images: [
          {
            src: offerteImage,
            alt: "afbeelding online offerte: keukenblad op maat",
          },
        ],
        catalog_visibility: "hidden",
        shipping_class: "category602",
        //shipping_class_id: 604,
        shipping_required: false,
      };
      setLoading(true);
      const response = await axios.post(
        "https://stonecenter-shop.nl/wp-json/wc/v3/products",
        newProductData,
        {
          params: {
            consumer_key: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
            consumer_secret: process.env.NEXT_PUBLIC_REACT_APP_API_SECRET,
          },
        }
      );
      //console.log("new product created:", response.data);
      const newProductId = response.data.id;
      // await axios.post("/api/scheduledDelete", { productId: newProductId });
      // await axios.post(
      //   `/api/scheduledDelete?apiKey=${process.env.NEXT_PUBLIC_REACT_APP_API_KEY}&apiSecret=${process.env.NEXT_PUBLIC_REACT_APP_API_SECRET}`,
      //   { productId: newProductId }
      // );

      window.location.href = `https://stonecenter-shop.nl/winkelwagen/?add-to-cart=${newProductId}`;
      setLoading(false);
    } catch (error) {
      console.error("Error creating product:", error);
      setLoading(false);
    }
  };
  const totalStollenwanden = (kbIndex, stollenwandArray) => {
    const sumOfPrices = priceStollenwanden(kbIndex, stollenwandArray);
    return sumOfPrices;
  };

  return (
    <div className={styles.overzichtFormContainer}>
      {!loading ? (
        <div className={styles.wrapperContainer}>
          <Header />
          <div className={styles.KBTopImage}>
            <img
              src={productData && productData[0]?.images[0].src}
              alt="StoneCenter Natuursteen product"
              className={styles.productImage}
            />
          </div>
          <div className={styles.productsBannerUnderline}>
            <div className={styles.clientDataArea}>
              <h3>Dhr./Mevr. </h3>
              <div className={styles.clientInfosInner}>
                <p className={styles.bold}>
                  {`${clientData.Voornaam} ${clientData.Achternaam}`}
                </p>
                <p className={styles.clientInfoParagraph}>
                  E-mail: {clientData["E-mailadres"]}
                </p>
                <p className={styles.clientInfoParagraph}>
                  {clientData["Straatnaam + huisnummer"]}. {clientData.Postcode}
                  .
                </p>
                <p className={styles.clientInfoParagraph}>
                  {clientData.Woonplaats}
                </p>
                <p
                  className={`${styles.telBanner} ${styles.clientInfoParagraphBottom}`}
                >
                  Tel. {clientData.Telefoonnummer}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.lineDivider}></div>
          <div className={styles.productsBanner}></div>
          <div className={styles.productsBanner}>
            <h3 className={styles.prodBanner}>Product(en)</h3>
          </div>
          {!keukenBladen.length ? (
            <p>Geen keukenblad toegevoegd</p>
          ) : (
            <div className={styles.productSummary}>
              <div className={styles.areaWrapper}>
                {keukenBladen.length > 1 && (
                  <div
                    className={`${styles.itemBanner} ${styles.typeProdLabel}`}
                  >
                    <span className={styles.greenCheckIcon}>
                      <FaCheck />
                    </span>
                    <label>Keukenbladen</label>
                  </div>
                )}
                <div className={`${styles.KBExternal} ${styles.verticalLine}`}>
                  {keukenBladen &&
                    keukenBladen.map((keukenBlad, index) => {
                      return (
                        <div className={styles.keukenBladContainer} key={index}>
                          <div className={styles.KBListInner}>
                            {/* <p className={styles.bold}>{`Keukenblad ${
                        keukenBladen.length > 1
                          ? keukenBladen.indexOf(keukenBlad) + 1
                          : ""
                      }`}</p> */}
                            <div className={` ${styles.canvas}`}>
                              <div>
                                <div
                                  className={`${styles.itemBanner} ${styles.spaceTop} ${styles.spaceBottom}`}
                                >
                                  <label
                                    className={`${styles.bold} ${styles.biggerFont}`}
                                  >{`Keukenblad ${
                                    keukenBladen.length > 1
                                      ? keukenBladen.indexOf(keukenBlad) + 1
                                      : ""
                                  }`}</label>
                                </div>
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
                                {keukenBlad.sidesAfwerkingen.length !== 0 && (
                                  <div className={styles.priceLabel}>
                                    <label>Prijs: € {keukenBlad.price}*</label>
                                  </div>
                                )}
                                {keukenBlad.sidesAfwerkingen.length ? (
                                  <div>
                                    <div
                                      className={styles.zijdenAfwerkingBanner}
                                    >
                                      <label>Zijden afwerking</label>
                                    </div>{" "}
                                    {keukenBlad.sidesAfwerkingen.map(
                                      (side, index) => (
                                        <div
                                          key={index}
                                          className={styles.itemBanner}
                                        >
                                          <span
                                            className={styles.greenCheckIcon}
                                          >
                                            <FaCheck />
                                          </span>
                                          <label key={index}>{side}</label>
                                        </div>
                                      )
                                    )}
                                    <div>
                                      <p className={styles.SWAfwerking}>
                                        Prijs afwerking: €{" "}
                                        {keukenBlad.priceAfwerking}*
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <p
                                    className={`${styles.geenAfwerkingBanner} ${styles.SWAfwerking}`}
                                  >
                                    Geen afwerking gekozen
                                  </p>
                                )}{" "}
                                {stollenwandArray.length ? (
                                  <div className={styles.listOfStollenwanden}>
                                    {stollenwandArray
                                      .filter(
                                        (stollewand) =>
                                          stollewand.keukenbladId ===
                                          keukenBladen.indexOf(keukenBlad)
                                      )
                                      .map((stollenwand, index) => (
                                        <div
                                          key={index}
                                          className={
                                            styles.stollenwandContainer
                                          }
                                        >
                                          <div
                                            className={
                                              styles.zijdenAfwerkingBanner
                                            }
                                          >
                                            <label>
                                              {stollenwandArray.length > 1
                                                ? `Stollenwand ${index + 1}`
                                                : `Stollenwand`}
                                            </label>
                                          </div>
                                          <div className={styles.itemBanner}>
                                            <span
                                              className={styles.greenCheckIcon}
                                            >
                                              <FaCheck />
                                            </span>
                                            <label>
                                              Optie: {stollenwand.optie}
                                            </label>
                                          </div>
                                          <div className={styles.itemBanner}>
                                            <span
                                              className={styles.greenCheckIcon}
                                            >
                                              <FaCheck />
                                            </span>
                                            <label>
                                              Wandbreedte: {stollenwand.width}{" "}
                                              cm
                                            </label>
                                          </div>
                                          <div className={styles.itemBanner}>
                                            <span
                                              className={styles.greenCheckIcon}
                                            >
                                              <FaCheck />
                                            </span>
                                            <label>
                                              Wandhoogte: {stollenwand.height}{" "}
                                              cm
                                            </label>
                                          </div>

                                          {stollenwand.aantal > 1 ? (
                                            <>
                                              <div
                                                className={styles.itemBanner}
                                              >
                                                <span
                                                  className={
                                                    styles.greenCheckIcon
                                                  }
                                                >
                                                  <FaCheck />
                                                </span>
                                                <label>
                                                  Aantal: {stollenwand.aantal}
                                                </label>
                                              </div>

                                              <p>
                                                Per stuk: &euro;{" "}
                                                {stollenwand.subtotal}
                                              </p>
                                            </>
                                          ) : (
                                            ""
                                          )}
                                          <p>
                                            {stollenwand.aantal > 1
                                              ? `Prijs stollenwand(en): \u20AC ${stollenwand.totalPrice}*`
                                              : `Prijs stollenwand: \u20AC ${stollenwand.totalPrice}*`}
                                          </p>
                                        </div>
                                      ))}
                                  </div>
                                ) : (
                                  ""
                                )}
                                <p className={styles.subtotalLabel}>
                                  &bull; Subtotaal: &euro;{" "}
                                  <span className={styles.bold}>
                                    {keukenBlad.price +
                                      keukenBlad.priceAfwerking +
                                      totalStollenwanden(
                                        keukenBladen.indexOf(keukenBlad),
                                        stollenwandArray
                                      )}
                                    ,00
                                  </span>
                                  *
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className={styles.areaWrapper}>
                {extraOptions.Spatwand_rand.length > 1 && (
                  <div
                    className={`${styles.itemBanner} ${styles.typeProdLabel}`}
                  >
                    <span className={styles.greenCheckIcon}>
                      <FaCheck />
                    </span>
                    <label>Spatwanden</label>
                  </div>
                )}
                <div className={styles.KBExternal}>
                  {extraOptions.Spatwand_rand.length
                    ? extraOptions.Spatwand_rand.map((onePiece, index) => {
                        return (
                          <div
                            key={index}
                            className={`${styles.spatWandContainer} ${styles.canvas}`}
                          >
                            <div
                              className={styles.clientInfosInnerSW}
                              key={index}
                            >
                              <p
                                className={`${styles.bold} ${styles.biggerFont} ${styles.spacingTopKB}`}
                              >
                                Spatwand/rand:{" "}
                                {extraOptions.Spatwand_rand.length === 1
                                  ? ""
                                  : index + 1}
                              </p>
                              <div className={styles.itemBanner}>
                                <span className={styles.greenCheckIcon}>
                                  <FaCheck />
                                </span>
                                <label>Lengte: {onePiece.length} cm</label>
                              </div>
                              <div className={styles.itemBanner}>
                                <span className={styles.greenCheckIcon}>
                                  <FaCheck />
                                </span>
                                <label>Breedte: {onePiece.width} cm</label>
                              </div>
                              {/* <p>Lengte: {onePiece.length} cm</p>
                  <p>Breedte: {onePiece.width} cm</p> */}
                              {onePiece.priceAfwerking !== 0 && (
                                <p>Prijs: € {onePiece.price}*</p>
                              )}

                              {onePiece.priceAfwerking !== 0 ? (
                                <>
                                  <div className={styles.itemBanner}>
                                    <span className={styles.greenCheckIcon}>
                                      <FaCheck />
                                    </span>
                                    <label>Afwerking gekozen</label>
                                  </div>
                                  <p className={styles.SWAfwerking}>
                                    Prijs afwerking: € {onePiece.priceAfwerking}
                                    *
                                  </p>
                                </>
                              ) : (
                                <p
                                  className={`${styles.geenAfwerkingBanner} ${styles.SWAfwerking}`}
                                >
                                  Geen afwerking gekozen
                                </p>
                              )}
                              <p className={styles.subtotalLabel}>
                                &bull; Subtotaal: &euro;{" "}
                                <span className={styles.bold}>
                                  {onePiece.price + onePiece.priceAfwerking},00
                                </span>
                                *
                              </p>
                            </div>
                          </div>
                        );
                      })
                    : ""}
                </div>
              </div>
            </div>
          )}
          {extraOptions.Uitsparing_spoelbak.chosen ||
          extraOptions.Uitsparing_kookplaat.chosen ||
          extraOptions.Kraan_gat.aantal.chosen ||
          extraOptions.Inmeten.chosen ||
          extraOptions.Transport.chosen ||
          extraOptions.Montage.chosen ? (
            <div
              className={`${styles.productsBannerUnderline} ${styles.upperLine}`}
            >
              <h3 className={`${styles.prodBanner} ${styles.productsBanner} `}>
                Extra Opties
              </h3>
            </div>
          ) : (
            ""
          )}
          <div className={styles.uitsparingBlock}>
            {extraOptions.Uitsparing_spoelbak.chosen && (
              <div className={styles.productsBannerUnderline}>
                <div className={styles.productsBanner}>
                  <p className={`${styles.bold} ${styles.spacingLeft}`}>
                    Uitsparing spoelbak
                  </p>
                  <p className={styles.instalatieInner}>
                    Type installatie: {spoelbakName}
                  </p>
                  <p className={styles.instalatieInner}>
                    Aantal uitsparing(en):{" "}
                    <span className={styles.bold}>
                      {extraOptions.Uitsparing_spoelbak.aantal}
                    </span>
                  </p>
                  <p className={styles.instalatieInner}>
                    Eenheidsprijs: € {spoelbakOption.price}*
                  </p>
                  <p className={styles.instalatieInner}>
                    Prijs uitsparing(en):{" "}
                    <span className={styles.bold}>
                      €{" "}
                      {spoelbakOption.price *
                        extraOptions.Uitsparing_spoelbak.aantal}
                    </span>
                    *
                  </p>
                </div>
              </div>
            )}
            {extraOptions.Uitsparing_kookplaat.chosen && (
              <div className={styles.productsBannerUnderline}>
                <div className={styles.productsBanner}>
                  <p className={`${styles.bold} ${styles.spacingLeft}`}>
                    Uitsparing kookplaat
                  </p>
                  <p className={styles.instalatieInner}>
                    Type installatie: {kookplaatName}
                  </p>
                  <p className={styles.instalatieInner}>
                    Aantal uitsparing(en):{" "}
                    <span className={styles.bold}>
                      {extraOptions.Uitsparing_kookplaat.aantal}
                    </span>
                  </p>
                  <p className={styles.instalatieInner}>
                    Eenheidsprijs: € {kookplaatOption.price}*
                  </p>
                  <p className={styles.instalatieInner}>
                    Prijs uitsparing(en):{" "}
                    <span className={styles.bold}>
                      €{" "}
                      {kookplaatOption.price *
                        extraOptions.Uitsparing_kookplaat.aantal}
                    </span>
                    *
                  </p>
                </div>
              </div>
            )}
            {extraOptions.Kraan_gat.chosen && priceGaten !== 0 && (
              <div className={styles.productsBannerUnderline}>
                <div className={styles.productsBanner}>
                  <p className={`${styles.bold} ${styles.spacingLeft}`}>
                    Kraan gat(en)
                  </p>
                  <div className={styles.clientInfosInner}>
                    <p>Aantal: {extraOptions.Kraan_gat.aantal}</p>
                    <p>
                      Prijs: <span className={styles.bold}>€ {priceGaten}</span>
                      *
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.inmetingTransportMontageBlock}>
            {extraOptions.Inmeten.chosen && (
              <div
                className={`${styles.productsBannerUnderline} ${styles.minWidth}`}
              >
                <div className={styles.productsBanner}>
                  <p className={`${styles.bold} ${styles.spacingLeft}`}>
                    Inmeting
                  </p>
                  <p className={styles.clientInfosInner}>
                    Afstand: {inmetenName} -{" "}
                    <span className={styles.bold}>€ {inmetenOption.price}</span>
                    *
                  </p>
                </div>
              </div>
            )}
            {extraOptions.Transport.chosen && (
              <div className={styles.productsBannerUnderline}>
                <div className={styles.productsBanner}>
                  <p className={`${styles.bold} ${styles.spacingLeft}`}>
                    Transport
                  </p>
                  <p className={styles.clientInfosInner}>
                    Optie: {transportName} -{" "}
                    <span className={styles.bold}>
                      € {transportOption.price}
                    </span>
                    *
                  </p>
                </div>
              </div>
            )}
            {extraOptions.Transport.ZelfAfhalenDelft.chosen && (
              <div className={styles.productsBannerUnderline}>
                <div className={styles.productsBanner}>
                  <p className={`${styles.bold} ${styles.spacingLeft}`}>
                    Afhaaloptie
                  </p>
                  <p className={styles.clientInfosInner}>Zelf afhalen Delft</p>
                </div>
              </div>
            )}
            {extraOptions.Transport.ZelfAfhalenBreda.chosen && (
              <div className={styles.productsBannerUnderline}>
                <div className={styles.productsBanner}>
                  <p className={`${styles.bold} ${styles.spacingLeft}`}>
                    Afhaaloptie
                  </p>
                  <p className={styles.clientInfosInner}>Zelf afhalen Breda</p>
                </div>
              </div>
            )}
            {extraOptions.Montage.chosen && (
              <div className={styles.productsBannerUnderline}>
                <div className={styles.productsBanner}>
                  <p className={`${styles.bold} ${styles.spacingLeft}`}>
                    Montage
                  </p>
                  <p className={styles.clientInfosInner}>
                    Optie:{" "}
                    {montageName === "incrementedOption"
                      ? "Uitgebreid"
                      : "Basis"}{" "}
                    -{" "}
                    <span className={styles.bold}>€ {montageOption.price}</span>
                    *
                  </p>
                </div>
              </div>
            )}
          </div>
          {extraOptions.Opmerking !== "" && (
            <div className={styles.productsBannerUnderline}>
              <div className={styles.productsBanner}>
                {" "}
                <p className={`${styles.bold} ${styles.spacingLeft}`}>
                  Opmerking
                </p>
                <p
                  className={`${styles.clientInfosInner} ${styles.extraMargin}`}
                >
                  {extraOptions.Opmerking}
                </p>
              </div>
            </div>
          )}
          {extraOptions.Opmerking !== "" && (
            <div className={styles.lineDivider}></div>
          )}
          <div className={styles.subtotalContainer}>
            <p>Subtotaal: € {totalPrice()},00*</p>
            <p className={`${styles.italic} ${styles.extraSpace}`}>
              * Excl. 21% BTW
            </p>
          </div>
          <h3 className={styles.totalPrice}>
            Totaal met BTW: € {priceWithBTW()},00**
          </h3>
          <p className={styles.disclaimer}>
            <span className={styles.italic}>** Let op:</span> prijzen kunnen
            variëren
          </p>
          <div className={styles.footerButtons}>
            <button onClick={createProduct} className={styles.submitButton}>
              Kopen
            </button>
            <button
              onClick={navigateToStoneCenter}
              className={styles.submitButton}
            >
              Terug naar StoneCenter
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.loading}>
          <div className={styles.iconContainer}>
            <img
              src="../../../assets/logores.png"
              alt="StoneCenter natuursteen logo"
              className={styles.logoIcon}
            />
          </div>
          <div className={styles.innerLoader}>
            Een ogenblik
            <span
              className={`${styles.red} ${styles.spacingRight} ${styles.spacingLeftKlein}`}
            >
              alstublieft.
            </span>{" "}
            U wordt doorgestuurd naar de{" "}
            <span
              className={`${styles.red} ${styles.spacingRight} ${styles.spacingLeftKlein}`}
            >
              winkelwagen
            </span>{" "}
            <div className={styles.spinner}></div>
          </div>
        </div>
      )}
    </div>
  );
}
