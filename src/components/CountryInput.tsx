import React, { forwardRef, Dispatch, SetStateAction } from "react";
import { countries, sanitizeCountryName } from "../domain/countries";
import { Group, Text, Autocomplete } from "@mantine/core";
import { flag } from "country-emoji";

interface CountryInputProps {
  setCountryValue: Dispatch<SetStateAction<string>>;
  countryValue: string;
  setCurrentGuess: (guess: string) => void;
}

interface ItemProps {
  value: string;
  id: string;
}

const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ id, value, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Text>{flag(id)}</Text>
        <div>
          <Text>{value}</Text>
        </div>
      </Group>
    </div>
  )
);
AutoCompleteItem.displayName = "Autocomplete Item";

export function CountryInput({
  countryValue,
  setCountryValue,
  setCurrentGuess,
}: CountryInputProps) {
  return (
    <Autocomplete
      autoComplete="noautocompleteplz"
      placeholder="Pick a country"
      itemComponent={AutoCompleteItem}
      data={countries.map((country) => ({
        name: country.name,
        value: `${country.name}`,
        id: country.code,
      }))}
      filter={(value, item) =>
        item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.id.toLowerCase().includes(value.toLowerCase().trim())
      }
      onItemSubmit={(item) => {
        setCurrentGuess(sanitizeCountryName(item.value));
      }}
      value={countryValue}
      onChange={setCountryValue}
    />
  );
}
