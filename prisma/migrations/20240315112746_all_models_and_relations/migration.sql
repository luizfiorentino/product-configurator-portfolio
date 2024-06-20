/*
  Warnings:

  - You are about to drop the column `aantalKeukenbladen` on the `OfferteData` table. All the data in the column will be lost.
  - You are about to drop the column `aantalSpatwanden` on the `OfferteData` table. All the data in the column will be lost.
  - You are about to drop the column `extraOptionsChosen` on the `OfferteData` table. All the data in the column will be lost.
  - You are about to drop the column `totaalePrijs` on the `OfferteData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OfferteData" DROP COLUMN "aantalKeukenbladen",
DROP COLUMN "aantalSpatwanden",
DROP COLUMN "extraOptionsChosen",
DROP COLUMN "totaalePrijs";

-- CreateTable
CREATE TABLE "Keukenblad" (
    "id" SERIAL NOT NULL,
    "productNaam" TEXT NOT NULL,
    "productVariatie" TEXT NOT NULL,
    "productAfbeeldingUrl" TEXT NOT NULL,
    "lengte" DOUBLE PRECISION NOT NULL,
    "breedte" DOUBLE PRECISION NOT NULL,
    "keukenbladPrijs" DOUBLE PRECISION NOT NULL,
    "afwerking" BOOLEAN NOT NULL,
    "afwerkingPrijs" DOUBLE PRECISION NOT NULL,
    "afwerkingVoor" BOOLEAN NOT NULL,
    "afwerkingAchter" BOOLEAN NOT NULL,
    "afwerkingRechts" BOOLEAN NOT NULL,
    "afwerkingLinks" BOOLEAN NOT NULL,
    "totalePrijs" DOUBLE PRECISION NOT NULL,
    "offerteDataId" INTEGER NOT NULL,

    CONSTRAINT "Keukenblad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spatwand" (
    "id" SERIAL NOT NULL,
    "productNaam" TEXT NOT NULL,
    "productVariatie" TEXT NOT NULL,
    "productAfbeeldingUrl" TEXT NOT NULL,
    "lengte" DOUBLE PRECISION NOT NULL,
    "breedte" DOUBLE PRECISION NOT NULL,
    "spatwandPrijs" DOUBLE PRECISION NOT NULL,
    "afwerking" BOOLEAN NOT NULL,
    "afwerkingPrijs" DOUBLE PRECISION NOT NULL,
    "totalePrijs" DOUBLE PRECISION NOT NULL,
    "offerteDataId" INTEGER NOT NULL,

    CONSTRAINT "Spatwand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UitsparingSpoelbak" (
    "id" SERIAL NOT NULL,
    "typeInstallatie" TEXT NOT NULL,
    "aantal" INTEGER NOT NULL,
    "eenheidsprijs" DOUBLE PRECISION NOT NULL,
    "prijsUitsparingen" DOUBLE PRECISION NOT NULL,
    "offerteDataId" INTEGER NOT NULL,

    CONSTRAINT "UitsparingSpoelbak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UitsparingKookplaat" (
    "id" SERIAL NOT NULL,
    "typeInstallatie" TEXT NOT NULL,
    "aantal" INTEGER NOT NULL,
    "eenheidsprijs" DOUBLE PRECISION NOT NULL,
    "prijsUitsparingen" DOUBLE PRECISION NOT NULL,
    "offerteDataId" INTEGER NOT NULL,

    CONSTRAINT "UitsparingKookplaat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kraangaten" (
    "id" SERIAL NOT NULL,
    "aantal" INTEGER NOT NULL,
    "eenheidsprijs" DOUBLE PRECISION NOT NULL,
    "prijsKraangaten" DOUBLE PRECISION NOT NULL,
    "offerteDataId" INTEGER NOT NULL,

    CONSTRAINT "Kraangaten_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inmeting" (
    "id" SERIAL NOT NULL,
    "afstandOptie" TEXT NOT NULL,
    "prijsInmeting" DOUBLE PRECISION NOT NULL,
    "offerteDataId" INTEGER NOT NULL,

    CONSTRAINT "Inmeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transport" (
    "id" SERIAL NOT NULL,
    "afstandOptie" TEXT NOT NULL,
    "prijsTransport" DOUBLE PRECISION NOT NULL,
    "offerteDataId" INTEGER NOT NULL,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Montage" (
    "id" SERIAL NOT NULL,
    "montageOptie" TEXT NOT NULL,
    "prijsMontage" DOUBLE PRECISION NOT NULL,
    "offerteDataId" INTEGER NOT NULL,

    CONSTRAINT "Montage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZelfAfhalenDelft" (
    "id" SERIAL NOT NULL,
    "offerteDataId" INTEGER NOT NULL,

    CONSTRAINT "ZelfAfhalenDelft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZelfAfhalenBreda" (
    "id" SERIAL NOT NULL,
    "offerteDataId" INTEGER NOT NULL,

    CONSTRAINT "ZelfAfhalenBreda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UitsparingSpoelbak_offerteDataId_key" ON "UitsparingSpoelbak"("offerteDataId");

-- CreateIndex
CREATE UNIQUE INDEX "UitsparingKookplaat_offerteDataId_key" ON "UitsparingKookplaat"("offerteDataId");

-- CreateIndex
CREATE UNIQUE INDEX "Kraangaten_offerteDataId_key" ON "Kraangaten"("offerteDataId");

-- CreateIndex
CREATE UNIQUE INDEX "Inmeting_offerteDataId_key" ON "Inmeting"("offerteDataId");

-- CreateIndex
CREATE UNIQUE INDEX "Transport_offerteDataId_key" ON "Transport"("offerteDataId");

-- CreateIndex
CREATE UNIQUE INDEX "Montage_offerteDataId_key" ON "Montage"("offerteDataId");

-- CreateIndex
CREATE UNIQUE INDEX "ZelfAfhalenDelft_offerteDataId_key" ON "ZelfAfhalenDelft"("offerteDataId");

-- CreateIndex
CREATE UNIQUE INDEX "ZelfAfhalenBreda_offerteDataId_key" ON "ZelfAfhalenBreda"("offerteDataId");

-- AddForeignKey
ALTER TABLE "Keukenblad" ADD CONSTRAINT "Keukenblad_offerteDataId_fkey" FOREIGN KEY ("offerteDataId") REFERENCES "OfferteData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spatwand" ADD CONSTRAINT "Spatwand_offerteDataId_fkey" FOREIGN KEY ("offerteDataId") REFERENCES "OfferteData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UitsparingSpoelbak" ADD CONSTRAINT "UitsparingSpoelbak_offerteDataId_fkey" FOREIGN KEY ("offerteDataId") REFERENCES "OfferteData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UitsparingKookplaat" ADD CONSTRAINT "UitsparingKookplaat_offerteDataId_fkey" FOREIGN KEY ("offerteDataId") REFERENCES "OfferteData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kraangaten" ADD CONSTRAINT "Kraangaten_offerteDataId_fkey" FOREIGN KEY ("offerteDataId") REFERENCES "OfferteData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inmeting" ADD CONSTRAINT "Inmeting_offerteDataId_fkey" FOREIGN KEY ("offerteDataId") REFERENCES "OfferteData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_offerteDataId_fkey" FOREIGN KEY ("offerteDataId") REFERENCES "OfferteData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Montage" ADD CONSTRAINT "Montage_offerteDataId_fkey" FOREIGN KEY ("offerteDataId") REFERENCES "OfferteData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZelfAfhalenDelft" ADD CONSTRAINT "ZelfAfhalenDelft_offerteDataId_fkey" FOREIGN KEY ("offerteDataId") REFERENCES "OfferteData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZelfAfhalenBreda" ADD CONSTRAINT "ZelfAfhalenBreda_offerteDataId_fkey" FOREIGN KEY ("offerteDataId") REFERENCES "OfferteData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
