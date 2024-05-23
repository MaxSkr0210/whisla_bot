-- CreateTable
CREATE TABLE "Supplie" (
    "incomeId" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lastChangeDate" TEXT NOT NULL,
    "supplierArticle" TEXT NOT NULL,
    "techSize" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "dateClose" TIMESTAMP(3) NOT NULL,
    "warehouseName" TEXT NOT NULL,
    "nmId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Supplie_pkey" PRIMARY KEY ("incomeId")
);
