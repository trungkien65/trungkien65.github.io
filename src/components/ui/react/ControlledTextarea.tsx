import React from 'react'
import { useController, type UseControllerProps, type FieldValues } from 'react-hook-form'

export interface ControlledTextareaProps<T extends FieldValues> extends UseControllerProps<T> {
  label?: string
  placeholder?: string
  rows?: number
  helperText?: string
  className?: string
  textareaClassName?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

export function ControlledTextarea<T extends FieldValues>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  label,
  placeholder,
  rows = 3,
  helperText,
  className = '',
  textareaClassName = '',
  disabled = false,
  required = false,
  id,
}: ControlledTextareaProps<T>) {
  const {
    field,
    fieldState: { error },
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

  const textareaId = id || `textarea-${name}`

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-foreground tracking-tight"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <textarea
        {...field}
        id={textareaId}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-desc` : undefined}
        className={`flex w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? 'border-destructive focus-visible:ring-destructive'
            : 'border-border hover:border-muted-foreground/50'
        } ${textareaClassName}`}
      />

      {error ? (
        <p id={`${textareaId}-error`} className="text-xs font-medium text-destructive animate-fadeIn">
          {error.message}
        </p>
      ) : helperText ? (
        <p id={`${textareaId}-desc`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
