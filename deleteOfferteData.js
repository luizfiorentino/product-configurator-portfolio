// deleteOfferteData.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteOfferteDataByEmail(email) {
  try {
    const offerteDataEntries = await prisma.offerteData.findMany({
      where: {
        email: email,
      },
      include: {
        keukenbladen: true,
        stollenwanden: true,
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

    for (const offerteData of offerteDataEntries) {
      const {
        keukenbladen,
        stollenwanden,
        spatwanden,
        uitsparingSpoelbak,
        uitsparingKookplaat,
        kraangaten,
        inmetingen,
        transporten,
        montages,
        zelfAfhalenDelft,
        zelfAfhalenBreda,
      } = offerteData;

      if (keukenbladen.length > 0) {
        await prisma.keukenblad.deleteMany({
          where: {
            offerteDataId: offerteData.id,
          },
        });
      }
      if (stollenwanden.length > 0) {
        await prisma.stollenwand.deleteMany({
          where: {
            offerteDataId: offerteData.id,
          },
        });
      }
      if (spatwanden.length > 0) {
        await prisma.spatwand.deleteMany({
          where: {
            offerteDataId: offerteData.id,
          },
        });
      }

      if (uitsparingSpoelbak) {
        await prisma.uitsparingSpoelbak.delete({
          where: {
            offerteDataId: offerteData.id,
          },
        });
      }
      if (uitsparingKookplaat) {
        await prisma.uitsparingKookplaat.delete({
          where: {
            offerteDataId: offerteData.id,
          },
        });
      }
      if (kraangaten) {
        await prisma.kraangaten.delete({
          where: {
            offerteDataId: offerteData.id,
          },
        });
      }
      if (inmetingen) {
        await prisma.inmeting.delete({
          where: {
            offerteDataId: offerteData.id,
          },
        });
      }
      if (transporten) {
        await prisma.transport.delete({
          where: {
            offerteDataId: offerteData.id,
          },
        });
      }
      if (montages) {
        await prisma.montage.delete({
          where: {
            offerteDataId: offerteData.id,
          },
        });
      }
      if (zelfAfhalenDelft) {
        await prisma.zelfAfhalenDelft.delete({
          where: {
            offerteDataId: offerteData.id,
          },
        });
      }
      if (zelfAfhalenBreda) {
        await prisma.zelfAfhalenBreda.delete({
          where: {
            offerteDataId: offerteData.id,
          },
        });
      }

      await prisma.offerteData.delete({
        where: {
          id: offerteData.id,
        },
      });
    }
    // console.log("OfferteData and related entries deleted successfully.");
  } catch (error) {
    console.error("Error deleting OfferteData and related entries:", error);
  } finally {
    await prisma.$disconnect();
  }
}
//deleteOfferteDataByEmail("Luka@hotmai.com");

// Deletes one offerteData entry and related models by id
// async function deleteOfferteData(offerteId) {
//   try {
//     const offerte = await prisma.offerteData.findUnique({
//       where: {
//         id: offerteId,
//       },
//       include: {
//         keukenbladen: true,
//         stollenwanden: true,
//         spatwanden: true,
//         uitsparingSpoelbak: true,
//         uitsparingKookplaat: true,
//         kraangaten: true,
//         inmetingen: true,
//         transporten: true,
//         montages: true,
//         zelfAfhalenDelft: true,
//         zelfAfhalenBreda: true,
//       },
//     });

//     if (!offerte) {
//       console.error("OfferteData not found.");
//       return;
//     }

//     const {
//       keukenbladen,
//       stollenwanden,
//       spatwanden,
//       uitsparingSpoelbak,
//       uitsparingKookplaat,
//       kraangaten,
//       inmetingen,
//       transporten,
//       montages,
//       zelfAfhalenDelft,
//       zelfAfhalenBreda,
//     } = offerte;

//     // Check if there are related entries before attempting to delete them
//     if (keukenbladen.length > 0) {
//       await prisma.keukenblad.deleteMany({
//         where: {
//           offerteDataId: offerteId,
//         },
//       });
//     }
//     if (stollenwanden.length > 0) {
//       await prisma.stollenwand.deleteMany({
//         where: {
//           offerteDataId: offerteId,
//         },
//       });
//     }
//     if (spatwanden.length > 0) {
//       await prisma.spatwand.deleteMany({
//         where: {
//           offerteDataId: offerteId,
//         },
//       });
//     }

//     if (uitsparingSpoelbak) {
//       await prisma.uitsparingSpoelbak.delete({
//         where: {
//           offerteDataId: offerteId,
//         },
//       });
//     }
//     if (uitsparingKookplaat) {
//       await prisma.uitsparingKookplaat.delete({
//         where: {
//           offerteDataId: offerteId,
//         },
//       });
//     }
//     if (kraangaten) {
//       await prisma.kraangaten.delete({
//         where: {
//           offerteDataId: offerteId,
//         },
//       });
//     }
//     if (inmetingen) {
//       await prisma.inmeting.delete({
//         where: {
//           offerteDataId: offerteId,
//         },
//       });
//     }
//     if (transporten) {
//       await prisma.transport.delete({
//         where: {
//           offerteDataId: offerteId,
//         },
//       });
//     }
//     if (montages) {
//       await prisma.montage.delete({
//         where: {
//           offerteDataId: offerteId,
//         },
//       });
//     }
//     if (zelfAfhalenDelft) {
//       await prisma.zelfAfhalenDelft.delete({
//         where: {
//           offerteDataId: offerteId,
//         },
//       });
//     }
//     if (zelfAfhalenBreda) {
//       await prisma.zelfAfhalenBreda.delete({
//         where: {
//           offerteDataId: offerteId,
//         },
//       });
//     }

//     await prisma.offerteData.delete({
//       where: {
//         id: offerteId,
//       },
//     });

//     // console.log("OfferteData and related entries deleted successfully.");
//   } catch (error) {
//     console.error("Error deleting OfferteData and related entries:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
// deleteOfferteData(262);
