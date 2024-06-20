/*
  Warnings:

  - Added the required column `aantalKeukenbladen` to the `OfferteData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aantalSpatwanden` to the `OfferteData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraOptionsChosen` to the `OfferteData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totaal` to the `OfferteData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OfferteData" ADD COLUMN     "aantalKeukenbladen" INTEGER NOT NULL,
ADD COLUMN     "aantalSpatwanden" INTEGER NOT NULL,
ADD COLUMN     "extraOptionsChosen" BOOLEAN NOT NULL,
ADD COLUMN     "totaal" DOUBLE PRECISION NOT NULL;
