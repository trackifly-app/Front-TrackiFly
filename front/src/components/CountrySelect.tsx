'use client';

import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useMemo, useEffect, useState } from 'react';
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

const CountrySelectContent = ({ value, onChange, onBlur }: ICountryProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mountTimer = window.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(() => {
      checkDarkMode();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      window.clearTimeout(mountTimer);
      observer.disconnect();
    };
  }, []);

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

  if (!isMounted) {
    return <div className="h-10 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>;
  }

  return (
    <Select
      instanceId="country-select"
      options={options}
      placeholder="Selecciona un país"
      value={selectedOption}
      onChange={(option) => onChange(option?.value || '')}
      onBlur={onBlur}
      className="text-sm"
      classNamePrefix="react-select"
      formatOptionLabel={(option: CountryOption) => (
        <div className="flex items-center gap-2">
          <img src={option.flag} alt={option.label} className="h-4 w-6 rounded-sm object-cover" />
          <span>{option.label}</span>
        </div>
      )}
      theme={(theme) => ({
        ...theme,
        borderRadius: 12,
        colors: {
          ...theme.colors,
          primary25: isDarkMode ? '#1e293b' : '#fef2f2',
          primary: '#e76f51',
          neutral0: isDarkMode ? '#0f172a' : '#ffffff',
          neutral5: isDarkMode ? '#0f172a' : '#f9fafb',
          neutral10: isDarkMode ? '#334155' : '#e5e7eb',
          neutral20: isDarkMode ? '#334155' : '#d1d5db',
          neutral30: isDarkMode ? '#475569' : '#9ca3af',
          neutral60: isDarkMode ? '#94a3b8' : '#6b7280',
          neutral80: isDarkMode ? '#e2e8f0' : '#111827',
          neutral90: isDarkMode ? '#e2e8f0' : '#111827',
        },
      })}
      styles={{
        control: (base, state) => ({
          ...base,
          borderRadius: '12px',
          borderColor: state.isFocused ? '#e76f51' : isDarkMode ? '#334155' : '#e5e7eb',
          boxShadow: state.isFocused ? '0 0 0 2px rgba(244,162,97,0.4)' : 'none',
          padding: '2px',
          backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
          color: isDarkMode ? '#e2e8f0' : '#111827',
          minHeight: '42px',
          '&:hover': {
            borderColor: '#e76f51',
          },
        }),
        valueContainer: (base) => ({
          ...base,
          backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb',
          color: isDarkMode ? '#e2e8f0' : '#111827',
          padding: '4px 8px',
        }),
        input: (base) => ({
          ...base,
          color: isDarkMode ? '#e2e8f0' : '#111827',
        }),
        placeholder: (base) => ({
          ...base,
          color: isDarkMode ? '#94a3b8' : '#9ca3af',
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: isDarkMode ? '#cbd5e1' : '#6b7280',
          '&:hover': {
            color: isDarkMode ? '#f8fafc' : '#111827',
          },
        }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: isDarkMode ? '#334155' : '#d1d5db',
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? (isDarkMode ? '#1e293b' : '#fef3f2') : isDarkMode ? '#0f172a' : 'white',
          color: isDarkMode ? '#e2e8f0' : '#111827',
          cursor: 'pointer',
          ':active': {
            backgroundColor: isDarkMode ? '#14213d' : '#f1f5f9',
          },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: isDarkMode ? '#0f172a' : 'white',
          borderColor: isDarkMode ? '#334155' : '#e5e7eb',
          color: isDarkMode ? '#e2e8f0' : '#111827',
          boxShadow: isDarkMode ? '0 10px 20px -10px rgba(0, 0, 0, 0.8)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }),
        menuList: (base) => ({
          ...base,
          backgroundColor: isDarkMode ? '#0f172a' : 'white',
        }),
        singleValue: (base) => ({
          ...base,
          color: isDarkMode ? '#e2e8f0' : '#111827',
        }),
        noOptionsMessage: (base) => ({
          ...base,
          color: isDarkMode ? '#94a3b8' : '#6b7280',
          backgroundColor: isDarkMode ? '#0f172a' : 'white',
        }),
      }}
    />
  );
};

const CountrySelect = (props: ICountryProps) => {
  return <CountrySelectContent {...props} />;
};

export default CountrySelect;
