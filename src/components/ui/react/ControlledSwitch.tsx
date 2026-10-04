import React from 'react'
import { useController, type UseControllerProps, type FieldValues } from 'react-hook-form'

export interface ControlledSwitchProps<T extends FieldValues> extends UseControllerProps<T> {
  label: React.ReactNode
  description?: string
  className?: string
  disabled?: boolean
  id?: string
}

export function ControlledSwitch<T extends FieldValues>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  label,
  description,
  className = '',
  disabled = false,
  id,
}: ControlledSwitchProps<T>) {
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

  const switchId = id || `switch-${name}`
  const isChecked = !!field.value

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={switchId} className="cursor-pointer select-none">
          <div className="text-sm font-medium text-foreground">{label}</div>
          {description && <div className="text-xs text-muted-foreground">{description}</div>}
        </label>

        <button
          type="button"
          role="switch"
          id={switchId}
          aria-checked={isChecked}
          disabled={disabled}
          onClick={() => field.onChange(!isChecked)}
          onBlur={field.onBlur}
          ref={field.ref}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            isChecked ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
              isChecked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {error && (
        <p className="text-xs font-medium text-destructive animate-fadeIn">
          {error.message}
        </p>
      )}
    </div>
  )
}
