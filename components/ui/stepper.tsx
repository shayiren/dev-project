"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const Stepper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: number
  }
>(({ className, value, children, ...props }, ref) => {
  const childrenArray = React.Children.toArray(children)
  const steps = childrenArray.filter((child) => React.isValidElement(child) && child.type === Step)

  return (
    <div ref={ref} className={cn("flex items-center w-full", className)} {...props}>
      {steps.map((step, index) => {
        if (!React.isValidElement(step)) return null

        const isCompleted = index < value
        const isCurrent = index === value

        return React.cloneElement(step, {
          ...step.props,
          index,
          isCompleted,
          isCurrent,
          isLast: index === steps.length - 1,
        })
      })}
    </div>
  )
})
Stepper.displayName = "Stepper"

const Step = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: number
    index?: number
    isCompleted?: boolean
    isCurrent?: boolean
    isLast?: boolean
  }
>(({ className, children, index, isCompleted, isCurrent, isLast, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center w-full", isLast ? "flex-none" : "flex-1", className)} {...props}>
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold",
            isCompleted
              ? "border-primary bg-primary text-primary-foreground"
              : isCurrent
                ? "border-primary text-primary"
                : "border-muted-foreground text-muted-foreground",
          )}
        >
          {isCompleted ? <CheckIcon className="h-4 w-4" /> : index !== undefined ? index + 1 : null}
        </div>
        <div className="mt-2 text-center">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null
            if (child.type === StepTitle) {
              return React.cloneElement(child, {
                ...child.props,
                className: cn(
                  "text-sm font-medium",
                  isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground",
                  child.props.className,
                ),
              })
            }
            if (child.type === StepDescription) {
              return React.cloneElement(child, {
                ...child.props,
                className: cn(
                  "text-xs",
                  isCompleted || isCurrent ? "text-muted-foreground" : "text-muted-foreground/60",
                  child.props.className,
                ),
              })
            }
            return child
          })}
        </div>
      </div>
      {!isLast && <div className={cn("h-[2px] flex-1 mx-2", isCompleted ? "bg-primary" : "bg-muted-foreground/30")} />}
    </div>
  )
})
Step.displayName = "Step"

const StepTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm font-medium", className)} {...props} />,
)
StepTitle.displayName = "StepTitle"

const StepDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  ),
)
StepDescription.displayName = "StepDescription"

export { Stepper, Step, StepTitle, StepDescription }
