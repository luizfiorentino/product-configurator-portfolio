import React from "react";
import { useState } from "react";
import styles from "./OverzichtVensterbank.module.css";
import Header from "../header/Header";
import { FaCheck } from "react-icons/fa";
export default function OverzichtVensterbank({
  arrayOfProducts,
  clientData,
  productData,
  totalBankenPrice,
}) {
  const [linkProduct, setLinkProduct] = useState("https://stonecenter-shop.nl");
  const navigateToStoneCenter = () => {
    const stoneCenterUrl = linkProduct;
    window.location.href = stoneCenterUrl;
  };
  return (
    <div className={styles.overzichtFormContainer}>
      <Header />
      <div className={styles.productsBanner}>
        <h3 className={styles.prodBanner}>{arrayOfProducts[0].name}</h3>
      </div>
      <div className={styles.KBTopImage}>
        <img
          src={productData && productData[0]?.images[0].src}
          alt="StoneCenter NatuurSteen product"
          className={styles.productImage}
        />
      </div>
      <div className={styles.productsBannerUnderline}>
        <div className={styles.clientDataArea}>
          <h3 className={styles.clientBanner}>Dhr./Mevr. </h3>
          <div className={styles.clientInfosInner}>
            <p className={`${styles.bold} ${styles.clientName}`}>
              {" "}
              {`${clientData.Voornaam} ${clientData.Achternaam}`}
            </p>
            <p className={styles.clientInfoParagraph}>
              E-mail: {clientData["E-mailadres"]}
            </p>
            <p className={styles.clientInfoParagraph}>
              {clientData["Straatnaam + huisnummer"]}. {clientData.Postcode}.
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
      {!arrayOfProducts.length ? (
        <p>Geen product toegevoegd</p>
      ) : (
        <div className={styles.productSummary}>
          <div className={styles.areaWrapper}>
            {arrayOfProducts.length > 1 && (
              <div className={`${styles.itemBanner} ${styles.typeProdLabel}`}>
                <span className={styles.greenCheckIcon}>
                  <FaCheck />
                </span>
                <label>Gekozen Producten</label>
              </div>
            )}
            <div className={`${styles.KBExternal} `}>
              {arrayOfProducts &&
                arrayOfProducts.map((keukenBlad, index) => {
                  return (
                    <div className={styles.keukenBladContainer} key={index}>
                      <div className={styles.KBListInner}>
                        <div className={` ${styles.canvas}`}>
                          <div>
                            <div
                              className={`${styles.itemBanner} ${styles.spaceTop} ${styles.spaceBottom}`}
                            >
                              <label
                                className={`${styles.bold} ${styles.biggerFont} ${styles.spacingDown}`}
                              >{`Vensterbank ${
                                arrayOfProducts.length > 1
                                  ? arrayOfProducts.indexOf(keukenBlad) + 1
                                  : ""
                              }`}</label>
                            </div>
                            <div className={styles.itemBanner}>
                              <span className={styles.greenCheckIcon}>
                                <FaCheck />
                              </span>
                              <label>
                                <span className={styles.bold}>
                                  Dikte variatie:
                                </span>{" "}
                                {keukenBlad.variation}
                              </label>
                            </div>
                            <div className={styles.itemBanner}>
                              <span className={styles.greenCheckIcon}>
                                <FaCheck />
                              </span>
                              <label>
                                <span className={styles.bold}>Lengte:</span>{" "}
                                {keukenBlad.length} cm
                              </label>
                            </div>
                            <div className={styles.itemBanner}>
                              <span className={styles.greenCheckIcon}>
                                <FaCheck />
                              </span>
                              <label>
                                <span className={styles.bold}>Breedte:</span>{" "}
                                {keukenBlad.width} cm
                              </label>
                            </div>
                            {keukenBlad.uitsparing > 0 ? (
                              <div className={styles.itemBanner}>
                                <span className={styles.greenCheckIcon}>
                                  <FaCheck />
                                </span>
                                <label>
                                  <span className={styles.bold}>
                                    Aantal Uitsparingen:
                                  </span>{" "}
                                  {keukenBlad.uitsparing}
                                </label>
                              </div>
                            ) : (
                              <div className={styles.itemBanner}>
                                &bull; <label>Geen uitsparing gekozen</label>
                              </div>
                            )}

                            {keukenBlad.aantal > 1 ? (
                              <div className={styles.itemBanner}>
                                <span className={styles.greenCheckIcon}>
                                  <FaCheck />
                                </span>
                                <label>
                                  <span className={styles.bold}>
                                    Aantal Vensterbanken:
                                  </span>{" "}
                                  {keukenBlad.aantal}
                                </label>
                              </div>
                            ) : (
                              ""
                            )}
                            <div className={styles.separator}></div>
                            {keukenBlad.aantal > 1 ? (
                              <div className={styles.itemBanner}>
                                <label>
                                  {"\u2022"} Eenheidsprijs: &euro;{" "}
                                  {keukenBlad.pricePerUnit}*
                                </label>
                              </div>
                            ) : (
                              ""
                            )}
                            {arrayOfProducts.length > 1 ? (
                              <div className={styles.itemBanner}>
                                <label>
                                  {" "}
                                  {"\u2022"}{" "}
                                  <span className={styles.bold}>
                                    Subtotaal:
                                  </span>{" "}
                                  &euro; {keukenBlad.totalPrice}*
                                </label>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className={styles.areaWrapper}></div>
        </div>
      )}
      <div className={styles.subtotalContainer}>
        <p className={styles.subtotaalBanner}>
          Subtotaal: € {totalBankenPrice},00*
        </p>
        <p className={`${styles.italic} ${styles.extraSpace}`}>
          * Excl. 21% BTW
        </p>
      </div>
      <h3 className={styles.totalPrice}>
        Totaal met BTW: € {Math.ceil(totalBankenPrice * 1.21)},00**
      </h3>
      <p className={styles.disclaimer}>
        <span className={styles.italic}>** Let op:</span> prijzen kunnen
        variëren
      </p>
      <div className={styles.footerButtons}>
        {/* <button onClick={() => setFormStep(2)} className={styles.backButton}>
      Vorig
    </button> */}
        <button onClick={navigateToStoneCenter} className={styles.submitButton}>
          Terug naar StoneCenter
        </button>
      </div>
    </div>
  );
}
