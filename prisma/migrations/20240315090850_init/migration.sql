-- CreateTable
CREATE TABLE "OfferteData" (
    "id" SERIAL NOT NULL,
    "stad" TEXT NOT NULL,
    "aantalKeukenbladen" INTEGER NOT NULL,
    "aantalSpatwanden" INTEGER NOT NULL,
    "extraOptionsChosen" BOOLEAN NOT NULL,
    "totaalePrijs" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferteData_pkey" PRIMARY KEY ("id")
);
