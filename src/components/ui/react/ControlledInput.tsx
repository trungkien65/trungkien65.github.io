import React from 'react'
import { useController, type UseControllerProps, type FieldValues } from 'react-hook-form'

export interface ControlledInputProps<T extends FieldValues> extends UseControllerProps<T> {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  helperText?: string
  className?: string
  inputClassName?: string
  disabled?: boolean
  required?: boolean
  autoComplete?: string
  id?: string
}

export function ControlledInput<T extends FieldValues>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  label,
  placeholder,
  type = 'text',
  helperText,
  className = '',
  inputClassName = '',
  disabled = false,
  required = false,
  autoComplete,
  id,
}: ControlledInputProps<T>) {
  const {
    field,
    fieldState: { error, isTouched, isDirty },
  } = useController({
    name,
    control,
    rules: {
      required: required ? 'Trường này là bắt buộc' : false,
      ...rules,
    },
    defaultValue,
    shouldUnregister,
  })

  const inputId = id || `input-${name}`

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground tracking-tight"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          {...field}
          id={inputId}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-desc` : undefined}
          className={`flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
            error
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-border hover:border-muted-foreground/50'
          } ${inputClassName}`}
        />
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-xs font-medium text-destructive animate-fadeIn">
          {error.message}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-desc`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
