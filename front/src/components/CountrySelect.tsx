'use client';

import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useMemo } from 'react';
import { CountryOption, ICountryProps } from '@/types/types';

const LATAM_COUNTRIES = [
  'AR', // Argentina
  'BO', // Bolivia
  'BR', // Brasil
  'CL', // Chile
  'CO', // Colombia
  'CR', // Costa Rica
  'CU', // Cuba
  'DO', // República Dominicana
  'EC', // Ecuador
  'SV', // El Salvador
  'GT', // Guatemala
  'HN', // Honduras
  'MX', // México
  'NI', // Nicaragua
  'PA', // Panamá
  'PY', // Paraguay
  'PE', // Perú
  'UY', // Uruguay
  'VE', // Venezuela
];

const CountrySelect = ({ value, onChange, onBlur }: ICountryProps) => {
  const options: CountryOption[] = useMemo(() => {
    return countryList()
      .getData()
      .filter((c: { value: string }) => LATAM_COUNTRIES.includes(c.value))
      .map((c: { value: string; label: string }) => ({
        value: c.value,
        label: c.label,
        flag: `https://flagcdn.com/w40/${c.value.toLowerCase()}.png`,
      }));
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <Select
      instanceId="country-select"
      options={options}
      placeholder="Selecciona un país"
      value={selectedOption}
      onChange={(option) => onChange(option?.value || '')}
      onBlur={onBlur}
      className="text-sm"
      formatOptionLabel={(option: CountryOption) => (
        <div className="flex items-center gap-2">
          <img src={option.flag} alt={option.label} className="h-4 w-6 rounded-sm object-cover" />
          <span>{option.label}</span>
        </div>
      )}
      styles={{
        control: (base, state) => ({
          ...base,
          borderRadius: '12px',
          borderColor: state.isFocused ? '#e76f51' : '#e5e7eb',
          boxShadow: state.isFocused ? '0 0 0 2px rgba(244,162,97,0.4)' : 'none',
          padding: '2px',
          backgroundColor: '#f9fafb',
          '&:hover': {
            borderColor: '#e76f51',
          },
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? '#fef3f2' : 'white',
          color: '#111827',
          cursor: 'pointer',
        }),
      }}
    />
  );
};

export default CountrySelect;
