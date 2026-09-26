import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://www.bi.go.id/hargapangan/WebSite/Home/GetType",
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Referer: "https://www.bi.go.id/hargapangan",
          Accept: "application/json, text/javascript, */*; q=0.01",
        },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      throw new Error(`Gagal fetch jenis pasar: ${res.status}`);
    }

    const json = await res.json();

    return NextResponse.json({ data: json.data });
  } catch (error) {
    console.log("[JENIS_PASAR_GET]", error);
    return new NextResponse("Gagal mengambil daftar jenis pasar", { status: 500 });
  }
}