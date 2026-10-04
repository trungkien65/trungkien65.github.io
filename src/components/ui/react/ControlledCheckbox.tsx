import React from 'react'
import { useController, type UseControllerProps, type FieldValues } from 'react-hook-form'

export interface ControlledCheckboxProps<T extends FieldValues> extends UseControllerProps<T> {
  label: React.ReactNode
  helperText?: string
  className?: string
  disabled?: boolean
  id?: string
}

export function ControlledCheckbox<T extends FieldValues>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  label,
  helperText,
  className = '',
  disabled = false,
  id,
}: ControlledCheckboxProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
  })

  const checkboxId = id || `checkbox-${name}`

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          id={checkboxId}
          checked={!!field.value}
          onChange={(e) => field.onChange(e.target.checked)}
          onBlur={field.onBlur}
          ref={field.ref}
          disabled={disabled}
          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-colors cursor-pointer disabled:cursor-not-allowed"
        />
        <label
          htmlFor={checkboxId}
          className="text-sm font-medium leading-none text-foreground cursor-pointer select-none"
        >
          {label}
        </label>
      </div>

      {error ? (
        <p className="text-xs font-medium text-destructive animate-fadeIn pl-6">
          {error.message}
        </p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground pl-6">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
