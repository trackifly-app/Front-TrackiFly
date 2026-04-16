'use client';

import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useMemo, useEffect, useState } from 'react';
import { CountryOption, ICountryProps } from '@/types/types';

const LATAM_COUNTRIES = ['AR', 'BO', 'BR', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'UY', 'VE'];

const CountrySelectContent = ({ value, onChange, onBlur }: ICountryProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const mountTimer = window.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(mountTimer);
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
    return <div className="h-10 bg-surface-muted rounded-xl animate-pulse"></div>;
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
          primary: 'var(--color-primary)',
          primary25: 'var(--color-surface-muted)',
          neutral0: 'var(--color-background)',
          neutral5: 'var(--color-surface-muted)',
          neutral10: 'var(--color-border)',
          neutral20: 'var(--color-border)',
          neutral30: 'var(--color-muted)',
          neutral60: 'var(--color-muted)',
          neutral80: 'var(--color-foreground)',
          neutral90: 'var(--color-foreground)',
        },
      })}
      styles={{
        control: (base, state) => ({
          ...base,
          borderRadius: '12px',
          borderColor: state.isFocused ? 'var(--color-primary)' : 'var(--color-border)',
          boxShadow: state.isFocused ? '0 0 0 2px var(--ring)' : 'none',
          padding: '2px',
          backgroundColor: 'var(--color-surface-muted)',
          color: 'var(--color-foreground)',
          minHeight: '42px',
          '&:hover': {
            borderColor: 'var(--color-primary)',
          },
        }),
        valueContainer: (base) => ({
          ...base,
          backgroundColor: 'var(--color-surface-muted)',
          color: 'var(--color-foreground)',
          padding: '4px 8px',
        }),
        input: (base) => ({
          ...base,
          color: 'var(--color-foreground)',
        }),
        placeholder: (base) => ({
          ...base,
          color: 'var(--color-muted)',
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: 'var(--color-muted)',
          '&:hover': {
            color: 'var(--color-foreground)',
          },
        }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: 'var(--color-border)',
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? 'var(--color-surface-muted)' : 'var(--color-background)',
          color: 'var(--color-foreground)',
          cursor: 'pointer',
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-foreground)',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        }),
        menuList: (base) => ({
          ...base,
          backgroundColor: 'var(--color-background)',
        }),
        singleValue: (base) => ({
          ...base,
          color: 'var(--color-foreground)',
        }),
        noOptionsMessage: (base) => ({
          ...base,
          color: 'var(--color-muted)',
          backgroundColor: 'var(--color-background)',
        }),
      }}
    />
  );
};

const CountrySelect = (props: ICountryProps) => {
  return <CountrySelectContent {...props} />;
};

export default CountrySelect;
