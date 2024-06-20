import React from "react";
import { useEffect } from "react";
import prisma from "@/prisma/client";
import { serialize } from "@/utils";
import styles from "../../styles/offertesBeheerder.module.css";
import {
  formatDate,
  calculateOffertesAverage,
  removeKeukenbladSuffix,
} from "@/utils";
import Link from "next/link";
import path from "path";

const saveAllOffertes = async (offertesData) => {
  try {
    const response = await fetch("/api/saveAllOffertes", {
      method: "POST",
      body: JSON.stringify(offertesData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("OffertesData saved successfully.");
    } else {
      console.error("Failed to save OffertesData.");
    }
  } catch (error) {
    console.error("Error saving OffertesData:", error);
  }
};
// const saveOffertesToJSON = (offertes) => {
//   const dataFilePath = path.join(process.cwd(), "data", "offertes.json");
//   const serializedData = JSON.stringify(offertes);

//   try {
//     fs.writeFileSync(dataFilePath, serializedData);
//     console.log("Offertes data saved successfully.");
//   } catch (error) {
//     console.error("Failed to save offertes data:", error);
//   }
// };

export default function offertesBeheerder({ offertes, allOffers }) {
  // console.log("offertes:", offertes);
  const arrayOfTotals = offertes.map((offerte) => offerte.totaal);
  const offertesAverage = calculateOffertesAverage(arrayOfTotals);
  // saveOffertesToJSON(offertes);

  // useEffect(() => {
  //   saveAllOffertes(allOffers);
  //   // saveOffertesToJSON(offertes);
  // }, []);
  // console.log("allOffers", allOffers.slice(0, 10));
  return (
    <div>
      <h1 className={styles.topBanner}>Welkom bij Offertes Beheerder</h1>
      <div className={styles.summaryContainer}>
        <p className={`${styles.headerBanner} ${styles.spaceUnder}`}>
          Aantal offertes: {offertes.length}
        </p>
        <p className={styles.headerBanner}>
          Gemiddeld/offerte: &euro; {offertesAverage},00
        </p>
      </div>
      <div className={styles.offertesContainer}>
        {offertes.length &&
          offertes.map((offerte) => (
            <div key={offerte.id} className={styles.offerteCard}>
              <p>id: {offerte.id}</p>
              <p>{formatDate(offerte.createdAt)}</p>
              <p>
                {offerte.postcode}, {offerte.stad}
              </p>
              {offerte.productNaam ? (
                <p>{removeKeukenbladSuffix(offerte.productNaam)}</p>
              ) : (
                ""
              )}
              <li>aantal keukenbladen: {offerte.aantalKeukenbladen}</li>
              {offerte.aantalSpatwanden ? (
                <li>aantal spatwanden: {offerte.aantalSpatwanden}</li>
              ) : (
                ""
              )}
              <p>Prijs zonder 21% BTW: &euro; {offerte.totaal}</p>
              <p className={styles.bold}>
                Totaal met BTW: &euro; {Math.ceil(offerte.totaal * 1.21)},00
              </p>
              <Link
                href={`/offertes-beheerder/offertes/${offerte.id}`}
                legacyBehavior
              >
                Details
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const offertes = await prisma.offerteData.findMany({
      include: {
        keukenbladen: {
          select: {
            productNaam: true,
            productAfbeeldingUrl: true,
          },
          take: 1,
        },
      },
    });
    const allOffers = await prisma.offerteData.findMany({
      include: {
        keukenbladen: true,
        spatwanden: true,
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
    const formattedAllOffers = allOffers.map((offer) => {
      const formattedKeukenbladen = Array.isArray(offer.keukenbladen)
        ? offer.keukenbladen
        : [offer.keukenbladen];
      const formattedSpatwanden = Array.isArray(offer.spatwanden)
        ? offer.spatwanden
        : [offer.spatwanden];

      // Similarly, format other related models

      return {
        ...offer,
        keukenbladen: formattedKeukenbladen,
        spatwanden: formattedSpatwanden,

        // Add other formatted related models here
      };
    });

    const formattedOffertes = offertes.map((offerte) => {
      const keukenblad = offerte.keukenbladen[0];
      const productNaam = keukenblad ? keukenblad.productNaam : null;
      const productAfbeeldingUrl = keukenblad
        ? keukenblad.productAfbeeldingUrl
        : null;

      return {
        ...offerte,
        productNaam,
        productAfbeeldingUrl,
      };
    });

    return {
      props: {
        offertes: serialize(formattedOffertes),
        //allOffers: serialize(allOffers),
        allOffers: serialize(formattedAllOffers),
      },
    };
  } catch (error) {
    console.log("db error:", error);
  }
}

// export async function getServerSideProps() {
//   try {
//     const offertes = await prisma.offerteData.findMany({
//       include: {
//         keukenbladen: {
//           select: {
//             productNaam: true,
//             productAfbeeldingUrl: true,
//           },
//           take: 1, // Limit the result to one Keukenblad
//         },
//       },
//     });

//     return {
//       props: {
//         offertes: serialize(offertes),
//       },
//     };
//   } catch (error) {
//     console.log("db error:", error);
//   }
// }
