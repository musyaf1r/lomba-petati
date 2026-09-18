-- CreateTable
CREATE TABLE "Panen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Panen_pkey" PRIMARY KEY ("id")
);
