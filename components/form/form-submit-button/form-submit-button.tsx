"use client";

import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "../../ui/button";
import { cn } from "@/lib/utils";

const LoadingStateIcons = {
  1: () => <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
  0: () => null,
};

interface FormSubmitButtonProps extends ButtonProps {
  isLoading: boolean;
}

export default function FormSubmitButton({
  isLoading,
  children,
  className,
  variant = "default",
  type = "submit",
  ...props
}: FormSubmitButtonProps) {
  const ButtonIcon =
    LoadingStateIcons[Number(isLoading) as keyof typeof LoadingStateIcons];
  return (
    <Button
      variant={variant}
      size="sm"
      className={cn(
        "w-full px-[1.125rem] py-4 text-[0.938rem] lg:text-base rounded-3xl",
        className
      )}
      type={type}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <ButtonIcon />
      {children}
    </Button>
  );
}
