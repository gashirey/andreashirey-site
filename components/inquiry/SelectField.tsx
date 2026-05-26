import { FormField } from "./FormField";

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  options: readonly { value: string; label: string }[];
  defaultValue?: string;
  disabled?: boolean;
};

export function SelectField({
  id,
  name,
  label,
  required,
  error,
  options,
  defaultValue = "",
  disabled,
}: SelectFieldProps) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        disabled={disabled}
        className="input"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
