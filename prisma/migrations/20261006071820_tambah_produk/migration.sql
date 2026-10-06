-- CreateTable
CREATE TABLE "Produk" (
    "id" TEXT NOT NULL,
    "panenId" TEXT NOT NULL,
    "namaPetani" TEXT NOT NULL,
    "namaBarang" TEXT NOT NULL,
    "hargaJual" DOUBLE PRECISION NOT NULL,
    "stok" DOUBLE PRECISION NOT NULL,
    "satuan" TEXT NOT NULL DEFAULT 'kg',
    "fotoUrl" TEXT,
    "nomorHp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_panenId_fkey" FOREIGN KEY ("panenId") REFERENCES "Panen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
