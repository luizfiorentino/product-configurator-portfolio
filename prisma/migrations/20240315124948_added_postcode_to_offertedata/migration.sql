/*
  Warnings:

  - Added the required column `postcode` to the `OfferteData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OfferteData" ADD COLUMN     "postcode" TEXT NOT NULL;
