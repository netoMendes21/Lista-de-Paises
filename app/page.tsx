import { getCountries } from "@/lib/countries";
import CountryExplorer from "@/components/country-explorer";

export default async function Home() {
  const countries = await getCountries();
  return <CountryExplorer countries={countries} />;
}
