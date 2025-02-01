import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "default" | "lg";
    description?: React.ReactNode;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
    ({ className, size = "default", description, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 sm:p-4 w-full", className)}
                {...props}
            >
                <Loader2
                    className={cn("animate-spin", {
                        "h-3 w-3 sm:h-4 sm:w-4": size === "sm",
                        "h-5 w-5 sm:h-6 sm:w-6": size === "default",
                        "h-7 w-7 sm:h-8 sm:w-8": size === "lg",
                    })}
                />
                {description && (
                    <p
                        className={cn("text-muted-foreground text-center max-w-[200px] sm:max-w-[300px] break-words", {
                            "text-[10px] sm:text-xs": size === "sm",
                            "text-xs sm:text-sm": size === "default",
                            "text-sm sm:text-base": size === "lg",
                        })}
                    >
                        {description}
                    </p>
                )}
            </div>
        );
    }
);

Loading.displayName = "Loading";

export { Loading };
