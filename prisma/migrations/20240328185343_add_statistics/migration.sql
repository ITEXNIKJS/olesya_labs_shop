-- AlterTable
ALTER TABLE "products" ALTER COLUMN "ram" DROP DEFAULT;

-- CreateTable
CREATE TABLE "statistic" (
    "id" TEXT NOT NULL,
    "orders_count" INTEGER NOT NULL,
    "orders_sum" DOUBLE PRECISION NOT NULL,
    "average_price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statistic_pkey" PRIMARY KEY ("id")
);
