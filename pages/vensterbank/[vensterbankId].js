import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./[vensterbankId].module.css";
import Header from "@/components/header/Header";
import InputFields from "@/components/inputfields/InputFields";
import LoaderSpinner from "@/components/loaderSpinner/LoaderSpinner";
import ClientInfosForm from "@/components/clientInfosForm/ClientInfosForm";
import OverzichtVensterbank from "@/components/overzichtVensterbank/OverzichtVensterbank";

export default function VensterbankPage() {
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [productData, setProductData] = useState(null);
  const [arrayOfProducts, setArrayOfProducts] = useState([]);
  //console.log("productData", productData);
  const [windowsillData, setWindowsillData] = useState({
    name: "",
    variation: "",
    width: 0,
    length: 0,
    variation: null,
    aantal: 1,
    uitsparing: 0,
  });
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
  const [opmerking, setOpmerking] = useState("");
  const variationsOfProduct = [
    { name: "2 cm massief", price: 100 },
    { name: "3 cm massief", price: 150 },
    { name: "4 cm massief", price: 200 },
    { name: "5 cm massief", price: 250 },
  ];
  const dropdownOptions = variationsOfProduct.map(
    (variation) => variation.name
  );

  const router = useRouter();
  const { vensterbankId } = router.query;

  const fetchProductData = async () => {
    try {
      setLoading(true);

      if (vensterbankId) {
        const { data: productList } = await axios.get(
          "https://stonecenter-shop.nl/wp-json/wc/v3/products",
          {
            params: {
              slug: vensterbankId,
              consumer_key: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
              consumer_secret: process.env.NEXT_PUBLIC_REACT_APP_API_SECRET,
            },
          }
        );

        const productItem = productList[0];

        setProductData(productList);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching product data:", error);
    }
  };
  const calculateProductPrice = (width, length, variation, uitsparing) => {
    const pricePerSquareMeter = () => {
      const chosenVariation = variationsOfProduct.find(
        (oneVariation) => oneVariation.name === variation
      );

      return chosenVariation?.price;
    };
    const price = pricePerSquareMeter();
    const minArea = 0.36;
    const productArea = (width / 100) * (length / 100);
    const selectedArea = productArea >= minArea ? productArea : minArea;
    const pricePerUitsparing = 80;
    const priceUitsparingen = pricePerUitsparing * uitsparing;
    const pricePerUnit = selectedArea * price + priceUitsparingen;
    return { pricePerUnit, priceUitsparingen };
  };

  let totalBankenPrice;
  if (arrayOfProducts.length) {
    const arrayOfPrices = arrayOfProducts.map((product) => product.totalPrice);
    totalBankenPrice = arrayOfPrices.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
  }

  useEffect(() => {
    if (vensterbankId) {
      fetchProductData();
    }
  }, [vensterbankId]);
  const productName = productData && productData[0].name;

  return (
    <div className={styles.externalContainer}>
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
          {formStep !== 3 && formStep !== 2 && <Header />}
          {formStep !== 2 && formStep !== 3 && (
            <h2 className={styles.prodNameBanner}>{productName}</h2>
          )}
          {formStep !== 2 && formStep !== 3 && (
            <div className={styles.KBTopImage}>
              <img
                src={productData && productData[0]?.images[0].src}
                alt="Vensterbank afbeelding"
                className={styles.prodImageContainer}
              />
            </div>
          )}
          {formStep === 1 && (
            <InputFields
              formStep={formStep}
              setFormStep={setFormStep}
              productName={productName}
              productPrefix={"Bank"}
              getter={windowsillData}
              setter={setWindowsillData}
              productFormula={calculateProductPrice}
              arrayOfProducts={arrayOfProducts}
              setArrayOfProducts={setArrayOfProducts}
              dropdownOptions={dropdownOptions}
              opmerking={opmerking}
              setOpmerking={setOpmerking}
            />
          )}
          {formStep === 2 ? (
            <ClientInfosForm
              productMode="vensterbank"
              formStep={formStep}
              setFormStep={setFormStep}
              arrayOfProducts={arrayOfProducts}
              extraOptions={extraOptions}
              clientData={clientData}
              setClientData={setClientData}
              totalBankenPrice={totalBankenPrice}
              keukenBladen={keukenBladen}
              productData={productData}
              opmerking={opmerking}
              setOpmerking={setOpmerking}
            />
          ) : (
            ""
          )}
          {formStep === 3 && (
            <OverzichtVensterbank
              arrayOfProducts={arrayOfProducts}
              clientData={clientData}
              productData={productData}
              totalBankenPrice={totalBankenPrice}
            />
          )}
        </div>
      ) : (
        <LoaderSpinner />
      )}
    </div>
  );
}
