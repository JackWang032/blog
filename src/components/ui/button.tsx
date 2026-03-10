import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
    {
        variants: {
            variant: {
                default: cn(
                    "bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground",
                    "hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:scale-[1.02]",
                    "active:scale-[0.98]",
                    "animate-gradient"
                ),
                destructive: cn(
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                    "hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                ),
                outline: cn(
                    "border border-primary/30 bg-background/50 backdrop-blur-sm",
                    "hover:bg-primary/10 hover:border-primary/50 hover:text-primary",
                    "hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                ),
                secondary: cn(
                    "bg-secondary/20 text-secondary-foreground border border-secondary/30",
                    "hover:bg-secondary/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                ),
                ghost: cn(
                    "hover:bg-primary/10 hover:text-primary",
                    "hover:shadow-[0_0_10px_rgba(0,255,255,0.15)]"
                ),
                link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-lg px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
