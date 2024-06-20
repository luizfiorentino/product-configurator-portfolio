import React from "react";
import { useState } from "react";
import styles from "./DouchebakStep3.module.css";
import { FaCheck } from "react-icons/fa";
import axios from "axios";

export default function DouchebakStep3({
  loadingStep3,
  setLoadingStep3,
  clientData,
  productData,
  doucheBak,
  element,
  opmerking,
}) {
  const offerteImage = productData?.images[0]?.src;
  let offerteData = `
  <h5>Douchebak op maat</h5>`;
  // For now, remove client data from product description
  // <p>Dhr./Mevr.: ${clientData.Voornaam} ${clientData.Achternaam}</p>
  // <p>E-mail: ${clientData["E-mailadres"]}</p>
  // <p>Adres: ${clientData["Straatnaam + huisnummer"]}, ${clientData.Postcode}, ${clientData.Woonplaats}</p>
  // <p>Tel.: ${clientData.Telefoonnummer}</p>;
  if (doucheBak.length && Object.keys(element).length !== 0) {
    offerteData += ` <h6>Douchebak:</h6>`;
  }
  if (doucheBak.length) {
    offerteData += `
   <li>Variatie (dikte): ${doucheBak.thickness}</li>
    <li>Lengte: ${doucheBak.length} cm</li>
    <li> Breedte: ${doucheBak.width} cm</li>
    <p>Oppervlakte afwerking: ${doucheBak.afwerkingType}</p>
    <p>Toepassing: ${doucheBak.toepassingType}</p>
    `;
  }
  if (doucheBak.amountOfPieces > 1) {
    offerteData += `
      <p>Aantal: ${doucheBak.amountOfPieces}</p>`;
  }
  if (doucheBak.amountOfPieces > 1) {
    offerteData += `
      <li>Eenheidsprijs: € ${doucheBak.totalPrice}*</li>`;
  }
  if (doucheBak.length) {
    offerteData += `
      <p>Subtotaal: € ${Math.ceil(doucheBak.total)},00*</p>`;
  }
  if (element.length) {
    offerteData += `
      <h6>Element:</h6>
      <li>Variatie (dikte): ${element.thickness}</li>
      <li>Lengte: ${element.length} cm</li>
      <li>Breedte: ${element.width} cm</li>
      <p>Oppervlakte afwerking: ${element.afwerkingType}</p>
        <p>Toepassing: ${element.toepassingType}</p>
    `;
  }
  if (element.amountOfPieces > 1) {
    offerteData += `
      <p>Aantal:
        ${element.amountOfPieces}</p>`;
  }
  if (element.amountOfPieces > 1) {
    offerteData += `
    <li>Eenheidsprijs: € ${element.totalPrice}*</li>`;
  }
  if (element.length) {
    offerteData += `
      <p>Subtotaal: € ${element.total},00*</p>`;
  }
  if (opmerking !== "") {
    offerteData += `
      <p>Opmerking:
        ${opmerking}</p>
    `;
  }
  offerteData += `
        <p>*Prijzen zijn Excl. 21% BTW</p>
      `;

  const subtotalPrice = Math.ceil(
    doucheBak.totalPrice * doucheBak.amountOfPieces +
      (element.totalPrice ? element.totalPrice * element.amountOfPieces : 0)
  );
  const createProduct = async () => {
    try {
      const newProductData = {
        name: offerteData,
        type: "simple",
        regular_price: `${Math.ceil(subtotalPrice) * 1.21}`,
        description: offerteData,
        categories: [{ id: 602 }],
        images: [
          {
            src: offerteImage,
            alt: "afbeelding online offerte: keukenblad op maat",
          },
        ],
        catalog_visibility: "hidden",
      };
      setLoadingStep3(true);
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
      const newProductId = response.data.id;
      // await axios.post(
      //   `/api/scheduledDelete?apiKey=${process.env.NEXT_PUBLIC_REACT_APP_API_KEY}&apiSecret=${process.env.NEXT_PUBLIC_REACT_APP_API_SECRET}`,
      //   { productId: newProductId }
      // );
      window.location.href = `https://stonecenter-shop.nl/winkelwagen/?add-to-cart=${newProductId}`;
      setLoadingStep3(false);
    } catch (error) {
      console.error("Error creating product:", error);
      setLoadingStep3(false);
    }
  };

  return (
    <div>
      {!loadingStep3 ? (
        <div className={styles.wrapperContainer}>
          <h3>Dhr./Mevr. </h3>
          <div className={styles.clientInfosInner}>
            <p> {`${clientData.Voornaam} ${clientData.Achternaam}`}</p>
            <p>E-mail: {clientData["E-mailadres"]}</p>
            <p>
              {clientData["Straatnaam + huisnummer"]}. {clientData.Postcode}.
            </p>
            <p>{clientData.Woonplaats}</p>
            <p>Tel. {clientData.Telefoonnummer}</p>
          </div>
          <div className={styles.divider}></div>
          <div>
            <div className={styles.douchebakAndElement}>
              {doucheBak.length && (
                <div className={styles.overviewCanvas}>
                  <h4 className={styles.overviewBanner}>Douchebak</h4>
                  {!doucheBak.length && (
                    <>
                      <p>Geen douchebak gekozen</p>{" "}
                      <div className={styles.divider}></div>
                    </>
                  )}
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
                    <label>Dikte: {doucheBak.thickness}</label>
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
                    <div className={styles.itemBanner}>
                      <span className={styles.greenCheckIcon}>
                        <FaCheck />
                      </span>
                      <p>
                        <span className={styles.bold}>Aantal:</span>{" "}
                        {doucheBak.amountOfPieces}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className={`${styles.divider} ${styles.nodiv}`}></div>
                  {!element.length && (
                    <div className={styles.itemBanner}>
                      <p> &bull; Geen element gekozen</p>
                    </div>
                  )}
                </div>
              )}
              {element.length && (
                <div className={styles.overviewCanvas}>
                  <h4 className={styles.overviewBanner}>Element</h4>
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
                    <label> {element.afwerkingType}</label>
                  </div>
                  <h4 className={styles.optionBanner}>Toepassing</h4>
                  <div className={styles.itemBanner}>
                    <span className={styles.greenCheckIcon}>
                      <FaCheck />
                    </span>
                    <label>{element.toepassingType}</label>
                  </div>
                  {element.amountOfPieces > 1 ? (
                    <div className={styles.itemBanner}>
                      <span className={styles.greenCheckIcon}>
                        <FaCheck />
                      </span>
                      <p>
                        <span className={styles.bold}>Aantal:</span>{" "}
                        {element.amountOfPieces}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
            {doucheBak.length && element.length && (
              <div className={styles.pricesBorder}>
                <p className={styles.priceParagraph}>
                  Totaal: &euro; {subtotalPrice}{" "}
                  <span className={styles.normalWeight}>(*Excl. 21% BTW)</span>
                </p>
                <h4 className={styles.priceParagraph}>
                  Totaal met BTW: &euro; {Math.ceil(subtotalPrice * 1.21)}
                  ,00**
                </h4>
              </div>
            )}
            {doucheBak.length && !element.length && (
              <div className={styles.pricesBorder}>
                <p className={styles.priceParagraph}>
                  Subtotaal: &euro; {Math.ceil(subtotalPrice)},00{" "}
                  <span className={styles.normalWeight}>(*Excl. 21% BTW)</span>
                </p>
                <p className={styles.priceParagraph}>
                  Prijs met BTW:{" "}
                  <span className={styles.bold}>
                    {" "}
                    &euro; {Math.ceil(subtotalPrice * 1.21)},00**
                  </span>{" "}
                </p>
              </div>
            )}
            {!doucheBak.length && element.length && (
              <div className={styles.pricesBorder}>
                <p>
                  Subtotaal: &euro; {Math.ceil(element.totalPrice)},00{" "}
                  <span className={styles.normalWeight}>(*Excl. 21% BTW)</span>
                </p>
                <p>
                  Prijs met BTW:{" "}
                  <span className={styles.bold}>
                    {" "}
                    &euro; {Math.ceil(element.totalPrice * 1.21)},00**
                  </span>{" "}
                </p>
              </div>
            )}
            <p className={`${styles.red} ${styles.bold}`}>
              **Let op: prijzen kunnen varieëren
            </p>

            <div className={`${styles.backSCButton} ${styles.footerButtons}`}>
              <button onClick={createProduct} className={styles.submitButton}>
                Kopen
              </button>

              <a
                href="https://www.stonecenter-shop.nl"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <button className={`${styles.sumbitButton}`}>
                  Terug naar StoneCenter
                </button>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.loading}>
          <div className={styles.iconContainer}>
            <img
              src="https://stonecenter-shop.nl/wp-content/uploads/2023/02/cropped-stonecenter-logo-1.png"
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
