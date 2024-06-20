/*
  Warnings:

  - Changed the type of `eenheidsPrijs` on the `Stollenwand` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Stollenwand" DROP COLUMN "eenheidsPrijs",
ADD COLUMN     "eenheidsPrijs" INTEGER NOT NULL;
