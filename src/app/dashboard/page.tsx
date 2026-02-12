// src/app/dashboard/page.tsx

// 1. Import fungsi pengambil data (Server Action)
import { getTrades } from "./actions";

// 2. Import Client Component yang sudah kita buat sebelumnya
import DashboardClient from "./DashboardClient";

// 3. Import data statis untuk profil dan grafik (sementara)
import { USER_PROFILE, CHART_DATA } from "@/lib/data";

/**
 * DashboardPage adalah Server Component.
 * Di sinilah data "mentah" diambil langsung dari database Zi.
 */
export default async function DashboardPage() {
  // Ambil data trades terbaru dari database PostgreSQL
  const trades = await getTrades();

  return (
    // Kirim data trades, profil Zi, dan chart ke Client Component
    <DashboardClient 
      initialTrades={trades} 
      userProfile={USER_PROFILE} 
      chartData={CHART_DATA} 
    />
  );
}
