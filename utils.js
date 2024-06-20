import axios from "axios";

export function serialize(data) {
  return JSON.parse(JSON.stringify(data));
}

export const fetchUserData = async (userId, setLoading, setUser) => {
  try {
    setLoading(true);
    const { data: userData } = await axios.get(
      `https://stonecenter-shop.nl/wp-json/wc/v3/customers/${userId}`,
      {
        params: {
          consumer_key: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
          consumer_secret: process.env.NEXT_PUBLIC_REACT_APP_API_SECRET,
        },
      }
    );

    setUser(userData);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.error("Error fetching user data:", error);
  }
};

export function generateOfferteData(
  clientData,
  keukenBladen,
  stollenwandArray,
  extraOptions
) {
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

  let offerteData = ``;

  if (keukenBladen.length) {
    offerteData += `
      <h5>Product(en):</h5>
    `;
    keukenBladen.forEach((keukenBlad, index) => {
      offerteData += `
        <h6>Keukenblad ${index + 1}:</h6>
          <li>Variatie (dikte): ${keukenBlad.name}</li>
          <li> Lengte: ${keukenBlad.length} cm</li>
          <li>Breedte: ${keukenBlad.width} cm</li>
          
      `;
      if (keukenBlad.sidesAfwerkingen.length) {
        offerteData += `
          <p>Zijden afwerking:</p>
        `;
        keukenBlad.sidesAfwerkingen.forEach((side, index) => {
          offerteData += `
            <li>${side}</li>
          `;
        });
      } else {
        offerteData += `
        <li>Geen afwerking gekozen</li>
        `;
      }
      const relevantStollenwanden = stollenwandArray.filter(
        (stollenwand) => stollenwand.keukenbladId === index
      );
      if (relevantStollenwanden.length) {
        relevantStollenwanden.forEach((stollenwand, stollenIndex) => {
          offerteData += `
            <h5>Stollenwand ${stollenIndex + 1}:</h5>
              <li>Optie: ${stollenwand.optie}</li>
              <li>Wandbreedte: ${stollenwand.width} cm</li>
              <li>Wandhoogte: ${stollenwand.height} cm</li>
              <li>Aantal: ${stollenwand.aantal}</li>
          `;
        });
      }
    });
  }
  if (extraOptions.Spatwand_rand.length) {
    extraOptions.Spatwand_rand.forEach((onePiece, index) => {
      offerteData += `
        <h5>Spatwand/rand ${index + 1}:</h5>
          <li>Lengte: ${onePiece.length} cm</li>
          <li>Breedte: ${onePiece.width} cm<li>
      `;
      if (onePiece.priceAfwerking !== 0) {
        offerteData += `
        <li>Afwerking gekozen</li>
         `;
      } else {
        offerteData += `
        <li>Geen afwerking gekozen</li>
        `;
      }
    });
  }
  if (extraOptions.Uitsparing_spoelbak.chosen) {
    const uitsparingSpoelbakInfo = getSelectedOptionInfo("Uitsparing_spoelbak");
    const { selectedOptionName: spoelbakName, selectedOption: spoelbakOption } =
      uitsparingSpoelbakInfo;
    offerteData += `
      <h6>Uitsparing spoelbak:</h6>
        <li>Type installatie: ${spoelbakName}</li>
        <li>Aantal uitsparing(en): ${extraOptions.Uitsparing_spoelbak.aantal}</li>
       `;
  }
  if (extraOptions.Uitsparing_kookplaat.chosen) {
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
    const uitsparingSpoelbakInfo = getSelectedOptionInfo(
      "Uitsparing_kookplaat"
    );
    const {
      selectedOptionName: kookplaatName,
      selectedOption: kookplaatOption,
    } = uitsparingSpoelbakInfo;
    offerteData += `
      <h6>Uitsparing kookplaat:</h6>
      <li>Type installatie: ${kookplaatName}<li>
      <li>Aantal uitsparing(en): ${extraOptions.Uitsparing_kookplaat.aantal}</li>
       `;
  }
  if (extraOptions.Kraan_gat.chosen) {
    offerteData += `
      <h6>Kraangat:</h6>
      <li>Aantal: ${extraOptions.Kraan_gat.aantal}</li>
       `;
  }
  if (extraOptions.Inmeten.chosen) {
    const inmetenOptionInfo = getSelectedOptionInfo("Inmeten");
    const { selectedOptionName: transportName, selectedOption: inmetenOption } =
      inmetenOptionInfo;
    offerteData += `
      <h6>Inmeten:</h6>
      <li>Optie: ${transportName}</li>
    `;
  }
  if (extraOptions.Transport.chosen) {
    const transportOptionsInfo = getSelectedOptionInfo("Transport");
    const {
      selectedOptionName: transportName,
      selectedOption: transportOption,
    } = transportOptionsInfo;
    offerteData += `
      <h6>Transport:</h6>
      <li> Optie: ${transportName}</li>
    `;
  }
  if (extraOptions.Transport.ZelfAfhalenDelft.chosen) {
    offerteData += `
      <h6>Afhaaloptie:</h6>
      <li>Zelf afhalen Delft</li>
    `;
  }
  if (extraOptions.Transport.ZelfAfhalenBreda.chosen) {
    offerteData += `
      <h6>Afhaaloptie:</h6>
      <li>Zelf afhalen Breda</li>
    `;
  }
  if (extraOptions.Montage.chosen) {
    const montageOptionsInfo = getSelectedOptionInfo("Montage");
    const { selectedOptionName: montageName, selectedOption: montageOption } =
      montageOptionsInfo;
    const montageOptionName =
      montageName === "basicOption" ? "basisoptie" : "uitgebreid optie";
    offerteData += `
      <h6>Montage:</h6>
      <li>Optie: ${montageOptionName}</li>
    `;
  }

  return offerteData;
}

export const formatDate = (dateString) => {
  const months = [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december",
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};
export async function postIssue({
  userName,
  description,
  location,
  email,
  latitude,
  longitude,
  file,
}) {
  const data = { userName, description, location, email, latitude, longitude };

  const formData = new FormData();
  // "in" return the keys
  for (let field in data) {
    formData.append(field, data[field]);
    //same as
    //formData.append("name", data.name)
    //formData.append("description", data.description)
  }

  //"of" returns values
  for (let eachFile of file) {
    formData.append("file", eachFile);
  }

  try {
    const response = await axios.postForm("/api/issues", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return [null, response];
  } catch (error) {
    console.log(error);
    return [error.response.statusText, null];
  }
}
export function calculateAfwerkingen(
  length,
  width,
  selectedAfwerking,
  selectedOption
) {
  //console.log("utils, selectedOption?", selectedOption);

  let afwerkingSides = [];
  if (selectedAfwerking.length) {
    if (selectedAfwerking.includes("voor")) {
      afwerkingSides.push(parseInt(length));
    }
    if (selectedAfwerking.includes("achter")) {
      afwerkingSides.push(parseInt(length));
    }
    if (selectedAfwerking.includes("links")) {
      afwerkingSides.push(parseInt(width));
    }
    if (selectedAfwerking.includes("rechts")) {
      afwerkingSides.push(parseInt(width));
    }
    const totalAfwerkingStreek = afwerkingSides.reduce((a, b) => a + b, 0);

    let pricePerMeterAfwerking = selectedOption.name.includes("massief")
      ? 35
      : 55;

    // const totalAfwerkingPrice = Math.ceil(
    //   (Math.ceil(totalAfwerkingStreek) / 100) * pricePerMeterAfwerking
    // );
    const totalAfwerkingPrice =
      (Math.ceil(totalAfwerkingStreek / 100) * 100 * pricePerMeterAfwerking) /
      100;

    return totalAfwerkingPrice;
  }
}

export const getEmailContent = ({
  clientData,
  keukenBladen,
  extraOptions,
  purchaseTotalPrice,
}) => {
  const clientInfo = `
      Dhr./Mevr.
      ${clientData.Voornaam} ${clientData.Achternaam}
      ${clientData["E-mailadres"]}
      ${clientData["Straatnaam + huisnummer"]}
      ${clientData.Postcode}
      ${clientData.Woonplaats}
      Tel. ${clientData.Telefoonnummer}
    `;

  const productsInfo = keukenBladen
    .map(
      (keukenBlad, index) => `
      Keukenblad ${keukenBladen.length > 1 ? index + 1 : ""}
      Naam: ${keukenBlad.name}
      Bladlengte: ${keukenBlad.length}
      Bladbreedte: ${keukenBlad.width}
      Dikte: ${keukenBlad.name}
      Prijs: € ${keukenBlad.price}
      ${
        keukenBlad.sidesAfwerkingen.length
          ? `
        Afwerkingzijde(en): ${keukenBlad.sidesAfwerkingen.join(", ")}
        Prijs afwerking: € ${keukenBlad.priceAfwerking}
      `
          : "Geen afwerking gekozen"
      }
    `
    )
    .join("\n");

  return `${clientInfo}\n\n${productsInfo}`;
};

export async function postImages({ klantNaam, klantAchterNaam, file }) {
  const data = { klantNaam, klantAchterNaam };
  const formData = new FormData();
  // for (let i = 0; i < previewSources.length; i++) {
  //   formData.append(`file${i}`, previewSources[i]);
  // }
  for (let field in data) {
    formData.append(field, data[field]);
    //same as
    //formData.append("name", data.name)
    //formData.append("description", data.description)
  }
  //"of" returns values
  for (let eachFile of file) {
    formData.append("file", eachFile);
  }
  try {
    const imageResponse = await axios.postForm("/api/photos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { images } = imageResponse.data;

    return [null, images];
  } catch (error) {
    console.log(error);
    return [error.response, null];
  }
}

export function calculateOffertesAverage(numbers) {
  if (numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce((total, num) => total + num, 0);
  return Math.ceil(sum / numbers.length);
}
export function removeKeukenbladSuffix(str) {
  const regex = /\s*keukenblad\s*$/i;

  return str.replace(regex, "");
}
export function calculateStollewandPrice(
  width,
  height,
  numberOfPieces,
  option,
  pricePerSquareMeter
) {
  let stonePrice;
  // console.log("utils, option:", option);
  if (option === "eiland opgedikt geheel") {
    stonePrice =
      2 * (Number(width) / 100) * (Number(height) / 100) * pricePerSquareMeter;
    const priceAfwerking = 2 * (Number(height) / 100) * 55;
    const subtotal = Math.ceil(stonePrice + priceAfwerking);
    const totalPrice = subtotal * numberOfPieces;
    return { subtotal, totalPrice };
  }
  if (option === "eiland opgedikt kort") {
    stonePrice =
      (Number(width) / 100) * (Number(height) / 100) * pricePerSquareMeter +
      2 * (0.15 * (Number(height) / 100) * pricePerSquareMeter);
    const priceAfwerking = 2 * (Number(height) / 100) * 55;
    const subtotal = Math.ceil(stonePrice + priceAfwerking);
    const totalPrice = subtotal * numberOfPieces;
    return { subtotal, totalPrice };
  }
  if (option === "eiland opgedikt lang") {
    stonePrice =
      (Number(width) / 100) * (Number(height) / 100) * pricePerSquareMeter +
      0.15 * (Number(height) / 100) * pricePerSquareMeter +
      0.4 * (Number(height) / 100) * pricePerSquareMeter;
    const priceAfwerking = 2 * (Number(height) / 100) * 55;
    const subtotal = Math.ceil(stonePrice + priceAfwerking);
    const totalPrice = subtotal * numberOfPieces;
    return { subtotal, totalPrice };
  }
  if (option === "eiland massief geheel") {
    stonePrice =
      (Number(width) / 100) * (Number(height) / 100) * pricePerSquareMeter;
    const priceAfwerking =
      2 * (Number(height) / 100) * 35 +
      (Number(width) / 100) * (Number(height) / 100) * 95;
    const subtotal = Math.ceil(stonePrice + priceAfwerking);
    const totalPrice = subtotal * numberOfPieces;
    return { subtotal, totalPrice };
  }
  if (option === "eiland massief kort") {
    stonePrice =
      (Number(width) / 100) * (Number(height) / 100) * pricePerSquareMeter;
    const priceAfwerking =
      2 * (Number(height) / 100) * 35 +
      2 * (0.15 * (Number(height) / 100) * 95);
    const subtotal = Math.ceil(stonePrice + priceAfwerking);
    const totalPrice = subtotal * numberOfPieces;
    return { subtotal, totalPrice };
  }
  if (option === "eiland massief lang") {
    stonePrice =
      (Number(width) / 100) * (Number(height) / 100) * pricePerSquareMeter;
    const priceAfwerking =
      2 * (Number(height) / 100) * 35 +
      0.15 * (Number(height) / 100) * 95 +
      0.4 * (Number(height) / 100) * 95;
    const subtotal = Math.ceil(stonePrice + priceAfwerking);
    const totalPrice = subtotal * numberOfPieces;
    return { subtotal, totalPrice };
  }
  if (option === "normal opgedikt geheel") {
    stonePrice =
      2 * (Number(width) / 100) * (Number(height) / 100) * pricePerSquareMeter;
    const priceAfwerking = (Number(height) / 100) * 55;
    const subtotal = Math.ceil(stonePrice + priceAfwerking);
    const totalPrice = subtotal * numberOfPieces;
    return { subtotal, totalPrice };
  }
  if (option === "normal opgedikt kort") {
    stonePrice =
      (Number(width) / 100) * (Number(height) / 100) * pricePerSquareMeter +
      0.15 * (Number(height) / 100) * pricePerSquareMeter;
    const priceAfwerking = (Number(height) / 100) * 55;
    const subtotal = Math.ceil(stonePrice + priceAfwerking);
    const totalPrice = subtotal * numberOfPieces;
    return { subtotal, totalPrice };
  }
  if (option === "normal opgedikt lang") {
    stonePrice =
      (Number(width) / 100) * (Number(height) / 100) * pricePerSquareMeter +
      0.4 * (Number(height) / 100) * pricePerSquareMeter;
    const priceAfwerking = (Number(height) / 100) * 55;
    const subtotal = Math.ceil(stonePrice + priceAfwerking);
    const totalPrice = subtotal * numberOfPieces;
    return { subtotal, totalPrice };
  }
  if (option === "normal massief geheel") {
    stonePrice =
      (Number(width) / 100) * (Number(height) / 100) * pricePerSquareMeter;
    const priceAfwerking =
      (Number(height) / 100) * 35 +
      (Number(width) / 100) * (Number(height) / 100) * 95;
    const subtotal = Math.ceil(stonePrice + priceAfwerking);
    const totalPrice = subtotal * numberOfPieces;
    return { subtotal, totalPrice };
  }
  if (option === "normal massief kort") {
    stonePrice =
      (Number(width) / 100) * (Number(height) / 100) * pricePerSquareMeter;
    const priceAfwerking =
      (Number(height) / 100) * 35 + 0.15 * (Number(height) / 100) * 95;
    const subtotal = Math.ceil(stonePrice + priceAfwerking);
    const totalPrice = subtotal * numberOfPieces;
    return { subtotal, totalPrice };
  }
  if (option === "normal massief lang") {
    stonePrice =
      (Number(width) / 100) * (Number(height) / 100) * pricePerSquareMeter;
    const priceAfwerking =
      (Number(height) / 100) * 35 + 0.4 * (Number(height) / 100) * 95;
    const subtotal = Math.ceil(stonePrice + priceAfwerking);
    const totalPrice = subtotal * numberOfPieces;
    return { subtotal, totalPrice };
  }
}

export function priceStollenwanden(keukenbladIndex, stollenwandArray) {
  const filteredArrayStollenwanden = stollenwandArray.filter(
    (stollenwand) => stollenwand.keukenbladId === keukenbladIndex
  );
  const arrayOfFileredPrices = filteredArrayStollenwanden.map(
    (oneStollewand) => oneStollewand.totalPrice
  );

  const sumOfPrices = arrayOfFileredPrices.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return sumOfPrices;
}

// Clients info in new product (for now don't add)
// <h3>Dhr./Mevr.: ${clientData.Voornaam} ${clientData.Achternaam}</h3>
// <p>E-mail: ${clientData["E-mailadres"]}</p>
// <p>Adres: ${clientData["Straatnaam + huisnummer"]}, ${clientData.Postcode}, ${clientData.Woonplaats}</p>
// <p>Tel.: ${clientData.Telefoonnummer}</p>
