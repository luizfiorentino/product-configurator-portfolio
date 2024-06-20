// Obs: to add the shortcode in the product template
// https://stonecenter-shop.nl/wp-admin/post.php?post=5297&action=elementor
// [product_link_douchebak]
// http://localhost:3000/douchebak/hardsteen-douchebak-op-maat

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./[product].module.css";
import ClientInfosForm from "@/components/clientInfosForm/ClientInfosForm";
import Header from "@/components/header/Header";
import LoaderSpinner from "@/components/loaderSpinner/LoaderSpinner";
import DouchebakStep1 from "@/components/douchebakStep1/douchebakStep1";
import DouchebakStep3 from "@/components/douchebakStep3/DouchebakStep3";
import { fetchUserData } from "@/utils";

const DouchebakPage = () => {
  const [formStep, setFormStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStep3, setLoadingStep3] = useState(false);
  const [productData, setProductData] = useState(null);
  const [productDataRaw, setProductDataRaw] = useState(null);
  const [extraOptions, setExtraOptions] = useState({
    Spatwand_rand: [],
    Uitsparing_spoelbak: {
      chosen: false,
      onderbouwKlein: { chosen: false, price: 220 },
      onderbouwGroot: { chosen: false, price: 315 },
      opbouw: { chosen: false, price: 132 },
      vlakbouw: { chosen: false, price: 170 },
    },
    Uitsparing_kookplaat: {
      chosen: false,
      opbouw: { chosen: false, price: 132 },
      vlakbouw: { chosen: false, price: 294 },
    },
    Kraan_gat: { chosen: false, pricePerNumber: 45, aantal: 1 },
    Opmerking: "",
    Bijlage: [],
    Werkzaamheden: { chosen: false, price: "invullen" },
    Inmeten: {
      chosen: false,
      max50km: { chosen: false, price: 135 },
      "51-100km": { chosen: false, price: 183 },
      "101-200km": { chosen: false, price: 267 },
      "201-250km": { chosen: false, price: 331 },
    },
    Montage: {
      chosen: false,
      basicOption: { chosen: false, price: 325 },
      incrementedOption: { chosen: false, price: 650 },
    },
    Transport: {
      chosen: false,
      max50km: { chosen: false, price: 162 },
      "51-100km": { chosen: false, price: 210 },
      "101-200km": { chosen: false, price: 294 },
      "201-250km": { chosen: false, price: 358 },
      ZelfAfhalenDelft: { chosen: false, price: 0 },
      ZelfAfhalenBreda: { chosen: false, price: 0 },
    },
  });
  const [clientData, setClientData] = useState({
    Voornaam: "",
    Achternaam: "",
    "Straatnaam + huisnummer": "",
    Postcode: "",
    Woonplaats: "",
    "E-mailadres": "",
    Telefoonnummer: "",
    algemeneVoorwaarden: false,
  });
  const [keukenBladen, setKeukenBladen] = useState([]);
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [thicknessOption, setThicknessOption] = useState("");
  const [vlakkeOppervlakteChecked, setVlakkeOppervlakteChecked] =
    useState(false);
  const [ingefreesdeOppervlakteChecked, setIngefreesdeOppervlakteChecked] =
    useState(false);
  const [donkerGezoetChecked, setDonkerGezoetChecked] = useState(false);
  const [lichtGezoetChecked, setLichtGezoetChecked] = useState(false);
  const [prijzen, setPrijzen] = useState({
    doucheBak: [
      { "4 cm": 258 },
      { "5 cm": 265 },
      { "6 cm": 328 },
      { "8 cm": 375 },
      { "10 cm": 442 },
    ],

    afwerking: [{ donkerGezoet: 95 }, { lichtGezoet: 80 }],
    toepassing: [{ vlakkeOpper: 95 }, { ingefreesdOpper: 750 }],
  });
  const [chosenOptions, setChosenOptions] = useState({
    afwerking: "",
    toepassing: "",
  });
  const [totalPrice, setTotalPrice] = useState(null);
  const [elementInfoArea, setElementInfoArea] = useState(false);
  const [doucheBak, setDouchebak] = useState({});
  const [element, setElement] = useState({});
  const [elementInputs, setElementInputs] = useState(false);
  const [numberOfPieces, setNumberOfPieces] = useState(1);
  const [opmerking, setOpmerking] = useState("");
  const thicknessOptions = [4, 5, 6, 8, 10];
  const [inputError, setInputError] = useState(false);
  const [minProductArea, setMinProductArea] = useState(false);
  const [stepBouchebak, setStepDouchebak] = useState(1);
  const [productMode, setProductMode] = useState("Douchebak");
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { product, user_id } = router.query;

  const fetchProductData = async () => {
    try {
      setLoading(true);
      if (product) {
        const response = await axios.get(
          "https://stonecenter-shop.nl/wp-json/wc/v3/products",
          {
            params: {
              slug: product,
              consumer_key: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
              consumer_secret: process.env.NEXT_PUBLIC_REACT_APP_API_SECRET,
            },
          }
        );

        //const productItem = productList[0];
        setProductData(response.data[0]);
        setProductDataRaw(response.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching product data:", error);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, [product]);

  useEffect(() => {
    if (user_id) {
      fetchUserData(user_id, setLoading, setUser);
    }
  }, [user_id]);

  useEffect(() => {
    if (user) {
      setClientData((prevClientData) => ({
        ...prevClientData,
        Voornaam: user.first_name || "",
        Achternaam: user.last_name || "",
        "Straatnaam + huisnummer": user.billing.address_1 || "",
        Postcode: user.billing.postcode || "",
        Woonplaats: user.billing.city || "",
        "E-mailadres": user.billing.email || "",
        Telefoonnummer: user.billing.phone || "",
      }));
    }
  }, [user]);

  const getThicknessPrice = () => {
    const selectedThickness = `${thicknessOption}`;

    const doucheBakPrices = prijzen.doucheBak;
    const matchingPrice = doucheBakPrices.find(
      (price) => price[selectedThickness]
    );

    return matchingPrice ? matchingPrice[selectedThickness] : null;
  };

  const priceForSelectedThickness = getThicknessPrice();

  const getAfwerkingPrice = () => {
    if (donkerGezoetChecked) {
      const donkerGezoetPrice = prijzen.afwerking.find(
        (price) => price.donkerGezoet
      );
      return donkerGezoetPrice ? donkerGezoetPrice.donkerGezoet : null;
    } else if (lichtGezoetChecked) {
      const lichtGezoetPrice = prijzen.afwerking.find(
        (price) => price.lichtGezoet
      );
      return lichtGezoetPrice ? lichtGezoetPrice.lichtGezoet : null;
    } else {
      return "geen afwerking gekozen";
    }
  };
  const priceForSelectedAfwerking = getAfwerkingPrice();

  const getToepassingPrice = () => {
    if (vlakkeOppervlakteChecked) {
      const foundVlakkeOpper = prijzen.toepassing.find(
        (item) => item.vlakkeOpper
      );

      if (foundVlakkeOpper) {
        return foundVlakkeOpper.vlakkeOpper;
      }
    } else if (ingefreesdeOppervlakteChecked) {
      const foundIngefreesdOpper = prijzen.toepassing.find(
        (item) => item.ingefreesdOpper
      );

      if (foundIngefreesdOpper) {
        return foundIngefreesdOpper.ingefreesdOpper;
      }
    }
    return "geen toepassing gekozen";
  };
  const priceForSelectedToepassing = getToepassingPrice();

  const minArea = (70 * 70) / 10000;
  const productArea = Math.max((length * width) / 10000, minArea);
  //console.log("productArea:", productArea);
  if (productArea === 0.49) {
    //console.log("minArea selected");
  }

  const addDouchebak = (option) => {
    const totalPrice =
      priceForSelectedThickness * productArea +
      priceForSelectedAfwerking * productArea +
      priceForSelectedToepassing * productArea;
    //setTotalPrice(totalPrice);

    const doucheBakPrice = priceForSelectedThickness * productArea;
    if (option === "doucheBakOption") {
      const newDoucheBak = {
        length,
        width,
        thickness: thicknessOption,
        doucheBakPrice,
        afwerkingType: donkerGezoetChecked ? "Donker gezoet" : "Licht gezoet",
        priceAfwerking: priceForSelectedAfwerking * productArea,
        toepassingType: vlakkeOppervlakteChecked
          ? "Vlakke oppervlakte"
          : "Ingefreesde oppervlakte",
        priceToepassing: priceForSelectedToepassing * productArea,
        amountOfPieces: numberOfPieces,
        totalPrice: Math.ceil(totalPrice),
        total: Math.ceil(totalPrice * numberOfPieces),
      };

      // Set the doucheBak state
      if (productArea === 0.49) {
        //console.log("setter called");
        setMinProductArea(true);
      }
      setDouchebak(newDoucheBak);
      setLength("");
      setWidth("");
      setNumberOfPieces(1);
      setStepDouchebak(1);
      setProductMode(productMode === "Douchebak" ? "Element" : "Douchebak");
      //setThicknessOption("");
    }
    if (option === "elementOption") {
      const newElement = {
        length,
        width,
        thickness: thicknessOption,
        doucheBakPrice,
        afwerkingType: donkerGezoetChecked ? "Donker gezoet" : "Licht gezoet",
        priceAfwerking: priceForSelectedAfwerking * productArea,
        toepassingType: vlakkeOppervlakteChecked
          ? "Vlakke oppervlakte"
          : "Ingefreesde oppervlakte",
        priceToepassing: priceForSelectedToepassing * productArea,
        amountOfPieces: numberOfPieces,
        totalPrice: Math.ceil(totalPrice),
        total: Math.ceil(totalPrice * numberOfPieces),
      };

      // Set the doucheBak state
      setElementInputs(false);
      setElement(newElement);
      setLength("");
      setWidth("");
      setNumberOfPieces(1);
      setElementInputs(false);
      setStepDouchebak(1);
    }

    return totalPrice;
  };

  const nextStep = () => {
    if (element.length) {
      setLength("");
      setWidth("");
      setElementInputs(true);
    }
    setFormStep(2);
  };

  const removeProduct = (option) => {
    if (option === "douchebak") {
      setDouchebak({});
      setProductMode("Douchebak");
    }
    if (option === "element") {
      setElement({});
      setProductMode("Element");
    }
  };

  return (
    <div>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-WW7XWBXW"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      {!loading ? (
        <div className={loading ? styles.loadingApp : styles.externalContainer}>
          {!loadingStep3 ? <Header /> : ""}
          {formStep === 1 && (
            <DouchebakStep1
              formStep={formStep}
              productData={productData}
              width={width}
              setWidth={setWidth}
              length={length}
              setLength={setLength}
              thicknessOption={thicknessOption}
              setThicknessOption={setThicknessOption}
              numberOfPieces={numberOfPieces}
              setNumberOfPieces={setNumberOfPieces}
              lichtGezoetChecked={lichtGezoetChecked}
              setLichtGezoetChecked={setLichtGezoetChecked}
              donkerGezoetChecked={donkerGezoetChecked}
              setDonkerGezoetChecked={setDonkerGezoetChecked}
              vlakkeOppervlakteChecked={vlakkeOppervlakteChecked}
              setVlakkeOppervlakteChecked={setVlakkeOppervlakteChecked}
              ingefreesdeOppervlakteChecked={ingefreesdeOppervlakteChecked}
              setIngefreesdeOppervlakteChecked={
                setIngefreesdeOppervlakteChecked
              }
              thicknessOptions={thicknessOptions}
              doucheBak={doucheBak}
              inputError={inputError}
              setInputError={setInputError}
              addDouchebak={addDouchebak}
              element={element}
              removeProduct={removeProduct}
              elementInfoArea={elementInfoArea}
              setElementInfoArea={setElementInfoArea}
              elementInputs={elementInputs}
              setElementInputs={setElementInputs}
              opmerking={opmerking}
              setOpmerking={setOpmerking}
              nextStep={nextStep}
              stepBouchebak={stepBouchebak}
              setStepDouchebak={setStepDouchebak}
              productMode={productMode}
              setProductMode={setProductMode}
            />
          )}
          {formStep === 2 && (
            <div className={styles.clientInfosContainer}>
              <ClientInfosForm
                user={user}
                clientData={clientData}
                setClientData={setClientData}
                productMode="douchebak"
                formStep={formStep}
                setFormStep={setFormStep}
                keukenBladen={keukenBladen}
                extraOptions={extraOptions}
                productData={productDataRaw}
                doucheBak={doucheBak}
                element={element}
                opmerking={opmerking}
              />
            </div>
          )}
          {formStep === 3 && (
            <DouchebakStep3
              loadingStep3={loadingStep3}
              setLoadingStep3={setLoadingStep3}
              clientData={clientData}
              productData={productData}
              doucheBak={doucheBak}
              element={element}
              opmerking={opmerking}
            />
          )}
        </div>
      ) : (
        <LoaderSpinner />
      )}
    </div>
  );
};

export default DouchebakPage;

// if (productItem.variations && productItem.variations?.length > 0) {
//   const variationDataPromises = productItem.variations.map(
//     async (variationId) => {
//       try {
//         const variationResponse = await axios.get(
//           `https://stonecenter-shop.nl/wp-json/wc/v3/products/${productItem.id}/variations/${variationId}`,
//           {
//             params: {
//               consumer_key: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
//               consumer_secret:
//                 process.env.NEXT_PUBLIC_REACT_APP_API_SECRET,
//             },
//           }
//         );
//         return variationResponse.data;
//       } catch (error) {
//         console.error("Error fetching variation data:", error);
//         return null;
//       }
//     }
//   );

//   const variationsData = await Promise.all(variationDataPromises);
//   setProductVariations(variationsData);
// }
// setChosenOptions((prevOptions) => ({
//   ...prevOptions,
//   thickness: thicknessOption,
//   afwerking: donkerGezoetChecked ? "Donker gezoet" : "Licht gezoet",
//   toepassing: vlakkeOppervlakteChecked
//     ? "Vlakke oppervlakte"
//     : "Ingefreesde oppervlakte",
// }));
// clg
