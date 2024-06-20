import React from "react";
import Excel from "exceljs";
import { formatDate, serialize } from "@/utils";
import prisma from "@/prisma/client";
import { saveAs } from "file-saver";

export default function download({ excelBuffer, offerteData }) {
  //console.log("client-side", offerteData);
  const downloadExcel = () => {
    const blob = new Blob([Buffer.from(excelBuffer, "base64")], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "offerte_data.xlsx");
  };
  return (
    <div>
      {" "}
      <button onClick={downloadExcel}>Download Excel</button>
    </div>
  );
}
export async function getServerSideProps() {
  try {
    const offerteData = await prisma.offerteData.findMany({
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
    if (!offerteData) {
      console.log("problem fetching offerteData");
      return;
    }

    // Create a new Excel workbook and worksheet
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Offerte Data");

    // Define headers for the Excel worksheet
    worksheet.columns = [
      { header: "Datum", key: "column1", width: 20 },
      { header: "Product", key: "column2", width: 35 },
      { header: "Totaal €", key: "column3", width: 7 },
      { header: "Klantnaam", key: "column4", width: 20 },
      { header: "E-mail", key: "column5", width: 30 },
    ];

    worksheet.mergeCells("A1:E1");
    worksheet.getCell("A1").value = "OnlineOffertes";
    worksheet.getCell("A1").alignment = { horizontal: "center" };
    // Populate data from offerteData to the worksheet
    offerteData.forEach((offerte) => {
      const productNaam = offerte.keukenbladen?.productNaam; // Use optional chaining
      const productAfbeeldingUrl = offerte.keukenbladen?.productAfbeeldingUrl; // Use optional chaining
      worksheet.addRow({
        column1: offerte?.createdAt ? formatDate(offerte.createdAt) : "n/a",
        column2: offerte?.keukenbladen[0]?.productNaam
          ? offerte.keukenbladen[0].productNaam
          : "undefined",
        column3: offerte.totaal,
        column4: offerte.clientName ? offerte.clientName : "n/a",
        column5: offerte?.email ? offerte.email : "n/a",
      });
    });

    // Generate the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    return {
      props: {
        offerteData: serialize(offerteData),
        excelBuffer: buffer.toString("base64"),
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

// export async function getServerSideProps() {
//   try {
//     const offerteData = await prisma.offerteData.findMany({
//       //   include: {
//       //     keukenbladen: true,
//       //     spatwanden: true,
//       //     stollenwanden: true,
//       //     uitsparingSpoelbak: true,
//       //     uitsparingKookplaat: true,
//       //     kraangaten: true,
//       //     inmetingen: true,
//       //     transporten: true,
//       //     montages: true,
//       //     zelfAfhalenDelft: true,
//       //     zelfAfhalenBreda: true,
//       //   },
//       include: {
//         keukenbladen: {
//           select: {
//             productNaam: true,
//             productAfbeeldingUrl: true,
//           },
//           take: 1,
//         },
//       },
//     });
//     if (!offerteData) {
//       console.log("problem fetching offerteData");
//       return;
//     }
//     // console.log("good =) offerteData:", offerteData);
//     // return {
//     //   props: {
//     //     offerteData: serialize(offerteData),
//     //   },
//     // };

//     // Create a new Excel workbook and worksheet
//     const workbook = new Excel.Workbook();
//     const worksheet = workbook.addWorksheet("Offerte Data");

//     // Define headers for the Excel worksheet
//     worksheet.columns = [
//       { header: "Product", key: "column1", width: 20 },
//       { header: "Totaal", key: "column2", width: 20 },
//     ];

//     // Populate data from offerteData to the worksheet
//     offerteData.forEach((offerte) => {
//       worksheet.addRow({
//         column1: productNaam,
//         column2: offerte.totaal,
//       });
//     });

//     // Generate the Excel file
//     const buffer = await workbook.xlsx.writeBuffer();
//     const formattedOffertes = offerteData.map((offerte) => {
//       const keukenblad = offerte.keukenbladen[0];
//       const productNaam = keukenblad ? keukenblad.productNaam : null;
//       const productAfbeeldingUrl = keukenblad
//         ? keukenblad.productAfbeeldingUrl
//         : null;

//       return {
//         ...offerte,
//         productNaam,
//         productAfbeeldingUrl,
//       };
//     });
//     return {
//       props: {
//         offerteData: serialize(formattedOffertes),
//         excelBuffer: buffer.toString("base64"),
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching OfferteData:", error);
//     return {
//       props: {
//         error: "Error fetching OfferteData",
//       },
//     };
//   }
// }
