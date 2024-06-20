import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      clientName,
      address,
      email,
      phoneNumber,
      stad,
      postcode,
      productNaam,
      productVariatie,
      productAfbeeldingUrl,
      aantalKeukenbladen,
      aantalSpatwanden,
      extraOptionsChosen,
      totaal,
      keukenbladen,
      spatwanden,
      stollenwanden,
      uitsparingSpoelbak,
      uitsparingKookplaat,
      kraangaten,
      inmeting,
      transport,
      montage,
      zelfAfhalenDelft,
      zelfAfhalenBreda,
      stollenwandArray,
    } = req.body;

    try {
      // Create the OfferteData entry
      const offerteData = await prisma.offerteData.create({
        data: {
          clientName,
          address,
          email,
          phoneNumber,
          stad,
          postcode,
          aantalKeukenbladen,
          aantalSpatwanden,
          extraOptionsChosen,
          totaal,
        },
      });

      if (keukenbladen) {
        for (const keukenblad of keukenbladen) {
          await prisma.keukenblad.create({
            data: {
              productNaam,
              productVariatie,
              productAfbeeldingUrl,
              lengte: Number(keukenblad.length),
              breedte: Number(keukenblad.width),
              keukenbladPrijs: Number(keukenblad.price),
              afwerking: keukenblad.sidesAfwerkingen.length ? true : false,
              afwerkingPrijs: keukenblad.priceAfwerking
                ? Number(keukenblad.priceAfwerking)
                : null,
              afwerkingVoor: false,
              afwerkingAchter: false,
              afwerkingRechts: false,
              afwerkingLinks: false,
              totalePrijs: keukenblad.priceAfwerking
                ? Number(keukenblad.price) + Number(keukenblad.priceAfwerking)
                : Number(keukenblad.price),
              offerteDataId: offerteData.id,
            },
          });
        }
      }
      if (stollenwandArray) {
        for (const stollenwand of stollenwandArray) {
          try {
            await prisma.stollenwand.create({
              data: {
                productNaam,
                productVariatie,
                productAfbeeldingUrl,
                optie: stollenwand.optie,
                breedte: Number(stollenwand.width),
                hoogte: Number(stollenwand.height),
                aantal: Number(stollenwand.aantal),
                eenheidsPrijs: Number(stollenwand.subtotal),
                totalePrijs: stollenwand.totalPrice,
                keukenbladId: stollenwand.keukenbladId.toString(),
                offerteDataId: offerteData.id,
              },
            });
          } catch (error) {
            console.log("error inserting stollenwand:", error);
          }
        }
      }

      if (spatwanden) {
        for (const spatwand of spatwanden) {
          await prisma.spatwand.create({
            data: {
              productNaam,
              productVariatie: "none for now",
              productAfbeeldingUrl,
              lengte: spatwand.length,
              breedte: spatwand.width,
              spatwandPrijs: spatwand.price,
              afwerking: spatwand.afwerking,
              afwerkingPrijs: spatwand.priceAfwerking
                ? spatwand.priceAfwerking
                : 0,
              totalePrijs: spatwand.priceAfwerking
                ? spatwand.priceAfwerking + spatwand.price
                : spatwand.price,
              offerteDataId: offerteData.id,
            },
          });
        }
      }
      if (stollenwanden) {
        for (const stollenwand of stollenwanden) {
          await prisma.stollenwand.create({
            data: {
              productNaam,
              productVariatie: "none for now",
              productAfbeeldingUrl,
              breedte: stollenwand.width,
              hoogte: stollenwand.height,
              aantal: stollenwand.aantal,
              eenheidsPrijs: stollenwand.subtotal,
              totalePrijs: stollenwand.totalPrice,
              keukenbladId: stollenwand.keukenbladId,
              offerteDataId: offerteData.id,
            },
          });
        }
      }

      if (uitsparingSpoelbak) {
        await prisma.uitsparingSpoelbak.create({
          data: {
            typeInstallatie: uitsparingSpoelbak.typeInstallatie,
            aantal: uitsparingSpoelbak.aantal,
            eenheidsprijs: uitsparingSpoelbak.eenheidsprijs,
            prijsUitsparingen: uitsparingSpoelbak.prijsUitsparingen,
            offerteDataId: offerteData.id,
          },
        });
      }
      if (uitsparingKookplaat) {
        await prisma.uitsparingKookplaat.create({
          data: {
            typeInstallatie: uitsparingKookplaat.typeInstallatie,
            aantal: uitsparingKookplaat.aantal,
            eenheidsprijs: uitsparingKookplaat.eenheidsprijs,
            prijsUitsparingen: uitsparingKookplaat.prijsUitsparingen,
            offerteDataId: offerteData.id,
          },
        });
      }
      if (kraangaten) {
        await prisma.kraangaten.create({
          data: {
            aantal: kraangaten.aantal,
            eenheidsprijs: kraangaten.eenheidsprijs,
            prijsKraangaten: kraangaten.prijsKraangaten,
            offerteDataId: offerteData.id,
          },
        });
      }
      if (inmeting) {
        await prisma.inmeting.create({
          data: {
            afstandOptie: inmeting.afstandOptie,
            prijsInmeting: inmeting.prijsInmeting,
            offerteDataId: offerteData.id,
          },
        });
      }
      if (transport) {
        await prisma.transport.create({
          data: {
            afstandOptie: transport.afstandOptie,
            prijsTransport: transport.prijsTransport,
            offerteDataId: offerteData.id,
          },
        });
      }
      if (montage) {
        await prisma.montage.create({
          data: {
            montageOptie: montage.montageOptie,
            prijsMontage: montage.prijsMontage,
            offerteDataId: offerteData.id,
          },
        });
      }

      if (zelfAfhalenDelft) {
        await prisma.zelfAfhalenDelft.create({
          data: {
            offerteDataId: offerteData.id,
          },
        });
      }
      if (zelfAfhalenBreda) {
        await prisma.zelfAfhalenBreda.create({
          data: {
            offerteDataId: offerteData.id,
          },
        });
      }

      res.status(201).json(offerteData);
    } catch (error) {
      console.error("Error creating OfferteData:", error);
      res.status(500).json({ error: "Error creating OfferteData" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
