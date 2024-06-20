import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { serialize, removeKeukenbladSuffix, formatDate } from "@/utils";
import prisma from "@/prisma/client";
import styles from "../../../styles/offerteId.module.css";

export default function OfferteDetails({ offerteData }) {
  // console.log("detailsPage", offerteData);
  const router = useRouter();
  const { offerteId } = router.query;
  const productName = offerteData.keukenbladen[0]
    ? removeKeukenbladSuffix(offerteData.keukenbladen[0].productNaam)
    : "";
  const extraOptions =
    offerteData.uitsparingSpoelbak ||
    offerteData.uitsparingKookplaat ||
    offerteData.kraangaten ||
    offerteData.inmetingen ||
    offerteData.montages ||
    offerteData.transporten
      ? true
      : false;
  // console.log("extraOptions", extraOptions);
  const extraOptionsArray = [
    offerteData.uitsparingSpoelbak && "Uitsparing spoelbak",
    offerteData.uitsparingKookplaat && "Uitsparing kookplaat",
    offerteData.kraangaten && "Kraangaten",
    offerteData.inmetingen && "Inmetingen",
    offerteData.montages && "Montage",
    offerteData.transporten && "Transport",
  ].filter(Boolean); // Remove any falsy values from the array (null, undefined, empty string)

  // console.log(extraOptionsArray);
  // useEffect(() => {

  //   saveOfferteData(offerteData);
  // }, []);

  const saveOfferteData = async (offerteData) => {
    const serializedData = serialize(offerteData);
    try {
      const response = await fetch("/api/offerteBackup", {
        method: "POST",
        body: JSON.stringify(serializedData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("OfferteData saved successfully.");
      } else {
        console.error("Failed to save OfferteData.");
      }
    } catch (error) {
      console.error("Error saving OfferteData:", error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h2>Offerte Details</h2>
      <div>
        <h2>{productName}</h2>
        <div className={styles.offerteContainer}>
          <div>
            <h3>Offerte overzicht</h3>
            <p>Offerte id: {offerteData.id}</p>

            {offerteData.clientName ? (
              <>
                <p>Datum: {formatDate(offerteData.createdAt)}</p>
                {/* <p>Klant: {offerteData.clientName}</p>
                <p>Email: {offerteData.email}</p> */}
                {/* <p>
                  Adres: {offerteData.address}, {offerteData.stad}.{" "}
                  {offerteData.postcode}.
                </p> */}
              </>
            ) : (
              ""
            )}

            {/* <p>Telefoonnummer: {offerteData.phoneNumber}</p> */}
            {!offerteData.clientName ? (
              <p>
                Plaats: {offerteData.postcode}, {offerteData.stad}
              </p>
            ) : (
              ""
            )}

            <p>Aantal keukenbladen: {offerteData.aantalKeukenbladen}</p>
            {offerteData.spatwanden.length ? (
              <p>Aantal spatwanden: {offerteData.aantalSpatwanden}</p>
            ) : (
              ""
            )}
            {extraOptions ? (
              <div>
                <p>Extra Opties</p>
                {extraOptionsArray.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </div>
            ) : (
              <p>Geen extra opties gekozen</p>
            )}
            {offerteData.zelfAfhalenDelft && (
              <p>Afhaaloptie: zelf afhalen Delft</p>
            )}
            {offerteData.zelfAfhalenBreda && (
              <p>Afhaaloptie: zelf afhalen Breda</p>
            )}
            <p>Prijs zonder 21% BTW: &euro; {offerteData.totaal},00</p>
            <p>
              Prijs met BTW: &euro; {Math.ceil(offerteData.totaal * 1.21)},00
            </p>
          </div>
          <div>
            {offerteData.keukenbladen.length ? (
              <div className={styles.keukenbladenContainer}>
                {offerteData.keukenbladen.map((keukenblad, index) => (
                  <div key={keukenblad.id}>
                    <h4>
                      {offerteData.keukenbladen.length > 1
                        ? `Keukenblad ${index + 1}`
                        : "Keukenblad"}
                    </h4>
                    <p>Variatie: {keukenblad.productVariatie}</p>
                    <p>Breedte: {keukenblad.breedte} cm</p>
                    <p>Lengte: {keukenblad.lengte} cm</p>
                    <p>Bladprijs: &euro; {keukenblad.keukenbladPrijs},00</p>
                    {keukenblad.afwerkingPrijs && (
                      <p>
                        Afwerking prijs: &euro; {keukenblad.afwerkingPrijs},00
                      </p>
                    )}
                    {keukenblad.afwerkingPrijs && (
                      <p>Subtotaal: &euro; {keukenblad.totalePrijs},00</p>
                    )}
                    <p>
                      Prijs met BTW: &euro;{" "}
                      {Math.ceil(keukenblad.totalePrijs * 1.21)}
                      ,00
                    </p>
                    {offerteData.stollenwanden.length > 0 &&
                      offerteData.stollenwanden
                        .filter(
                          (stollenwand) =>
                            Number(stollenwand.keukenbladId) === index
                        )
                        .map((piece, i, arr) => (
                          <div key={i} className={styles.stollenwandContaianer}>
                            <p className={styles.bold}>
                              {arr.length === 1
                                ? "Stollenwand"
                                : `Stollenwand ${i + 1}`}
                            </p>
                            <p>Optie: {piece.optie}</p>
                            <p>Wandbreedte: {piece.breedte}</p>
                            <p>Wandhoogte: {piece.hoogte}</p>
                            {piece.aantal > 1 ? (
                              <p>Aantal: {piece.aantal}</p>
                            ) : (
                              ""
                            )}
                            {piece.aantal > 1 ? (
                              <p>
                                Eenheidsprijs:{" "}
                                {piece.totalePrijs / piece.aantal}
                              </p>
                            ) : (
                              ""
                            )}
                            <p>Prijs: &euro; {piece.totalePrijs},00</p>
                          </div>
                        ))}
                  </div>
                ))}
              </div>
            ) : (
              <p>Geen keukenbladen gekozen</p>
            )}
            {offerteData.spatwanden.length ? (
              <div className={styles.keukenbladenContainer}>
                {offerteData.spatwanden.map((spatwand, index) => (
                  <div key={spatwand.id}>
                    <h4>
                      {offerteData.spatwanden.length > 1
                        ? `Spatwand ${index + 1}`
                        : "Spatwand"}
                    </h4>
                    <p>Breedte: {spatwand.breedte} cm</p>
                    <p>Lengte: {spatwand.lengte} cm</p>
                    <p>Bladprijs: &euro; {spatwand.spatwandPrijs},00</p>
                    {spatwand.afwerkingPrijs && (
                      <p>
                        Afwerking prijs: &euro; {spatwand.afwerkingPrijs},00
                      </p>
                    )}
                    {spatwand.afwerkingPrijs && (
                      <p>Subtotaal: &euro; {spatwand.totalePrijs},00</p>
                    )}
                    <p>
                      Prijs met BTW: &euro;{" "}
                      {Math.ceil(spatwand.totalePrijs * 1.21)}
                      ,00
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Geen spatwanden gekozen</p>
            )}{" "}
          </div>
          <div>
            {extraOptions ? <h4>Extra Opties</h4> : ""}
            <div>
              {extraOptions ? (
                <div className={styles.extraOptionsContainer}>
                  {offerteData.uitsparingSpoelbak ? (
                    <div className={styles.extraOptionSubItem}>
                      <p className={styles.bold}>Uitsparing spoelbak</p>
                      <p>
                        Eenheidsprijs: &euro;{" "}
                        {offerteData.uitsparingSpoelbak.eenheidsprijs}
                      </p>
                      <p>Aantal: {offerteData.uitsparingSpoelbak.aantal}</p>
                      <p>
                        Prijs uitsparingen: &euro;{" "}
                        {Math.ceil(
                          offerteData.uitsparingSpoelbak.eenheidsprijs *
                            offerteData.uitsparingSpoelbak.aantal
                        )}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {offerteData.uitsparingKookplaat ? (
                    <div className={styles.extraOptionSubItem}>
                      <p className={styles.bold}>Uitsparing kookplaat</p>
                      <p>
                        Eenheidsprijs: &euro;{" "}
                        {offerteData.uitsparingKookplaat.eenheidsprijs}
                      </p>
                      <p>Aantal: {offerteData.uitsparingKookplaat.aantal}</p>
                      <p>
                        Prijs uitsparingen: &euro;{" "}
                        {Math.ceil(
                          offerteData.uitsparingKookplaat.eenheidsprijs *
                            offerteData.uitsparingKookplaat.aantal
                        )}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {offerteData.kraangaten ? (
                    <div className={styles.extraOptionSubItem}>
                      <p className={styles.bold}>Kraangaten</p>
                      <p>
                        Eenheidsprijs: &euro;{" "}
                        {offerteData.kraangaten.eenheidsprijs}
                      </p>
                      <p>Aantal: {offerteData.kraangaten.aantal}</p>
                      <p>
                        Prijs kraangaten: &euro;{" "}
                        {Math.ceil(
                          offerteData.kraangaten.eenheidsprijs *
                            offerteData.kraangaten.aantal
                        )}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {offerteData.inmetingen ? (
                    <div className={styles.extraOptionSubItem}>
                      <p className={styles.bold}>Inmeting</p>
                      <p>Afstandoptie: {offerteData.inmetingen.afstandOptie}</p>
                      <p>Prijs: &euro;{offerteData.inmetingen.prijsInmeting}</p>
                    </div>
                  ) : (
                    ""
                  )}
                  {offerteData.transporten ? (
                    <div className={styles.extraOptionSubItem}>
                      <p className={styles.bold}>Transport</p>
                      <p>
                        Afstandoptie: {offerteData.transporten.afstandOptie}
                      </p>
                      <p>
                        Prijs: &euro;
                        {offerteData.transporten.prijsTransport}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {offerteData.montages ? (
                    <div className={styles.extraOptionSubItem}>
                      <p className={styles.bold}>Montage</p>
                      <p>Montageoptie: {offerteData.montages.montageOptie}</p>
                      <p>
                        Prijs: &euro;
                        {offerteData.montages.prijsMontage}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { offerteId } = params;
  // console.log("params:", params);

  try {
    const offerteData = await prisma.offerteData.findUnique({
      where: {
        id: parseInt(offerteId),
      },
      include: {
        keukenbladen: true,
        spatwanden: true,
        stollenwanden: true,
        uitsparingSpoelbak: true,
        uitsparingKookplaat: true,
        kraangaten: true,
        inmetingen: true,
        transporten: true,
        montages: true,
        zelfAfhalenDelft: true,
        zelfAfhalenBreda: true,
      },
    });
    // Client-side JavaScript code

    return {
      props: {
        offerteData: serialize(offerteData),
      },
    };
  } catch (error) {
    console.error("Error fetching OfferteData:", error);
    return {
      props: {
        error: "Error fetching OfferteData",
      },
    };
  }
}
