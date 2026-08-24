import { getCountries } from "@/app/_lib/data-service";

// Let's imagine your colleague already built this component 😃

async function SelectCountry({ defaultCountry, name, id, className }) {
  const countries = await getCountries();
  const safeCountries = Array.isArray(countries) ? countries : [];
  const flag =
    safeCountries.find((country) => country.name === defaultCountry)?.flag ?? "";
  const hasSavedCountry =
    defaultCountry &&
    defaultCountry !== "unknown" &&
    !safeCountries.some((country) => country.name === defaultCountry);

  return (
    <select
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">请选择国家或地区……</option>
      {hasSavedCountry && (
        <option value={`${defaultCountry}%${flag}`}>{defaultCountry}</option>
      )}
      {safeCountries.map((c) => (
        <option key={c.name} value={`${c.name}%${c.flag}`}>
          {c.displayName || c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
