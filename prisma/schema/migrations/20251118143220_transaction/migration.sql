/*
  Warnings:

  - You are about to drop the column `TransactionId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."payments_TransactionId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "TransactionId",
ADD COLUMN     "transactionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");
