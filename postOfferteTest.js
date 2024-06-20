const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function saveOfferteData() {
  try {
    // Read the JSON file
    const offertesData = JSON.parse(
      fs.readFileSync("./offertesBackup.json", "utf-8")
    );

    const offertesDataToProcess = offertesData.slice(0, 2);
    await Promise.all(
      offertesData.map(async (postData) => {
        const createdOfferte = await prisma.offerteData.create({
          data: {
            clientName: postData.clientName,
            address: postData.address,
            email: postData.email,
            phoneNumber: postData.phoneNumber,
            stad: postData.stad,
            postcode: postData.postcode,
            aantalKeukenbladen: postData.aantalKeukenbladen,
            aantalSpatwanden: postData.aantalSpatwanden,
            extraOptionsChosen: postData.extraOptionsChosen,
            totaal: postData.totaal,
            createdAt: postData.createdAt,
            updatedAt: postData.updatedAt,
          },
        });

        const offerteDataId = createdOfferte.id;

        const keukenbladen = postData.keukenbladen.map((keukenblad) => ({
          productNaam: keukenblad.productNaam,
          productVariatie: keukenblad.productVariatie,
          productAfbeeldingUrl: keukenblad.productAfbeeldingUrl,
          lengte: keukenblad.lengte,
          breedte: keukenblad.breedte,
          keukenbladPrijs: keukenblad.keukenbladPrijs,
          afwerking: keukenblad.afwerking,
          afwerkingPrijs: keukenblad.afwerkingPrijs,
          afwerkingVoor: keukenblad.afwerkingVoor,
          afwerkingAchter: keukenblad.afwerkingAchter,
          afwerkingRechts: keukenblad.afwerkingRechts,
          afwerkingLinks: keukenblad.afwerkingLinks,
          totalePrijs: keukenblad.totalePrijs,
          offerteDataId: offerteDataId,
        }));

        await prisma.keukenblad.createMany({
          data: keukenbladen,
        });

        if (postData.spatwanden && postData.spatwanden.length > 0) {
          const spatwanden = postData.spatwanden.map((spatwand) => ({
            productNaam: spatwand.productNaam,
            productVariatie: spatwand.productVariatie,
            productAfbeeldingUrl: spatwand.productAfbeeldingUrl,
            lengte: spatwand.lengte,
            breedte: spatwand.breedte,
            spatwandPrijs: spatwand.spatwandPrijs,
            afwerking: spatwand.afwerking,
            afwerkingPrijs: spatwand.afwerkingPrijs,
            totalePrijs: spatwand.totalePrijs,
            offerteDataId: offerteDataId,
          }));

          await prisma.spatwand.createMany({
            data: spatwanden,
          });
        } else {
          console.log("");
        }

        const uitsparingSpoelbakData = postData.uitsparingSpoelbak;
        if (uitsparingSpoelbakData) {
          await prisma.uitsparingSpoelbak.create({
            data: {
              typeInstallatie: uitsparingSpoelbakData.typeInstallatie,
              aantal: uitsparingSpoelbakData.aantal,
              eenheidsprijs: uitsparingSpoelbakData.eenheidsprijs,
              prijsUitsparingen: uitsparingSpoelbakData.prijsUitsparingen,
              offerteDataId: offerteDataId,
            },
          });
        }

        const uitsparingKookplaatData = postData.uitsparingKookplaat;
        if (uitsparingKookplaatData) {
          await prisma.uitsparingKookplaat.create({
            data: {
              typeInstallatie: uitsparingKookplaatData.typeInstallatie,
              aantal: uitsparingKookplaatData.aantal,
              eenheidsprijs: uitsparingKookplaatData.eenheidsprijs,
              prijsUitsparingen: uitsparingKookplaatData.prijsUitsparingen,
              offerteDataId: offerteDataId,
            },
          });
        }

        const kraangatenData = postData.kraangaten;
        if (kraangatenData) {
          await prisma.kraangaten.create({
            data: {
              aantal: kraangatenData.aantal,
              eenheidsprijs: kraangatenData.eenheidsprijs,
              prijsKraangaten: kraangatenData.prijsKraangaten,
              offerteDataId: offerteDataId,
            },
          });
        }

        const inmetingenData = postData.inmetingen;
        if (inmetingenData) {
          await prisma.inmeting.create({
            data: {
              afstandOptie: inmetingenData.afstandOptie,
              prijsInmeting: inmetingenData.prijsInmeting,
              offerteDataId: offerteDataId,
            },
          });
        }
        const transportenData = postData.transporten;
        if (transportenData) {
          await prisma.transport.create({
            data: {
              afstandOptie: transportenData.afstandOptie,
              prijsTransport: transportenData.prijsTransport,
              offerteDataId: offerteDataId,
            },
          });
        }

        const montagesData = postData.montages;
        if (montagesData) {
          await prisma.montage.create({
            data: {
              montageOptie: montagesData.montageOptie,
              prijsMontage: montagesData.prijsMontage,
              offerteDataId: offerteDataId,
            },
          });
        }

        const zelfAfhalenDelftData = postData.zelfAfhalenDelft;
        if (zelfAfhalenDelftData) {
          await prisma.zelfAfhalenDelft.create({
            data: {
              offerteDataId: offerteDataId,
            },
          });
        }

        const zelfAfhalenBredaData = postData.zelfAfhalenBreda;
        if (zelfAfhalenBredaData) {
          await prisma.zelfAfhalenBreda.create({
            data: {
              offerteDataId: offerteDataId,
            },
          });
        }

        console.log("OfferteData and related entries created successfully:");
      })
    );
  } catch (error) {
    console.error("Error saving OfferteData:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Usage
saveOfferteData();
