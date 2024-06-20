import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import KeukenbladForm from "@/components/keukenbladForm/KeukenbladForm";
import AdditionalForm from "@/components/extraOptionsForm/ExtraOptionsForm";
import ClientInfosForm from "@/components/clientInfosForm/ClientInfosForm";
import OverzichtForm from "@/components/overzichtForm/OverzichtForm";
import axios from "axios";
import { calculateAfwerkingen, generateOfferteData } from "@/utils";
import styles from "../styles/Home.module.css";

const ProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [thickness, setThickness] = useState("");
  const [singleKeukenBlad, setSingleKeukenblad] = useState({
    name: "",
    width: null,
    length: null,
    price: null,
  });
  const [keukenBladen, setKeukenBladen] = useState([]);
  const [afwerking, setAfwerking] = useState(null);
  const [selectedAfwerking, setSelectedAfwerking] = useState(["voor"]);
  const [productData, setProductData] = useState(null);
  const [productVariations, setProductVariations] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedOption1, setSelectedOption1] = useState(null);
  const [displayButton, setDisplayButton] = useState(true);
  // const [clientData, setClientData] = useState({
  //   Voornaam: "",
  //   Achternaam: "",
  //   "Straatnaam + huisnummer": "",
  //   Postcode: "",
  //   Woonplaats: "",
  //   "E-mailadres": "",
  //   Telefoonnummer: "",
  //   algemeneVoorwaarden: false,
  // });
  // Assuming userData contains the user information fetched from the server

  const [clientData, setClientData] = useState({
    Voornaam: user?.first_name || "",
    Achternaam: user?.last_name || "",
    "Straatnaam + huisnummer": user?.billing.address_1 || "",
    Postcode: user?.billing.postcode || "",
    Woonplaats: user?.billing.city || "",
    "E-mailadres": user?.billing.email || "",
    Telefoonnummer: user?.billing.phone || "",
    algemeneVoorwaarden: false, // You may want to set this to true if it's agreed by default
  });

  const [checkedClientData, setCheckedClientData] = useState({
    Voornaam: "",
    Achternaam: "",
    "Straatnaam + huisnummer": "",
    Postcode: "",
    Woonplaats: "",
    "E-mailadres": "",
    Telefoonnummer: "",
    algemeneVoorwaarden: false,
  });
  const [extraOptions, setExtraOptions] = useState({
    Spatwand_rand: [],
    // soort spoelbak uitsparingen
    //(a) onderbouw (kleiner dan 50x40 = 220, groter 315),
    //(b) opbouw 132 (c) vlakbouw €170
    Uitsparing_spoelbak: {
      aantal: 1,
      chosen: false,
      onderbouwKlein: { chosen: false, price: 220 },
      onderbouwGroot: { chosen: false, price: 315 },
      opbouw: { chosen: false, price: 132 },
      vlakbouw: { chosen: false, price: 170 },
    },
    //uitsparing kookplaat (a)opbouw 132 (b) vlakbouw € 294
    Uitsparing_kookplaat: {
      chosen: false,
      opbouw: { chosen: false, price: 132 },
      vlakbouw: { chosen: false, price: 294 },
      aantal: 1,
    },
    //45 per gat
    Kraan_gat: { chosen: false, pricePerNumber: 45, aantal: 1 },
    Opmerking: "",
    Bijlage: [],
    Werkzaamheden: { chosen: false, price: "invullen" },
    //inmeten -> 4 alternatieven, afstand 0-50, 51-100 ezv. (alleen keukenbladen en spatwand)
    Inmeten: {
      chosen: false,
      max50km: { chosen: false, price: 135 },
      "51-100km": { chosen: false, price: 183 },
      "101-200km": { chosen: false, price: 267 },
      "201-250km": { chosen: false, price: 331 },
    },
    // als motage kiest dan transport afgevinkt (optellen)
    //meerkeuzevraag (a) eiland? (b) langer dan 2.50m (c) meer dan 5 onderdelen?
    //basisprijs 325 + en van kiezen 650 (ipv 325)
    Montage: {
      chosen: false,
      basicOption: { chosen: false, price: 325 },
      incrementedOption: { chosen: false, price: 650 },
    },
    //inmeten - (transport alternatieven -27)
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
  const [linkProduct, setLinkProduct] = useState("https://stonecenter-shop.nl");
  //const { siteProduct } = useParams();
  //const linkToProduct = `https://stonecenter-shop.nl/${siteProduct}`;

  const [stollewandOption, setStollewandOption] = useState("normal");
  const [stollenwandArray, setStollenwandArray] = useState([]);
  const router = useRouter();
  const { product, user_id } = router.query;

  const productSku = productData ? productData[0].sku : "not found";
  const testString = generateOfferteData(
    clientData,
    keukenBladen,
    stollenwandArray,
    extraOptions
  );

  const fetchProductData = async () => {
    try {
      setLoading(true);
      if (product) {
        const { data: productList } = await axios.get(
          "https://stonecenter-shop.nl/wp-json/wc/v3/products",
          {
            params: {
              slug: product,
              consumer_key: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
              consumer_secret: process.env.NEXT_PUBLIC_REACT_APP_API_SECRET,
            },
          }
        );

        const productItem = productList[0];
        setProductData(productList);

        if (productItem.variations && productItem.variations?.length > 0) {
          const variationDataPromises = productItem.variations.map(
            async (variationId) => {
              try {
                const variationResponse = await axios.get(
                  `https://stonecenter-shop.nl/wp-json/wc/v3/products/${productItem.id}/variations/${variationId}`,
                  {
                    params: {
                      consumer_key: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
                      consumer_secret:
                        process.env.NEXT_PUBLIC_REACT_APP_API_SECRET,
                    },
                  }
                );
                return variationResponse.data;
              } catch (error) {
                console.error("Error fetching variation data:", error);
                return null;
              }
            }
          );

          const variationsData = await Promise.all(variationDataPromises);
          setProductVariations(variationsData);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching product data:", error);
    }
  };

  const fetchUserData = async (userId) => {
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

  useEffect(() => {}, [productVariations]);

  const variationOption = productVariations?.map((variation) => {
    return {
      name: variation.name,
      price: variation.price,
      id: variation.id,
      parentId: variation.parent_id,
    };
  });

  const fetchVariationData = async (variationId) => {
    try {
      const response = await axios.get(
        `https://stonecenter-shop.nl/wp-json/wc/v3/products/${productData?.data[0].id}/variations/${variationId}`,
        {
          params: {
            consumer_key: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
            consumer_secret: process.env.NEXT_PUBLIC_REACT_APP_API_SECRET,
          },
        }
      );
    } catch (error) {
      console.error("Error fetching variation data:", error);
    }
  };

  const handleVariations = () => {
    if (productData?.variations) {
      productData.data[0].variations.forEach((variationId) => {
        fetchVariationData(variationId);
      });
    }
  };

  useEffect(() => {
    handleVariations();
  }, []);

  const priceCalculation = (x, y) => {
    // Vroeger: min. lengte/ breedte 60cm
    // const adjustedX = Math.max(60, x);
    // const adjustedY = Math.max(60, y);
    // const pricePerMeter = parseInt(selectedOption.price);
    // const productArea = (adjustedX / 100) * (adjustedY / 100);
    // const quotationPrice = Math.ceil(productArea * pricePerMeter);

    // Nu: min. oppervlakte 3600cm2 = 0.36m2
    const minArea = 0.36;
    const productArea = (x / 100) * (y / 100);
    const finalProductArea = Math.max(productArea, minArea);
    const pricePerMeter = parseInt(selectedOption.price);
    const quotationPrice = Math.ceil(finalProductArea * pricePerMeter);

    const sidesAfwerkingen = selectedAfwerking.map((oneSide) => oneSide);
    const priceAfwerkingen = calculateAfwerkingen(
      x,
      y,
      selectedAfwerking,
      selectedOption
    );
    setKeukenBladen((prevKeukenBladen) => [...prevKeukenBladen, newBlad]);

    const newBlad = {
      name: selectedOption.name,
      length: Number(length),
      width: Number(width),
      price: quotationPrice,
      m2Price: Number(selectedOption.price),
      sidesAfwerkingen,
      priceAfwerking: priceAfwerkingen ? priceAfwerkingen : null,
      variationId: selectedOption.id,
      productId: selectedOption.parentId,
    };
    return quotationPrice;
  };

  const submitButton = () => {
    setFormStep(formStep + 1);
  };

  useEffect(() => {
    if (user_id) {
      fetchUserData(user_id);
    }
  }, [user_id]);

  useEffect(() => {
    fetchProductData();
  }, [product]);
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

  useEffect(() => {
    // Send event to Google Analytics
    window.gtag("event", "page_load", {
      event_category: "Page Load",
      event_label: `SKU: ${productSku}`,
    });
  }, [productData]);
  return (
    <div className={loading ? styles.loadingApp : styles.stylesApp}>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-PMSPDW7"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      {!loading ? (
        <div className={styles.wrapperContainer}>
          <div className={styles.imageAndDataContainer}>
            {formStep === 1 && (
              <div className={styles.form1Container}>
                <KeukenbladForm
                  length={length}
                  setLength={setLength}
                  width={width}
                  setWidth={setWidth}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  selectedOption1={selectedOption1}
                  setSelectedOption1={setSelectedOption1}
                  variationOption={variationOption}
                  priceCalculation={priceCalculation}
                  thickness={thickness}
                  keukenBladen={keukenBladen}
                  setKeukenBladen={setKeukenBladen}
                  singleKeukenBlad={singleKeukenBlad}
                  setSingleKeukenblad={setSingleKeukenblad}
                  setThickness={setThickness}
                  formStep={formStep}
                  setFormStep={setFormStep}
                  afwerking={afwerking}
                  setAfwerking={setAfwerking}
                  selectedAfwerking={selectedAfwerking}
                  setSelectedAfwerking={setSelectedAfwerking}
                  displayButton={displayButton}
                  setDisplayButton={setDisplayButton}
                  productData={productData}
                  stollewandOption={stollewandOption}
                  setStollewandOption={setStollewandOption}
                  stollenwandArray={stollenwandArray}
                  setStollenwandArray={setStollenwandArray}
                />
              </div>
            )}
            {formStep === 2 && (
              <div className={styles.form2Container}>
                <AdditionalForm
                  extraOptions={extraOptions}
                  setExtraOptions={setExtraOptions}
                  formStep={formStep}
                  setFormStep={setFormStep}
                  priceCalculation={selectedOption}
                  selectedOption1={selectedOption1}
                  productVariations={productVariations}
                  displayButton={displayButton}
                  setDisplayButton={setDisplayButton}
                  productName={productData && productData[0]?.name}
                  keukenBladen={keukenBladen}
                  productData={productData}
                />
              </div>
            )}
            {formStep === 3 && (
              <div className={styles.form3Container}>
                <ClientInfosForm
                  productMode="keukenblad"
                  user={user}
                  clientData={clientData}
                  setClientData={setClientData}
                  formStep={formStep}
                  setFormStep={setFormStep}
                  submitButton={submitButton}
                  keukenBladen={keukenBladen}
                  extraOptions={extraOptions}
                  setExtraOptions={setExtraOptions}
                  productName={
                    productData ? productData[0].name : "product name"
                  }
                  checkedClientData={checkedClientData}
                  setCheckedClientData={setCheckedClientData}
                  productData={productData}
                  selectedOption={selectedOption}
                  stollenwandArray={stollenwandArray}
                />
              </div>
            )}
            {formStep === 4 && (
              <div className={styles.form4Container}>
                <OverzichtForm
                  keukenBladen={keukenBladen}
                  formStep={formStep}
                  setFormStep={setFormStep}
                  clientData={clientData}
                  extraOptions={extraOptions}
                  linkProduct={linkProduct}
                  productName={productData ? productData[0].name : null}
                  productData={productData}
                  stollenwandArray={stollenwandArray}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.loading}>
          Online
          <span className={`${styles.red} ${styles.spacingRight}`}>
            Offerte
          </span>{" "}
          laden
          <div className={styles.spinner}></div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
