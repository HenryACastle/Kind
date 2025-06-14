"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined, showYear: boolean = true) {
  if (!date) {
    return ""
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    ...(showYear ? { year: "numeric" } : {})
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export function Calendar28({ value, onChange, showYear = true }: { value?: Date | null, onChange?: (date: Date | null) => void, showYear?: boolean }) {
  const [open, setOpen] = React.useState(false)
  const isControlled = typeof value !== 'undefined' && typeof onChange === 'function';
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(value ?? undefined)
  const [month, setMonth] = React.useState<Date | undefined>(value ?? undefined)
  const [inputValue, setInputValue] = React.useState(formatDate(value ?? internalDate, showYear))

  React.useEffect(() => {
    if (isControlled) {
      setInputValue(formatDate(value ?? undefined, showYear));
    }
  }, [value, showYear]);

  const selectedDate = isControlled ? value ?? undefined : internalDate;

  // Helper to force year to 2000 if showYear is false
  function forceYear(date: Date | null | undefined): Date | null {
    if (!date) return null;
    if (showYear) return date;
    // Always use 2000 as the year
    return new Date(2000, date.getMonth(), date.getDate());
  }

  return (
    <div className="flex flex-col gap-3">
     
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={inputValue}
          placeholder={showYear ? "June 01, 2025" : "June 01"}
          className="bg-background pr-10"
          onChange={(e) => {
            const date = new Date(e.target.value)
            setInputValue(e.target.value)
            if (isValidDate(date)) {
              const forced = forceYear(date)
              if (isControlled && onChange) {
                onChange(forced)
              } else {
                setInternalDate(forced ?? undefined)
              }
              setMonth(forced ?? undefined)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <div style={!showYear ? { position: 'relative' } : {}}>
              <Calendar
                mode="single"
                selected={selectedDate ? forceYear(selectedDate) ?? undefined : undefined}
                captionLayout={showYear ? "dropdown" : "dropdown-months"}
                month={month ? forceYear(month) ?? undefined : undefined}
                onMonthChange={d => setMonth(forceYear(d) ?? undefined)}
                onSelect={(date) => {
                  const forced = forceYear(date)
                  if (isControlled && onChange) {
                    onChange(forced ?? null)
                  } else {
                    setInternalDate(forced ?? undefined)
                  }
                  setInputValue(formatDate(forced ?? undefined, showYear))
                  setOpen(false)
                }}
              />
              {/* Hide year dropdown if showYear is false */}
              {!showYear && (
                <style>{`
                  .rdp-caption_dropdowns select:last-child {
                    display: none !important;
                  }
                `}</style>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
