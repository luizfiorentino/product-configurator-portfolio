// Vroeger: alle e-mails naar: jw0gagktir+if57u+1lyaqc@in.meistertask.com
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ClientInfosForm.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { AiOutlineUpload } from "react-icons/ai";
import { IoTrashBin } from "react-icons/io5";
import { postImages } from "@/utils";
import Header from "../header/Header";
import { useRouter } from "next/router";
import axios from "axios";

const formSchema = z.object({
  userFirstName: z
    .string()
    .min(2, "Voornaam moet minimaal 2 tekens lang zijn")
    .max(255, "De opgegeven voornaam bevat te veel tekens"),
  userLastName: z
    .string()
    .min(2, "Achternaam moet minimaal 2 tekens lang zijn")
    .max(255, "De opgegeven achternaam bevat te veel tekens"),
  address: z
    .string()
    .min(10, "Adres moet minimaal 4 tekens lang zijn")
    .max(255, "Opgegeven adres bevat te veel tekens"),
  toevoeging: z
    .string()
    .max(25, "Adres toevoeging moet maximaal 25 tekens lang zijn"),
  postalCode: z
    .string()
    .min(4, "Ongeldige postcode")
    .max(25, "Ongeldige postcode"),
  city: z
    .string()
    .min(2, "Ongeldige woonplaats")
    .max(255, "Ongeldige woonplaats"),
  email: z
    .string()
    .min(1, "Gelieve een geldig e-mailadres op te geven")
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Gelieve een geldig e-mailadres op te geven",
    }),

  phoneNumber: z
    .string()
    .min(6, "Gelieve een geldig telefoonnummer op te geven")
    .max(255, "Ongeldige telefoonNummer"),
  file: z
    .array(z.any())
    .max(2, "U kunt maximaal 2 afbeeldingen uploaden (max. 8Mb/bestand)")
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const acceptedExtensions = ["jpeg", "jpg", "png", "pdf"];
        // Validate each file
        for (const file of value) {
          const fileExtension = file.name.split(".").pop().toLowerCase();
          if (!acceptedExtensions.includes(fileExtension)) {
            return false;
          }
        }
        return true;
      },
      {
        message: "Het bestand moet de indeling JPEG, JPG, PNG of PDF hebben.",
      }
    )
    .refine(
      (value) => {
        if (!value) return true;
        const fileSizeLimit = 8 * 1024 * 1024;
        // const fileSizeLimit = 1048576;
        for (const file of value) {
          const fileSize = file.size;
          if (fileSize > fileSizeLimit) {
            return false;
          }
        }
        return true;
      },
      {
        message: "Elk bestand moet kleiner zijn dan of gelijk zijn aan 8 MB.",
      }
    ),
});

export default function ClientInfosForm({
  user,
  productMode,
  clientData,
  setClientData,
  formStep,
  setFormStep,
  keukenBladen,
  extraOptions,
  productName,
  productData,
  doucheBak,
  element,
  opmerking,
  selectedOption,
  stollenwandArray,
  arrayOfProducts,
  totalBankenPrice,
}) {
  const [purchaseTotalPrice, setPurchaseTotalPrice] = useState(null);
  const [previewSources, setPreviewSources] = useState([]);
  const [errorPosting, setErrorPosting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const changedFields = [];
  const router = useRouter();
  const { user_id } = router.query;

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      userFirstName: clientData ? clientData.Voornaam : "",
      userLastName: clientData ? clientData.Achternaam : "",
      address: clientData ? clientData["Straatnaam + huisnummer"] : "",
      postalCode: clientData ? clientData.Postcode : "",
      city: clientData ? clientData.Woonplaats : "",
      email: clientData ? clientData["E-mailadres"] : "",
      phoneNumber: clientData ? clientData.Telefoonnummer : "",
      file: previewSources ? previewSources : [],
    },
    // mode: "all", --> don't use, it's users unfriendly
    resolver: zodResolver(formSchema),
  });
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    const currentFiles = watch("file");
    const uniqueFiles = acceptedFiles.filter(
      (file) =>
        currentFiles.find((existingFile) => existingFile.path === file.path) ===
        undefined
    );
    setValue("file", [...currentFiles, ...uniqueFiles]);
  }, []);
  const removeFile = (index) => {
    const currentFiles = watch("file");
    // show only one if the same slected file at once
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    setValue("file", updatedFiles);
    setPreviewSources((prevSources) => {
      const updatedSources = [...prevSources];
      updatedSources.splice(index, 1);
      return updatedSources;
    });
    setPreviewSources((prevSources) => {
      const updatedSources = [...prevSources];
      updatedSources.splice(index, 1);
      return updatedSources;
    });
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  const selectedFiles = watch("file");

  useEffect(() => {
    if (selectedFiles) {
      generatePreviews(selectedFiles);
    }
  }, [selectedFiles]);

  const generatePreviews = useCallback(
    (files) => {
      const promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(promises)
        .then((results) => {
          setPreviewSources([...results]);
        })
        .catch((error) => {
          console.log("Error generating previews:", error);
        });
    },
    [previewSources, setPreviewSources]
  );
  function getSelectedOptionInfo(option) {
    if (!extraOptions) {
      return;
    }
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
  function getSelectedOptionInfo(option) {
    if (!extraOptions) {
      return;
    }
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
  const uitsparingSpoelbakInfo = getSelectedOptionInfo("Uitsparing_spoelbak");
  const { selectedOptionName: spoelbakName, selectedOption: spoelbakOption } =
    uitsparingSpoelbakInfo;
  const uitsparingKookplaatInfo = getSelectedOptionInfo("Uitsparing_kookplaat");
  const { selectedOptionName: kookplaatName, selectedOption: kookplaatOption } =
    uitsparingKookplaatInfo;
  const inmetenOptionsInfo = getSelectedOptionInfo("Inmeten");
  const { selectedOptionName: inmetenName, selectedOption: inmetenOption } =
    inmetenOptionsInfo;
  const montageOptionsInfo = getSelectedOptionInfo("Montage");
  const { selectedOptionName: montageName, selectedOption: montageOption } =
    montageOptionsInfo;
  const transportOptionsInfo = getSelectedOptionInfo("Transport");
  const { selectedOptionName: transportName, selectedOption: transportOption } =
    transportOptionsInfo;
  function isNumber(value) {
    return typeof value === "number" && !isNaN(value);
  }
  let priceGaten;
  if (extraOptions.Kraan_gat.chosen) {
    priceGaten =
      extraOptions.Kraan_gat.aantal * extraOptions.Kraan_gat.pricePerNumber;
  }
  const totalPrice = () => {
    let arrayOfPrices = [];
    const pricesToCheck = [
      spoelbakOption?.price * extraOptions?.Uitsparing_spoelbak?.aantal,
      kookplaatOption?.price * extraOptions?.Uitsparing_kookplaat?.aantal,
      priceGaten,
      inmetenOption?.price,
      transportOption?.price,
      montageOption?.price,
    ];

    pricesToCheck.forEach((price) => {
      if (isNumber(price)) {
        arrayOfPrices.push(price);
      }
    });
    let keukenBladenPrice;
    if (keukenBladen) {
      keukenBladenPrice = keukenBladen.map((oneKB) => {
        arrayOfPrices.push(oneKB.price + oneKB.priceAfwerking);
        return oneKB.price + oneKB.priceAfwerking;
      });
    }

    const spatWandenPrice = Array.isArray(extraOptions?.Spatwand_rand)
      ? extraOptions.Spatwand_rand.map((oneSW) => {
          arrayOfPrices.push(oneSW.price + oneSW.priceAfwerking);
          return oneSW.price + oneSW.priceAfwerking;
        })
      : [];

    const stollewandenPrice = stollenwandArray?.map((stollenwand) => {
      arrayOfPrices.push(stollenwand.totalPrice);
      return stollenwand.totalPrice;
    });

    const sum = arrayOfPrices.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

    const maxLength = Math.max(
      keukenBladenPrice?.length,
      spatWandenPrice.length
    );

    const sumArray = Array.from({ length: maxLength }, (_, index) => {
      const num1 =
        index < keukenBladenPrice.length && !isNaN(keukenBladenPrice[index])
          ? keukenBladenPrice[index]
          : 0;

      const num2 =
        index < spatWandenPrice.length && !isNaN(spatWandenPrice[index])
          ? spatWandenPrice[index]
          : 0;

      return !isNaN(num1) && !isNaN(num2) ? num1 + num2 : 0;
    });

    const totalSum = sumArray.reduce((acc, value) => acc + value, 0);

    return sum;
  };

  const sendEmailStoneCenter = async () => {
    const productImage = productData && productData[0]?.images[0].src;
    try {
      const [error, response] = await postImages({
        klantNaam: clientData.Voornaam,
        klantAchterNaam: clientData.Achternaam,
        file: previewSources,
      });
      if (error) {
        setPreviewSources([]);
      }
      const imageUrls = response.map((image) => image);
      let emailResponse;
      if (productMode === "keukenblad") {
        emailResponse = await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: ["jw0gagktir+jvbsk+1lyaqc@in.meistertask.com"],
            subject: `Keukenblad Offerteaanvraag van ${clientData.Voornaam} ${clientData.Achternaam} - ${clientData["E-mailadres"]}`,
            clientData: {
              clientData,
            },
            keukenBladen: [keukenBladen],
            stollenwandArray,
            extraOptions: {
              extraOptions,
            },
            spoelbakName,
            spoelbakOption,
            kookplaatName,
            kookplaatOption,
            kookplaatName,
            inmetenName,
            inmetenOption,
            transportName,
            transportOption,
            montageName,
            montageOption,
            subprice: totalPrice(),
            purchaseTotalPrice,
            productName,
            productImage,
            images: imageUrls,
            productMode: productMode,
          }),
        });
      }
      if (productMode === "douchebak") {
        emailResponse = await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: ["jw0gagktir+jvbsp+1lyaqc@in.meistertask.com"],
            subject: `Douchebak Offerteaanvraag van ${clientData.Voornaam} ${clientData.Achternaam} - ${clientData["E-mailadres"]}`,
            clientData: {
              clientData,
            },
            keukenBladen: [keukenBladen],
            extraOptions: {
              extraOptions,
            },
            spoelbakName,
            spoelbakOption,
            kookplaatName,
            kookplaatOption,
            kookplaatName,
            inmetenName,
            inmetenOption,
            transportName,
            transportOption,
            montageName,
            montageOption,
            subprice: totalPrice(),
            purchaseTotalPrice,
            productName,
            productImage,
            images: imageUrls,
            productMode,
            doucheBak,
            element,
            opmerking,
          }),
        });
      }
      if (productMode === "vensterbank") {
        emailResponse = await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: ["jw0gagktir+jvbsq+1lyaqc@in.meistertask.com"],
            subject: `Vensterbank Offerteaanvraag van ${clientData.Voornaam} ${clientData.Achternaam} - ${clientData["E-mailadres"]}`,
            clientData: {
              clientData,
            },
            keukenBladen: [keukenBladen],
            extraOptions: {
              extraOptions,
            },
            spoelbakName,
            spoelbakOption,
            kookplaatName,
            kookplaatOption,
            kookplaatName,
            inmetenName,
            inmetenOption,
            transportName,
            transportOption,
            montageName,
            montageOption,
            subprice: totalPrice(),
            purchaseTotalPrice,
            productName,
            productImage,
            images: imageUrls,
            productMode,
            doucheBak,
            element,
            opmerking,
            arrayOfProducts,
            totalBankenPrice,
          }),
        });
      }
      if (!emailResponse.ok) {
        const error = await emailResponse.text();
        console.error("Server error:", error);

        return;
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  const sendEmail = async () => {
    const productImage = productData && productData[0]?.images[0].src;
    try {
      const [error, response] = await postImages({
        klantNaam: clientData.Voornaam,
        klantAchterNaam: clientData.Achternaam,
        file: previewSources,
      });
      if (error) {
        setPreviewSources([]);
      }
      const imageUrls = response.map((image) => image);
      let emailResponse;
      if (productMode === "keukenblad") {
        emailResponse = await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: [
              ...(clientData["E-mailadres"] ? [clientData["E-mailadres"]] : []),
            ],
            bcc: ["jw0gagktir+jvbsk+1lyaqc@in.meistertask.com"],
            subject: `Keukenblad Offerteaanvraag van ${clientData.Voornaam} ${clientData.Achternaam} - ${clientData["E-mailadres"]}`,
            clientData: {
              clientData,
            },
            keukenBladen: [keukenBladen],
            stollenwandArray,
            extraOptions: {
              extraOptions,
            },
            spoelbakName,
            spoelbakOption,
            kookplaatName,
            kookplaatOption,
            kookplaatName,
            inmetenName,
            inmetenOption,
            transportName,
            transportOption,
            montageName,
            montageOption,
            subprice: totalPrice(),
            purchaseTotalPrice,
            productName,
            productImage,
            images: imageUrls,
            productMode: productMode,
          }),
        });
      }
      if (productMode === "douchebak") {
        emailResponse = await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: [
              ...(clientData["E-mailadres"] ? [clientData["E-mailadres"]] : []),
            ],
            subject: `Douchebak Offerteaanvraag van ${clientData.Voornaam} ${clientData.Achternaam} - ${clientData["E-mailadres"]}`,
            clientData: {
              clientData,
            },
            keukenBladen: [keukenBladen],
            extraOptions: {
              extraOptions,
            },
            spoelbakName,
            spoelbakOption,
            kookplaatName,
            kookplaatOption,
            kookplaatName,
            inmetenName,
            inmetenOption,
            transportName,
            transportOption,
            montageName,
            montageOption,
            subprice: totalPrice(),
            purchaseTotalPrice,
            productName,
            productImage,
            images: imageUrls,
            productMode,
            doucheBak,
            element,
            opmerking,
          }),
        });
      }
      if (productMode === "vensterbank") {
        emailResponse = await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: [
              ...(clientData["E-mailadres"] ? [clientData["E-mailadres"]] : []),
            ],
            subject: `Vensterbank Offerteaanvraag van ${clientData.Voornaam} ${clientData.Achternaam} - ${clientData["E-mailadres"]}`,
            clientData: {
              clientData,
            },
            keukenBladen: [keukenBladen],
            extraOptions: {
              extraOptions,
            },
            spoelbakName,
            spoelbakOption,
            kookplaatName,
            kookplaatOption,
            kookplaatName,
            inmetenName,
            inmetenOption,
            transportName,
            transportOption,
            montageName,
            montageOption,
            subprice: totalPrice(),
            purchaseTotalPrice,
            productName,
            productImage,
            images: imageUrls,
            productMode,
            doucheBak,
            element,
            opmerking,
            arrayOfProducts,
            totalBankenPrice,
          }),
        });
      }
      if (!emailResponse.ok) {
        const error = await emailResponse.text();
        console.error("Server error:", error);
        return;
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const emailSentRef = useRef(false);
  useEffect(() => {
    if (clientData["E-mailadres"] && !emailSentRef.current && submitted) {
      sendEmail();
      sendEmailStoneCenter();
      emailSentRef.current = true;
      setFormStep(formStep + 1);
      reset();
    }
  }, [clientData]);
  let uitsparingOption;
  if (
    extraOptions.Uitsparing_spoelbak &&
    extraOptions.Uitsparing_spoelbak.chosen
  ) {
    uitsparingOption = null;
    for (const option of Object.keys(extraOptions.Uitsparing_spoelbak)) {
      if (extraOptions.Uitsparing_spoelbak[option].chosen) {
        uitsparingOption = option;
        break;
      }
    }
  }
  let uitsparingKookplaatOption;
  if (
    extraOptions.Uitsparing_kookplaat &&
    extraOptions.Uitsparing_kookplaat.chosen
  ) {
    uitsparingKookplaatOption = null;
    for (const option of Object.keys(extraOptions.Uitsparing_kookplaat)) {
      if (extraOptions.Uitsparing_kookplaat[option].chosen) {
        uitsparingKookplaatOption = option;
        break;
      }
    }
  }
  let optionInmeten;
  if (extraOptions.Inmeten && extraOptions.Inmeten.chosen) {
    optionInmeten = null;
    for (const option of Object.keys(extraOptions.Inmeten)) {
      if (extraOptions.Inmeten[option].chosen) {
        optionInmeten = option;
        break;
      }
    }
  }
  let optionTransport;
  if (extraOptions.Transport && extraOptions.Transport.chosen) {
    optionTransport = null;
    for (const option of Object.keys(extraOptions.Transport)) {
      if (extraOptions.Transport[option].chosen) {
        optionTransport = option;
        break;
      }
    }
  }
  let optionMontage;
  if (extraOptions.Montage && extraOptions.Montage.chosen) {
    optionMontage = null;
    for (const option of Object.keys(extraOptions.Montage)) {
      if (extraOptions.Montage[option].chosen) {
        optionMontage = option;
        break;
      }
    }
  }

  const submitInfos = async (data) => {
    setSubmitted(true);
    gtag("event", "button_click", {
      event_category: "Knoppen",
      event_label: "Verstuur Knop",
    });
    const {
      userFirstName,
      userLastName,
      address,
      toevoeging,
      postalCode,
      city,
      email,
      phoneNumber,
    } = data;

    const clientName = `${data.userFirstName} ${data.userLastName}`;
    // const address = data.address;
    // const email = data.email;
    // const phoneNumber = data.phoneNumber;
    const offerCity = data.city;
    const offerPostCode = data.postalCode;

    if (
      userFirstName !== user?.first_name ||
      userLastName !== user?.last_name ||
      address !== user?.billing?.address_1 ||
      postalCode !== user?.billing?.postcode ||
      city !== user?.billing?.city ||
      email !== user?.billing?.email ||
      phoneNumber !== user?.billing?.phone
    ) {
      const updatedUser = {
        first_name: userFirstName,
        last_name: userLastName,
        email: email,
        billing: {
          address_1: address,
          postcode: postalCode,
          city: city,
          email: email,
          phone: phoneNumber,
          first_name: userFirstName,
          last_name: userLastName,
        },
        // shipping: {
        //   address_1: address,
        //   postcode: postalCode,
        //   city: city,
        //   phone: phoneNumber,
        //   first_name: userFirstName,
        //   last_name: userLastName,
        // },
      };

      try {
        setLoading(true);
        const response = await axios.put(
          `https://stonecenter-shop.nl/wp-json/wc/v3/customers/${user_id}`,
          updatedUser,
          {
            params: {
              consumer_key: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
              consumer_secret: process.env.NEXT_PUBLIC_REACT_APP_API_SECRET,
            },
          }
        );

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error updating user information:", error);
      }
    }

    await setPreviewSources(data.file);
    setClientData((prevData) => ({
      ...prevData,
      Voornaam: data.userFirstName,
      Achternaam: data.userLastName,
      "Straatnaam + huisnummer":
        data.toevoeging && data.toevoeging !== " "
          ? `${data.address}. Toevoeging: ${data.toevoeging}`
          : data.address,
      Postcode: data.postalCode,
      Woonplaats: data.city,
      "E-mailadres": data.email,
      Telefoonnummer: data.phoneNumber,
    }));

    try {
      const response = await fetch("/api/offertes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName,
          address,
          email,
          phoneNumber,
          stad: offerCity,
          postcode: offerPostCode,
          productNaam: productData ? productData[0]?.name : "name not found",
          productVariatie: selectedOption?.name
            ? selectedOption.name
            : "variation not found",
          productAfbeeldingUrl: productData
            ? productData[0]?.images[0].src
            : "image not found",
          aantalKeukenbladen: keukenBladen.length,
          aantalSpatwanden: extraOptions.Spatwand_rand.length,
          extraOptionsChosen: false,
          totaal: totalPrice(),
          keukenbladen: keukenBladen,
          spatwanden: extraOptions.Spatwand_rand,
          stollenwandArray,
          uitsparingSpoelbak:
            uitsparingOption !== undefined
              ? {
                  typeInstallatie: uitsparingOption,
                  aantal: extraOptions.Uitsparing_spoelbak.aantal,
                  eenheidsprijs:
                    extraOptions.Uitsparing_spoelbak[uitsparingOption].price,
                  prijsUitsparingen:
                    extraOptions.Uitsparing_spoelbak.aantal *
                    extraOptions.Uitsparing_spoelbak[uitsparingOption].price,
                }
              : false,
          uitsparingKookplaat:
            uitsparingKookplaatOption !== undefined
              ? {
                  typeInstallatie: uitsparingKookplaatOption,
                  aantal: extraOptions.Uitsparing_kookplaat.aantal,
                  eenheidsprijs:
                    extraOptions.Uitsparing_kookplaat[uitsparingKookplaatOption]
                      .price,
                  prijsUitsparingen:
                    extraOptions.Uitsparing_kookplaat.aantal *
                    extraOptions.Uitsparing_kookplaat[uitsparingKookplaatOption]
                      .price,
                }
              : false,
          kraangaten:
            extraOptions.Kraan_gat.chosen !== false
              ? {
                  aantal: extraOptions.Kraan_gat.aantal,
                  eenheidsprijs: extraOptions.Kraan_gat.pricePerNumber,
                  prijsKraangaten:
                    extraOptions.Kraan_gat.pricePerNumber *
                    extraOptions.Kraan_gat.aantal,
                }
              : false,
          inmeting:
            extraOptions.Inmeten.chosen !== false
              ? {
                  afstandOptie: optionInmeten,
                  prijsInmeting: extraOptions.Inmeten[optionInmeten].price,
                }
              : false,
          transport:
            extraOptions.Transport.chosen !== false
              ? {
                  afstandOptie: optionTransport,
                  prijsTransport: extraOptions.Transport[optionTransport].price,
                }
              : false,
          montage:
            extraOptions.Montage.chosen !== false
              ? {
                  montageOptie: optionMontage,
                  prijsMontage: extraOptions.Montage[optionMontage].price,
                }
              : false,
          zelfAfhalenDelft: extraOptions?.Transport?.ZelfAfhalenDelft?.chosen
            ? true
            : false,
          zelfAfhalenBreda: extraOptions?.Transport?.ZelfAfhalenBreda?.chosen
            ? true
            : false,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  function getSelectedOptionInfo(option) {
    if (!extraOptions) {
      return;
    }
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

  return (
    <div>
      {!doucheBak ? <Header /> : ""}
      <div
        className={
          keukenBladen?.length ? styles.KBTopImage : styles.productTopImage
        }
      >
        {!doucheBak && !productMode?.includes("vensterbank") ? (
          <img
            src={productData && productData[0]?.images[0].src}
            alt="StoneCenter NatuurSteen product"
            className={styles.productImage}
          />
        ) : (
          ""
        )}
        {productMode?.includes("vensterbank") ? (
          <div className={styles.KBTopImage}>
            <img
              src={productData && productData[0]?.images[0].src}
              alt="Vensterbank afbeelding"
              className={styles.prodImageContainer}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      {/* <form onSubmit={handleSubmit(submitInfos)}> */}
      <div className={styles.test}>
        <div className={styles.voorAndAchterNames}>
          {/* <div className={styles.clientInfosInput}>
            <label className={`${styles.label}`}>
              Voornaam <span className={styles.red}>*</span>
            </label>
            <input
              type="text"
              placeholder="Uw voornaam"
              name="userFirstName"
              className={styles.clientInputContainer}
              {...register("userFirstName")}
              error={errors.userFirstName}
            />
            {errors.userFirstName && (
              <p className={styles.errorMessage}>
                * {errors.userFirstName.message}
              </p>
            )}
          </div> */}
          <div className={styles.clientInfosInput}>
            <label className={`${styles.label}`}>
              Voornaam <span className={styles.red}>*</span>
            </label>
            <input
              type="text"
              placeholder="Uw voornaam"
              name="userFirstName"
              className={styles.clientInputContainer}
              {...register("userFirstName")}
              //value={clientData.Voornaam}
              value={watch("userFirstName")}
              onChange={(e) => setValue("userFirstName", e.target.value)}
              //error={errors.userFirstName}
              //disabled={submitted}
            />
            {errors.userFirstName && (
              <p className={styles.errorMessage}>
                * {errors.userFirstName.message}
              </p>
            )}
          </div>
          <div className={styles.clientInfosInput}>
            <label className={styles.label}>
              Achternaam <span className={styles.red}>*</span>
            </label>
            <input
              type="text"
              placeholder="Uw achternaam"
              name="userLastName"
              className={styles.clientInputContainer}
              {...register("userLastName")}
              value={watch("userLastName")}
              onChange={(e) => setValue("userLastName", e.target.value)}
              //error={errors.userLastName}
            />
            {errors.userLastName && (
              <p className={styles.errorMessage}>
                * {errors.userLastName.message}
              </p>
            )}
          </div>
        </div>
        <div className={styles.addressFirst}>
          <div className={styles.clientInfosInput}>
            <label className={styles.label}>
              Adres <span className={styles.red}>*</span>
            </label>
            <input
              type="text"
              placeholder="Straatnaam en huisnummer"
              name="address"
              className={styles.clientInputContainer}
              {...register("address")}
              //error={errors.address}
              value={watch("address")}
              onChange={(e) => setValue("address", e.target.value)}
            />
            {errors.address && (
              <p className={styles.errorMessage}>* {errors.address.message}</p>
            )}
          </div>

          <div className={styles.clientInfosInput}>
            <label className={styles.label}>Toevoeging</label>
            <input
              type="text"
              placeholder="Optioneel"
              name="toevoeging"
              className={styles.clientInputContainer}
              {...register("toevoeging")}
              error={errors.toevoeging}
            />
            {errors.toevoeging && (
              <p className={styles.errorMessage}>
                * {errors.toevoeging.message}
              </p>
            )}
          </div>
        </div>
        <div className={styles.addressSecond}>
          <div className={styles.clientInfosInput}>
            <label className={styles.label}>
              Postcode <span className={styles.red}>*</span>
            </label>
            <input
              type="text"
              placeholder="Uw postcode"
              name="postalCode"
              className={styles.clientInputContainer}
              {...register("postalCode")}
              //error={errors.postalCode}
              value={watch("postalCode")}
              onChange={(e) => setValue("postalCode", e.target.value)}
            />
            {errors.postalCode && (
              <p className={styles.errorMessage}>
                * {errors.postalCode.message}
              </p>
            )}
          </div>
          <div className={styles.clientInfosInput}>
            <label className={styles.label}>
              Woonplaats <span className={styles.red}>*</span>
            </label>
            <input
              type="text"
              placeholder="Uw woonplaats"
              name="city"
              className={styles.clientInputContainer}
              {...register("city")}
              //error={errors.city}
              value={watch("city")}
              onChange={(e) => setValue("city", e.target.value)}
            />
            {errors.city && (
              <p className={styles.errorMessage}>* {errors.city.message}</p>
            )}
          </div>
        </div>
        <div className={styles.emailAndPhone}>
          <div className={styles.clientInfosInput}>
            <label className={`${styles.label}`}>
              E-mailadres <span className={styles.red}>*</span>
            </label>
            <input
              type="text"
              placeholder="Uw e-mailadres"
              name="email"
              className={styles.clientInputContainer}
              {...register("email")}
              value={watch("email")}
              onChange={(e) => setValue("email", e.target.value)}
              //disabled={submitted}
            />
            {errors.email && (
              <p className={styles.errorMessage}>* {errors.email.message}</p>
            )}
          </div>
          <div className={styles.clientInfosInput}>
            <label className={styles.label}>
              Telefoonnummer <span className={styles.red}>*</span>
            </label>
            <input
              type="text"
              placeholder="Uw telefoonnummer"
              name="phoneNumber"
              className={styles.clientInputContainer}
              {...register("phoneNumber")}
              //error={errors.phoneNumber}
              value={watch("phoneNumber")}
              onChange={(e) => setValue("phoneNumber", e.target.value)}
            />
            {errors.phoneNumber && (
              <p className={styles.errorMessage}>
                * {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>
        <label className={styles.label}>Bijlagen</label>
        <div>
          <div
            className={styles.dropzone}
            {...getRootProps()}
            style={{ color: "black" }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p variant="dragDrop">Zet hier bestanden neer</p>
            ) : (
              <p variant="dragDrop">
                Sleep bestanden hierheen of klik hier
                <AiOutlineUpload className={styles.uploadIcon} />
              </p>
            )}
          </div>
          <div>
            {errors.file && (
              <p className={`${styles.errorMessage} ${styles.spaceUnder}`}>
                * {errors.file.message}
              </p>
            )}
          </div>
        </div>
        {previewSources.length ? (
          <div className={styles.imageArea}>
            {previewSources &&
              previewSources.map((src, index) => (
                <div key={index} className={styles.imagePreviewContainer}>
                  {typeof src === "string" &&
                  src.startsWith("data:application/pdf;base64,") ? (
                    <iframe
                      className={styles.imagePreview}
                      src={src}
                      title={`PDF Preview ${index}`}
                      data={src}
                    ></iframe>
                  ) : (
                    <img
                      className={styles.imagePreview}
                      src={src}
                      alt="klant bijlage"
                    />
                  )}
                  <div className={styles.deleteIconContainer}>
                    <button
                      className={styles.deleteIcon}
                      onClick={(event) => {
                        event.preventDefault();
                        removeFile(index);
                      }}
                    >
                      <IoTrashBin />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          ""
        )}
        {errorPosting && (
          <p className={styles.errorMessage}>
            Er is een fout opgetreden bij het uploaden van de bestanden. Probeer
            het opnieuw of neem contact op met de beheerder.
          </p>
        )}
      </div>
      <div className={styles.termsAndConditionsContainer}>
        <input
          type="checkbox"
          checked={clientData?.algemeneVoorwaarden}
          onChange={(e) =>
            setClientData({
              ...clientData,
              algemeneVoorwaarden: e.target.checked,
            })
          }
        />
        <label>
          Ik ga akkoord met
          <a
            href="https://stonecenter-shop.nl/algemene-voorwaarden/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.termsAndConditionsLink}
          >
            {" "}
            algemene voorwaarden
            <span className={`${styles.red} ${styles.bold}`}>*</span>
          </a>
        </label>
      </div>
      <div className={styles.footerButtons}>
        <button
          className={styles.backButton}
          onClick={() => setFormStep(formStep - 1)}
        >
          Vorig
        </button>
        <button
          className={
            clientData?.algemeneVoorwaarden
              ? styles.submitButton
              : styles.submitButtonInactive
          }
          id="verzendInfos"
          onClick={handleSubmit(submitInfos)}
          disabled={!clientData?.algemeneVoorwaarden}
        >
          Versturen
        </button>
      </div>{" "}
    </div>
  );
}
