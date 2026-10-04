import React from 'react'
import { useController, type UseControllerProps, type FieldValues } from 'react-hook-form'

export interface SelectOption {
  label: string
  value: string | number
}

export interface ControlledSelectProps<T extends FieldValues> extends UseControllerProps<T> {
  label?: string
  options: SelectOption[]
  placeholder?: string
  helperText?: string
  className?: string
  selectClassName?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

export function ControlledSelect<T extends FieldValues>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  label,
  options,
  placeholder = 'Chọn một tuỳ chọn',
  helperText,
  className = '',
  selectClassName = '',
  disabled = false,
  required = false,
  id,
}: ControlledSelectProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: required ? 'Vui lòng chọn một mục' : false,
      ...rules,
    },
    defaultValue,
    shouldUnregister,
  })

  const selectId = id || `select-${name}`

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-foreground tracking-tight"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          {...field}
          id={selectId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-desc` : undefined}
          className={`flex h-10 w-full appearance-none rounded-lg border bg-background px-3 py-2 pr-8 text-sm text-foreground shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
            error
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-border hover:border-muted-foreground/50'
          } ${selectClassName}`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="text-xs font-medium text-destructive animate-fadeIn">
          {error.message}
        </p>
      ) : helperText ? (
        <p id={`${selectId}-desc`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
