//const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";
import sharp from "sharp";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    //const email = req.body.email;
    const {
      to,
      subject,
      text,
      clientData,
      keukenBladen,
      stollenwandArray,
      extraOptions,
      subprice,
      purchaseTotalPrice,
      productName,
      uitsparingSpoelbakInfo,
      spoelbakName,
      spoelbakOption,
      kookplaatName,
      kookplaatOption,
      inmetenName,
      inmetenOption,
      transportName,
      transportOption,
      montageName,
      montageOption,
      productImage,
      images,
      productMode,
      doucheBak,
      element,
      opmerking,
      arrayOfProducts,
      totalBankenPrice,
    } = req.body;

    let doucheBakModePrice;
    if (doucheBak?.length !== undefined && element?.length !== undefined) {
      doucheBakModePrice = doucheBak?.totalPrice + element?.totalPrice;
    }
    if (doucheBak?.length !== undefined && element?.length === undefined) {
      doucheBakModePrice = doucheBak?.totalPrice;
    }
    if (doucheBak?.length === undefined && element?.length !== undefined) {
      doucheBakModePrice = element?.totalPrice;
    }
    let priceGaten;
    if (extraOptions.extraOptions.Kraan_gat.chosen) {
      priceGaten =
        extraOptions.extraOptions.Kraan_gat.aantal *
        extraOptions.extraOptions.Kraan_gat.pricePerNumber;
    }

    let htmlString;
    if (productMode === "keukenblad") {
      htmlString = `
      <img src="https://res.cloudinary.com/dc0vws7oo/image/upload/v1716992632/react_cloudinary/axfvtr7q39oeum7hpkuq.png" alt="Logo StoneCenter" style="max-width: 300px;">
      <h2>Dank voor uw Offerte Aanvraag!</h2>
      <h3>Hieronder staan de details:</h3>
      <h3>Klantgegevens</h3>
      <p>Dhr./Mevr. <strong>${clientData.clientData.Voornaam} ${
        clientData.clientData.Achternaam
      }</strong></p>
      <p>E-mail: ${clientData.clientData["E-mailadres"]}</p>
      <p>${clientData.clientData["Straatnaam + huisnummer"]}</p>
      <p>${clientData.clientData.Postcode}</p>
      <p>${clientData.clientData.Woonplaats}</p>
      <p style="margin-bottom: 20px;">Tel. ${
        clientData.clientData.Telefoonnummer
      }</p>
      <div style="border-bottom: 1px solid lightgray; margin-bottom: 10px;"></div>
      <h3>Gekozen producten</h3>
      <h4>Keukenbladen</h4>
      <h4>${productName}</h4>
      <img src="${productImage}" alt="Product Image" style="max-width: 300px; max-height: 200px;">
      ${keukenBladen
        .map((bladGroup, index) =>
          bladGroup
            .map(
              (blad, innerIndex) => `
              <div key=${innerIndex}>
                <h4>Keukenblad ${innerIndex + 1}</h4>
                <p>${blad.name}</p>
                <p>Lengte: ${blad.length} cm</p>
                <p>Breedte: ${blad.width} cm</p>
                <p>Blad Prijs: <strong>&euro; ${blad.price}</strong>*</p>
               ${
                 blad.sidesAfwerkingen.length
                   ? `
                    <p>Zijkanten afwerking: ${blad.sidesAfwerkingen.join(
                      ", "
                    )}</p>
                    <p>Prijs Afwerking: <strong>&euro; ${
                      blad.priceAfwerking
                    }</strong>*</p>
                  `
                   : `
                    <p>Geen afwerking gekozen</p>
                  `
               }
 ${stollenwandArray
   .filter((stollenwand) => stollenwand.keukenbladId === innerIndex)
   .map(
     (stollenwand, stollenIndex) => `
                      <div key=${stollenIndex}>
                          <h4>Stollenwand ${stollenIndex + 1}</h4>
                          <p>Optie: ${stollenwand.optie}</p>
                          <p>Breedte: ${stollenwand.width} cm</p>
                          <p>Hoogte: ${stollenwand.height} cm</p>
                          <p>Aantal: ${stollenwand.aantal}</p>
                          ${
                            stollenwand.aantal > 1
                              ? `
                              <p>Eenheidsprijs: ${stollenwand.subtotal}</p>
                              <p>Prijs stollenwanden: <strong>&euro; ${stollenwand.totalPrice}</strong>*</p>
                              `
                              : `
                              <p>Prijs stollenwand: <strong>&euro; ${stollenwand.totalPrice}</strong>*</p>
                              `
                          }
                         
                        </div>
                      `
   )
   .join("")}
                         
              </div>
            `
            )
            .join("")
        )
        .join("")}
         ${Object.keys(extraOptions.extraOptions)
           .map((optionKey) => {
             const chosenOption = extraOptions.extraOptions[optionKey];
             let optionDetails = "";
             if (chosenOption) {
               const formattedOptionKey = optionKey.replace(/_/g, " ");

               if (
                 optionKey === "Spatwand_rand" &&
                 Array.isArray(chosenOption)
               ) {
                 if (chosenOption.length > 0) {
                   optionDetails = chosenOption
                     .map(
                       (onePiece, index) => `
                <div>
                  <h4>
                    Spatwand/rand: ${onePiece.length === 1 ? "" : index + 1}
                  </h4>
                  <p>Lengte: ${onePiece.length} cm</p>
                  <p>Breedte: ${onePiece.width} cm</p>
                  <p>Prijs: &euro; <strong>${onePiece.price}</strong>*</p>
                  ${
                    onePiece.priceAfwerking !== null &&
                    onePiece.priceAfwerking !== 0
                      ? `<p>Prijs afwerking: <strong>&euro; ${onePiece.priceAfwerking}</strong>*</p>`
                      : `<p>Geen afwerking gekozen</p>`
                  }
                 
                </div>
               `
                     )
                     .join(""); // Join the array of strings into a single string
                 }
               } else if (chosenOption.chosen) {
                 // Handle other options with a chosen key
                 // ... your existing logic for other options with "chosen" key
               }
             }

             return optionDetails;
           })
           .join("")}
      <div style="border-bottom: 1px solid lightgray; margin-bottom: 20px;"></div>
      <h3>Extra Opties</h3>
       ${
         extraOptions.extraOptions.Uitsparing_spoelbak.chosen
           ? `<div>
              <h4>Uitsparing spoelbak</h4>
              <p>Type installatie: ${spoelbakName}</p>
              <p>
              Aantal uitsparing(en):
              <strong>
                ${extraOptions.extraOptions.Uitsparing_spoelbak.aantal}
              </strong>
            </p>
            <p>
            Eenheidsprijs: &euro; ${spoelbakOption.price}*
          </p>
          <p>
            Prijs uitsparing(en):
            <span className={styles.bold}>
               <strong>&euro; ${
                 spoelbakOption.price *
                 extraOptions.extraOptions.Uitsparing_spoelbak.aantal
               }</strong>
            </span>*
          </p>
            </div>`
           : ""
       }
        ${
          extraOptions.extraOptions.Uitsparing_kookplaat.chosen
            ? `<div>
              <h4>Uitsparing kookplaat</h4>
              <p>Type installatie: ${kookplaatName}</p>
              <p>
            Aantal uitsparing(en):
            <strong>
              ${extraOptions.extraOptions.Uitsparing_kookplaat.aantal}
            </strong>
          </p>
          <p>
            Eenheidsprijs: &euro; ${kookplaatOption.price}*
          </p>
          <p>
          Prijs uitsparing(en):
          <strong>
          &euro; ${
            kookplaatOption.price *
            extraOptions.extraOptions.Uitsparing_kookplaat.aantal
          }
          </strong>*
        </p>
            </div>`
            : ""
        }
        ${
          extraOptions.extraOptions.Kraan_gat.chosen &&
          extraOptions.extraOptions.Kraan_gat.aantal !== 0
            ? `<div>
              <h4>Kraan gat(en)</h4>
              <p>Aantal: ${extraOptions.extraOptions.Kraan_gat.aantal}</p>
              <p>
                Prijs: <span>&euro; <strong>${priceGaten}</strong></span>*
              </p>
            </div>`
            : ""
        }
        ${
          extraOptions.extraOptions.Inmeten.chosen
            ? `<div>
              <h4>Inmeting</h4>
              <p>Gekozen optie: ${inmetenName}</p>
              <p>
                Prijs: <span>&euro; <strong>${inmetenOption.price}</strong></span>*
              </p>
            </div>`
            : ""
        }
        ${
          extraOptions.extraOptions.Transport.chosen
            ? `<div>
              <h4>Transport</h4>
              <p>Gekozen optie: ${transportName}</p>
              <p>
                Prijs: <span>&euro; <strong>${transportOption.price}</strong></span>*
              </p>
            </div>`
            : ""
        }
        ${
          extraOptions.extraOptions.Montage.chosen
            ? `<div>
              <h4>Montage</h4>
              <p>Gekozen optie: ${montageName}</p>
              <p>
                Prijs: <span>&euro; <strong>${montageOption.price}</strong></span>*
              </p>
            </div>`
            : ""
        }
        ${
          extraOptions.extraOptions &&
          extraOptions.extraOptions.Transport &&
          (extraOptions.extraOptions.Transport.ZelfAfhalenBreda.chosen ||
            extraOptions.extraOptions.Transport.ZelfAfhalenDelft.chosen)
            ? `
              <div>
                <h4>Afhaaloptie</h4>
                ${
                  extraOptions.extraOptions.Transport.ZelfAfhalenBreda.chosen
                    ? `<p>Zelf Afhalen in Breda</p>`
                    : ""
                }
                ${
                  extraOptions.extraOptions.Transport.ZelfAfhalenDelft.chosen
                    ? `<p>Zelf Afhalen in Delft</p>`
                    : ""
                }
              </div>
            `
            : ""
        }
          <div style="border-bottom: 1px solid lightgray; margin-bottom: 10px;"></div>
          <h4>Opmerking</h4>
          <p>${extraOptions.extraOptions.Opmerking || "Geen opmerking"}</p>
          <div style="border-bottom: 1px solid lightgray; margin-bottom: 10px;"></div>
          <p>Subtotaal: &euro; ${Math.ceil(subprice)},00 (*Excl. 21% BTW)</p>
        <h3>
        Totaal met BTW: &euro; ${Math.ceil(subprice * 1.21)},00**
      </h3>
      <div style="margin-bottom: 8px;">
      <a href="mailto:info@stonecenter.nl" style="text-decoration: none; display: inline-block;">
        <button style="background-color: #4CAF50; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; font-weight: bold; border-radius: 6px; vertical-align: middle; margin-bottom: 0.5rem;">  <span style="line-height: 1.6;">Reply</span></button>
      </a>
    </div>   
    <div style="border-bottom: 1px solid lightgray; margin-bottom: 10px;"></div>
      <p>Bedankt voor uw interesse in StoneCenter</p>
        <p><strong>Als u suggesties heeft om de Online Offerte te verbeteren, of als u een probleem met onze tool heeft ondervonden, voel u dan welkom om deze te delen door een e-mail te sturen naar: </strong><i>info@stonecenter.nl</i></p>
        <p>Voor meer informatie kunt u contact met ons opnemen:</p>
        <div style="border-bottom: 1px solid lightgray; margin-bottom: 10px;"></div>
        <h4>
        <span style="color: red; font-weight: bold;">Stone</span>Center
        Natuursteen Delft
        </h4>
        <p>Einsteinweg 20. 2627 BN. Delft.</p>
       <p>Tel. 015 - 257 49 90</p>
        <p>E-mail: info@stonecenter.nl</p>
`;
    }
    if (productMode === "douchebak") {
      htmlString = `<img src="https://stonecenter-shop.nl/wp-content/uploads/2023/02/cropped-stonecenter-logo-1.png" alt="Image Alt Text" style="max-width: 300px;">
      <h2>Dank voor uw Offerte Aanvraag!</h2>
      <h3>Hieronder staan de details:</h3>
      <h3>Klantgegevens</h3>
      <p>Dhr./Mevr. <strong>${clientData.clientData.Voornaam} ${
        clientData.clientData.Achternaam
      }</strong></p>
      <p>E-mail: ${clientData.clientData["E-mailadres"]}</p>
      <p>${clientData.clientData["Straatnaam + huisnummer"]}</p>
      <p>${clientData.clientData.Postcode}</p>
      <p>${clientData.clientData.Woonplaats}</p>
      <p style="margin-bottom: 20px;">Tel. ${
        clientData.clientData.Telefoonnummer
      }</p>
      <div style="border-bottom: 1px solid lightgray; margin-bottom: 10px;"></div>
      <h3>Gekozen producten</h3>
      ${
        doucheBak.length
          ? `
            <div>
              <h3>Douchebak</h3>
              <p>Lengte: ${doucheBak.length} cm</p>
              <p>Breedte: ${doucheBak.width} cm</p>
              <p>Dikte: ${doucheBak.thickness}</p>
              <p>Oppervlakte afwerking</p>
              <li>${doucheBak.afwerkingType}</li>
              <p>Toepassing</p>
              <li>${doucheBak.toepassingType}</li>
              ${
                doucheBak.amountOfPieces > 1
                  ? `<p>Aantal: ${doucheBak.amountOfPieces}</p>`
                  : ""
              }
              
${
  (element.totalPrice === undefined) | !element.length
    ? `
                  <div style="border-bottom: 1px solid lightgray; margin-top: 10px;"></div>
                  <h4>Totaal: &euro; ${Math.ceil(
                    doucheBak.totalPrice * doucheBak.amountOfPieces
                  )},00 (*Excl. 21% BTW)</h4>
                  <h4><strong>Prijs met BTW: &euro; ${Math.ceil(
                    doucheBak.totalPrice * doucheBak.amountOfPieces * 1.21
                  )},00**</strong></h4>
                  <h5><span style="color: red; font-style: italic;">**Let op:</span> prijzen kunnen variëren.</h5>
                  `
    : ``
}
           `
          : ""
      }
${
  element.length
    ? `<div style="border-bottom: 1px solid lightgray; margin-top: 10px;"></div>
            <div>
              <h3>Element</h3>
              <p>Lengte: ${element.length} cm</p>
              <p>Breedte: ${element.width} cm</p>
              <p>Dikte: ${element.thickness}</p>
              <p>Oppervlakte afwerking</p>
              <li>${element.afwerkingType}</li>
              <p>Toepassing</p>
              <li>${element.toepassingType}</li>
              ${
                element.amountOfPieces > 1
                  ? `<p>Aantal: ${element.amountOfPieces}</p>`
                  : ""
              }
              ${
                (doucheBak.totalPrice === undefined) | !doucheBak.length
                  ? `
                  <div style="border-bottom: 1px solid lightgray; margin-top: 10px;"></div>
                  <h4>Totaal: &euro; ${Math.ceil(
                    element.totalPrice * element.amountOfPieces
                  )},00 (*Excl. 21% BTW)</h4>
                  <h4><strong>Prijs met BTW: &euro; ${Math.ceil(
                    element.totalPrice * element.amountOfPieces * 1.21
                  )},00**</strong></h4>
                  <h5><span style="color: red; font-style: italic;">**Let op:</span> prijzen kunnen variëren.</h5>
                  `
                  : ``
              }
            `
    : ""
}
${
  doucheBak.length && element.length
    ? `
     <div style="border-bottom: 1px solid lightgray; margin-top: 10px;"></div>
     <h4>Totaal: &euro; ${Math.ceil(
       doucheBak.totalPrice * doucheBak.amountOfPieces +
         element.totalPrice * element.amountOfPieces
     )},00 (*Excl. 21% BTW)</h4>
     <h4><strong>Prijs met BTW: &euro; ${Math.ceil(
       (doucheBak.totalPrice * doucheBak.amountOfPieces +
         element.totalPrice * element.amountOfPieces) *
         1.21
     )},00**</strong></h4>
     <h5><span style="color: red; font-style: italic;">**Let op:</span> prijzen kunnen variëren.</h5>
     `
    : ``
}
      </div>
      <h4>Opmerking</h4>
      ${
        opmerking !== ""
          ? `
          <p>${opmerking}</p>`
          : `<p>Geen opmerking ingevult</p>`
      }
      ${
        productMode === "doucheBak" &&
        doucheBak.totalPrice !== undefined &&
        doucheBak.length !== undefined &&
        element.totalPrice !== undefined &&
        element.length !== undefined
          ? `<div style="border-bottom: 1px solid lightgray; margin-top: 10px;"></div>
          <div>
      <p><strong>Totaal:</strong> &euro; ${Math.ceil(
        doucheBakModePrice
      )} (*Excl. 21% BTW)</p>
              <h4>Prijs met BTW: &euro; ${Math.ceil(
                doucheBakModePrice * 1.21
              )},00**</h4>
              <h5><span style="color: red; font-style: italic;">**Let op:</span> prijzen kunnen variëren.</h5>
      </div>`
          : ``
      }
      <div style="border-bottom: 1px solid lightgray; margin-bottom: 10px;"></div>
  <p>Bedankt voor uw interesse in StoneCenter</p>
    <p><strong>Als u suggesties heeft om de Online Offerte te verbeteren, of als u een probleem met onze tool heeft ondervonden, voel u dan welkom om deze te delen door een e-mail te sturen naar: </strong><i>info@stonecenter.nl</i></p>
    <p>Voor meer informatie kunt u contact met ons opnemen:</p>
    <div style="border-bottom: 1px solid lightgray; margin-bottom: 10px;"></div>
    <h4>
    <span style="color: red; font-weight: bold;">Stone</span>Center
    Natuursteen Delft
    </h4>
    <p>Einsteinweg 20. 2627 BN. Delft.</p>
   <p>Tel. 015 - 257 49 90</p>
    <p>E-mail: info@stonecenter.nl</p>
      `;
    }
    if (productMode === "vensterbank") {
      htmlString = `<img src="https://stonecenter-shop.nl/wp-content/uploads/2023/02/cropped-stonecenter-logo-1.png" alt="Image Alt Text" style="max-width: 300px;">
      <h2>Dank voor uw Offerte Aanvraag!</h2>
      <h3>Hieronder staan de details:</h3>
      <h3>Klantgegevens</h3>
      <p>Dhr./Mevr. <strong>${clientData.clientData.Voornaam} ${
        clientData.clientData.Achternaam
      }</strong></p>
      <p>E-mail: ${clientData.clientData["E-mailadres"]}</p>
      <p>${clientData.clientData["Straatnaam + huisnummer"]}</p>
      <p>${clientData.clientData.Postcode}</p>
      <p>${clientData.clientData.Woonplaats}</p>
      <p style="margin-bottom: 20px;">Tel. ${
        clientData.clientData.Telefoonnummer
      }</p>
      <div style="border-bottom: 1px solid lightgray; margin-bottom: 10px;"></div>
      <h3>Gekozen producten</h3>
      <h3>${arrayOfProducts[0].name}</h3>
      ${arrayOfProducts
        .map(
          (blad, innerIndex) =>
            `
              <div key=${innerIndex}>
                ${
                  arrayOfProducts.length > 1
                    ? `<h4>Vensterbank ${innerIndex + 1}</h4>`
                    : `<h4>Vensterbank</h4>`
                }
                <p>Variatie: ${blad.variation}</p>
                <p>Lengte: ${blad.length} cm</p>
                <p>Breedte: ${blad.width} cm</p>
                ${
                  blad.uitsparing !== 0
                    ? `<p>Aantal uitsparingen: ${blad.uitsparing}</p>`
                    : `<p>Geen uitsparing gekozen</p>`
                }
                ${
                  blad.uitsparing !== 0
                    ? `<p>Prijs uitsparing: ${Math.ceil(
                        blad.priceUitsparingen
                      )}</p>`
                    : ``
                }
                ${
                  blad.aantal > 1
                    ? `<p>Eenheidsprijs: ${Math.ceil(blad.pricePerUnit)}</p>`
                    : ``
                }
               <p>Subtotaal: <strong>&euro; ${Math.ceil(
                 blad.totalPrice
               )}</strong>*</strong>*</p>
               </div>`
        )
        .join("")}
      </div>
      <h4>Opmerking</h4>
      ${
        opmerking !== "" || opmerking === undefined
          ? `
          <p>${opmerking}</p>`
          : `<p>Geen opmerking ingevult</p>`
      }
      ${`<div style="border-bottom: 1px solid lightgray; margin-top: 10px;"></div>
          <div>
      <p><strong>Totaal:</strong> &euro; ${Math.ceil(
        totalBankenPrice
      )} (*Excl. 21% BTW)</p>
              <h4>Prijs met BTW: &euro; ${Math.ceil(
                totalBankenPrice * 1.21
              )},00**</h4>
              <h5><span style="color: red; font-style: italic;">**Let op:</span> prijzen kunnen variëren.</h5>
      </div>`}
      <div style="border-bottom: 1px solid lightgray; margin-bottom: 10px;"></div>
  <p>Bedankt voor uw interesse in StoneCenter</p>
    <p><strong>Als u suggesties heeft om de Online Offerte te verbeteren, of als u een probleem met onze tool heeft ondervonden, voel u dan welkom om deze te delen door een e-mail te sturen naar: </strong><i>info@stonecenter.nl</i></p>
    <p>Voor meer informatie kunt u contact met ons opnemen:</p>
    <div style="border-bottom: 1px solid lightgray; margin-bottom: 10px;"></div>
    <h4>
    <span style="color: red; font-weight: bold;">Stone</span>Center
    Natuursteen Delft
    </h4>
    <p>Einsteinweg 20. 2627 BN. Delft.</p>
   <p>Tel. 015 - 257 49 90</p>
    <p>E-mail: info@stonecenter.nl</p>
      `;
    }

    // /api/email, productImage: https://stonecenter-shop.nl/wp-content/uploads/2023/02/orobico_grigio-marmer-keukenblad.webp
    const response = await axios.get(productImage, {
      responseType: "arraybuffer",
    });
    const productImageBuffer = Buffer.from(response.data);

    const convertedProductImageBuffer = await sharp(productImageBuffer)
      .webp({
        quality: 40, // adjust the quality as needed
      })
      .toBuffer();
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const attachments = [
      ...images.map((imageUrl, index) => ({
        filename: `klantbijlage-${index + 1}.jpg`,
        path: imageUrl,
      })),

      {
        filename: "Gekozen product.jpg",
        content: convertedProductImageBuffer,
      },
    ];

    const html = `
          <h2>from html part: multistep branch</h2>
          <h3>an he tag</h3>
         <p>paragraph tag</p>
         <p>Please note this is a non-reply email.</p>
        `;

    const mailOptions = {
      from: "info@stonecenter.nl",
      to,
      subject,
      text,
      html: htmlString,
      attachments: attachments,
    };

    const result = await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: `email sent` });
  } else {
    return res
      .status(405)
      .json({ message: `Method ${req.method} not supported` });
  }
}
