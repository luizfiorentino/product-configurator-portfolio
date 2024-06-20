-- CreateTable
CREATE TABLE "Stollenwand" (
    "id" SERIAL NOT NULL,
    "productNaam" TEXT NOT NULL,
    "productVariatie" TEXT NOT NULL,
    "productAfbeeldingUrl" TEXT NOT NULL,
    "breedte" DOUBLE PRECISION NOT NULL,
    "hoogte" DOUBLE PRECISION NOT NULL,
    "aantal" INTEGER NOT NULL,
    "eenheidsPrijs" BOOLEAN NOT NULL,
    "totalePrijs" DOUBLE PRECISION NOT NULL,
    "keukenbladId" TEXT NOT NULL,
    "offerteDataId" INTEGER NOT NULL,

    CONSTRAINT "Stollenwand_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stollenwand" ADD CONSTRAINT "Stollenwand_offerteDataId_fkey" FOREIGN KEY ("offerteDataId") REFERENCES "OfferteData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
