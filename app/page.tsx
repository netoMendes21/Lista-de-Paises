import CountryExplorer from "@/components/country-explorer";
import { getCountries } from "@/lib/countries";

export default async function Home() {
  const countries = await getCountries();
  return <CountryExplorer countries={countries} />;
}
