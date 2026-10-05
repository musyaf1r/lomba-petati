-- CreateTable
CREATE TABLE "Lahan" (
    "id" TEXT NOT NULL,
    "panenId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "luas" DOUBLE PRECISION NOT NULL,
    "komoditas" TEXT,
    "status" TEXT NOT NULL DEFAULT 'kosong',
    "tanggalTanam" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HasilPanen" (
    "id" TEXT NOT NULL,
    "lahanId" TEXT NOT NULL,
    "jumlahHasil" DOUBLE PRECISION NOT NULL,
    "satuan" TEXT NOT NULL DEFAULT 'kg',
    "hargaSaatPanen" DOUBLE PRECISION NOT NULL,
    "totalPendapatan" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tanggalPanen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HasilPanen_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lahan" ADD CONSTRAINT "Lahan_panenId_fkey" FOREIGN KEY ("panenId") REFERENCES "Panen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HasilPanen" ADD CONSTRAINT "HasilPanen_lahanId_fkey" FOREIGN KEY ("lahanId") REFERENCES "Lahan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
