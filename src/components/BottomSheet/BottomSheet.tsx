import * as React from "react"
import { cn } from "@/lib/utils"

export interface BottomSheetProps {
  type?: "title" | "title+description" | "small tittle";
  version?: "light" | "dark";
  children?: React.ReactNode
}

const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center rounded w-[1866px] h-[803px]", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
BottomSheet.displayName = "BottomSheet"

export { BottomSheet }
export default BottomSheet