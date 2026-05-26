import { FormField } from "./FormField";

type TextAreaFieldProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
};

export function TextAreaField({
  id,
  name,
  label,
  required,
  error,
  rows = 5,
  placeholder,
  disabled,
}: TextAreaFieldProps) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className="input resize-y"
      />
    </FormField>
  );
}
