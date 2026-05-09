import React, { useState, InputHTMLAttributes } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  field: any;
  label?: string;
  isPassword?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  field,
  label,
  isPassword = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isInvalid =
    field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <div className="relative">
        <Input
          id={field.name}
          name={field.name}
          type={
            isPassword
              ? showPassword
                ? "text"
                : "password"
              : "text"
          }
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => {
            field.handleChange(e.target.value);
            rest.onChange?.(e); // 👈 important for parent
          }}
          placeholder={`Enter your ${label?.toLowerCase()}`}
          autoComplete="off"
          {...rest}
        />

        {/* Toggle icon */}
        {isPassword && (
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </span>
        )}
      </div>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};