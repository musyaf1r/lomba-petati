import { NextResponse } from "next/server";

const KOMODITAS = [
  { id: 1, nama: "Beras", satuan: "kg" },
  { id: 2, nama: "Daging Ayam", satuan: "kg" },
  { id: 3, nama: "Daging Sapi", satuan: "kg" },
  { id: 4, nama: "Telur Ayam", satuan: "kg" },
  { id: 5, nama: "Bawang Merah", satuan: "kg" },
  { id: 6, nama: "Bawang Putih", satuan: "kg" },
  { id: 7, nama: "Cabai Merah", satuan: "kg" },
  { id: 8, nama: "Cabai Rawit", satuan: "kg" },
  { id: 9, nama: "Minyak Goreng", satuan: "liter" },
  { id: 10, nama: "Gula Pasir", satuan: "kg" },
];

function formatTanggalPIHPS(date: Date) {
  const bulan = date.toLocaleDateString("en-US", { month: "short" });
  const hari = date.getDate();
  const tahun = date.getFullYear();
  return `${bulan} ${hari} ${tahun}`;
}

async function fetchHargaKomoditas(
  commodityId: number,
  satuan: string,
  tanggal: string,
  provId: number,
  priceType: number
) {
  const url = `https://www.bi.go.id/hargapangan/WebSite/Home/GetGridData1?tanggal=${encodeURIComponent(
    tanggal
  )}&commodity=${commodityId}&priceType=${priceType}&isPasokan=1&jenis=1&periode=1&provId=${provId}`;

  const res = await fetch(url, {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Referer: "https://www.bi.go.id/hargapangan",
      Accept: "application/json, text/javascript, */*; q=0.01",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Gagal fetch komoditas ${commodityId}: ${res.status}`);
  }

  const json = await res.json();
  const item = json?.data?.[0];

  if (!item) return null;

  const harga = provId === 0 ? item.SemuaProvinsi : item.Nilai;
  const persen = provId === 0 ? item.SemuaPercentage : item.Percentage;

  return {
    id: commodityId,
    nama: item.Komoditas,
    harga,
    perubahan: item.NilaiDiff,
    persenPerubahan: persen,
    tanggalUpdate: item.TanggalLast,
    periodePembanding: item.TanggalInflasi,
    provinsi: provId === 0 ? "Nasional" : item.Provinsi,
    satuan,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const provId = Number(searchParams.get("provId") ?? 0);
    const priceType = Number(searchParams.get("priceType") ?? 1);

    const tanggal = formatTanggalPIHPS(new Date());

    const hasil = await Promise.allSettled(
      KOMODITAS.map((k) =>
        fetchHargaKomoditas(k.id, k.satuan, tanggal, provId, priceType)
      )
    );

    const data = hasil
      .filter((r) => r.status === "fulfilled" && r.value !== null)
      .map((r) => (r as PromiseFulfilledResult<any>).value);

    return NextResponse.json({
      data,
      tanggal,
      diperbaruiPada: new Date().toISOString(),
    });
  } catch (error) {
    console.log("[HARGA_PASAR_GET]", error);
    return new NextResponse("Gagal mengambil data harga pasar", { status: 500 });
  }
}