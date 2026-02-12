import { getTrades } from "./actions";
import DashboardClient from "./DashboardClient";
import { USER_PROFILE, CHART_DATA, PERFORMANCE_BY_SETUP } from "@/lib/data";

export default async function DashboardPage() {
  // Ambil data dari database secara Server-side
  const trades = await getTrades();

  return (
    <DashboardClient 
      initialTrades={trades} 
      userProfile={USER_PROFILE}
      chartData={CHART_DATA}
      performanceData={PERFORMANCE_BY_SETUP}
    />
  );
}
