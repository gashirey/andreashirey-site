type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
};

export function FormField({
  id,
  label,
  required,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-bark">
        {label}
        {!required ? (
          <span className="font-normal text-stone"> (optional)</span>
        ) : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-stone">{hint}</p> : null}
      {error ? (
        <p className="text-xs text-bark" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
