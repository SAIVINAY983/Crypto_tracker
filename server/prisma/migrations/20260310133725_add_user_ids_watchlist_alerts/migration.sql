/*
  Warnings:

  - Added the required column `userId` to the `PaperAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PortfolioItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PortfolioSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cryptoId" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PriceAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cryptoId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "targetPrice" REAL NOT NULL,
    "direction" TEXT NOT NULL,
    "triggered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PaperAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cashBalance" REAL NOT NULL DEFAULT 100000.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PaperAccount" ("cashBalance", "createdAt", "id", "updatedAt") SELECT "cashBalance", "createdAt", "id", "updatedAt" FROM "PaperAccount";
DROP TABLE "PaperAccount";
ALTER TABLE "new_PaperAccount" RENAME TO "PaperAccount";
CREATE UNIQUE INDEX "PaperAccount_userId_key" ON "PaperAccount"("userId");
CREATE TABLE "new_PortfolioItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cryptoId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PortfolioItem" ("amount", "createdAt", "cryptoId", "id", "symbol", "updatedAt") SELECT "amount", "createdAt", "cryptoId", "id", "symbol", "updatedAt" FROM "PortfolioItem";
DROP TABLE "PortfolioItem";
ALTER TABLE "new_PortfolioItem" RENAME TO "PortfolioItem";
CREATE TABLE "new_PortfolioSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalValue" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PortfolioSnapshot" ("id", "timestamp", "totalValue") SELECT "id", "timestamp", "totalValue" FROM "PortfolioSnapshot";
DROP TABLE "PortfolioSnapshot";
ALTER TABLE "new_PortfolioSnapshot" RENAME TO "PortfolioSnapshot";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_userId_cryptoId_key" ON "WatchlistItem"("userId", "cryptoId");
