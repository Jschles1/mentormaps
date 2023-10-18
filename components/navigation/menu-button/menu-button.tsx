import * as React from "react";
import { Button } from "../../ui/button";

type MenuButtonProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof Button>;

const MenuButton = React.forwardRef(
  (props: MenuButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, disabled } = props;

    return (
      <Button
        ref={ref}
        disabled={disabled}
        variant="ghost"
        className="text-gray text-[0.938rem] lg:text-base disabled:bg-white disabled:text-gray hover:text-dark-lavender hover:bg-[rgba(99,95,199,0.10)] focus:text-white focus:bg-dark-lavender focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-lavender active:bg-[rgba(99,95,199,0.10)] active:text-dark-lavender rounded-tl-none rounded-bl-none w-full justify-start"
        {...props}
      >
        {children}
      </Button>
    );
  }
);
MenuButton.displayName = "MenuButton";

export default MenuButton;
