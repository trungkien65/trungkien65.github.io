import { describe, it, expect } from "vitest"
import React, { act } from "react"
import { createRoot } from "react-dom/client"
import { useForm } from "react-hook-form"
import { ControlledInput } from "@/components/ui/react/ControlledInput"
import { Button } from "@/components/ui/react/Button"
import { Badge } from "@/components/ui/react/Badge"
import { Chip } from "@/components/ui/react/Chip"
import { ProgressBar } from "@/components/ui/react/ProgressBar"

;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true

function FormWrapper({
  children,
  defaultValues = {},
}: {
  children: (control: any) => React.ReactElement
  defaultValues?: any
}) {
  const { control } = useForm({ defaultValues })
  return children(control)
}

describe("Reusable UI & Form Components", () => {
  it("renders Button with proper classes and disabled state when loading", async () => {
    const container = document.createElement("div")
    const root = createRoot(container)
    await act(async () => {
      root.render(
        React.createElement(Button, { variant: "primary", loading: true }, "Lưu dữ liệu"),
      )
    })

    const btn = container.querySelector("button")
    expect(btn).not.toBeNull()
    expect(btn?.disabled).toBe(true)
    expect(btn?.textContent).toContain("Lưu dữ liệu")
    expect(btn?.querySelector("svg")).not.toBeNull()
  })

  it("renders Badge with selected variant style", async () => {
    const container = document.createElement("div")
    const root = createRoot(container)
    await act(async () => {
      root.render(React.createElement(Badge, { variant: "success" }, "Thành công"))
    })

    const badge = container.querySelector("span")
    expect(badge?.textContent).toBe("Thành công")
    expect(badge?.className).toContain("bg-emerald-500/10")
  })

  it("renders Chip with active state and badge", async () => {
    const container = document.createElement("div")
    const root = createRoot(container)
    await act(async () => {
      root.render(
        React.createElement(Chip, { active: true, badge: 42 }, "Nét 1"),
      )
    })

    const chip = container.querySelector("button")
    expect(chip?.textContent).toContain("Nét 1")
    expect(chip?.textContent).toContain("42")
    expect(chip?.className).toContain("bg-primary text-primary-foreground")
  })

  it("renders ProgressBar with correct percentage and aria attributes", async () => {
    const container = document.createElement("div")
    const root = createRoot(container)
    await act(async () => {
      root.render(
        React.createElement(ProgressBar, { value: 25, max: 50, showLabel: true, label: "Học tập" }),
      )
    })

    const bar = container.querySelector('[role="progressbar"]') as HTMLElement
    expect(bar).not.toBeNull()
    expect(bar.getAttribute("aria-valuenow")).toBe("25")
    expect(bar.getAttribute("aria-valuemax")).toBe("50")

    const fill = bar.querySelector("div") as HTMLElement
    expect(fill.style.width).toBe("50%")
    expect(container.textContent).toContain("50%")
  })

  it("renders ControlledInput with label and placeholder", async () => {
    const container = document.createElement("div")
    const root = createRoot(container)
    await act(async () => {
      root.render(
        React.createElement(
          FormWrapper,
          { defaultValues: { email: "" } },
          (control) =>
            React.createElement(ControlledInput, {
              name: "email",
              control,
              label: "Địa chỉ Email",
              placeholder: "nhap@email.com",
              required: true,
            }),
        ),
      )
    })

    const label = container.querySelector("label")
    expect(label?.textContent).toContain("Địa chỉ Email")
    expect(label?.textContent).toContain("*")

    const input = container.querySelector("input")
    expect(input?.placeholder).toBe("nhap@email.com")
    expect(input?.id).toBe("input-email")
  })
})
