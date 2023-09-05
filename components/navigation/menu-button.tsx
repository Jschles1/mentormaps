import * as React from "react";
import { Button } from "../ui/button";

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
        className="text-gray text-[0.938rem] disabled:bg-white disabled:text-gray bg-white rounded-tl-none rounded-bl-none rounded-tr-[100px] rounded-br-[100px] w-full justify-start hover:text-white focus:text-white focus-within:text-white focus:bg-dark-lavender active:text-white active:bg-dark-lavender"
        {...props}
      >
        {children}
      </Button>
    );
  }
);
MenuButton.displayName = "MenuButton";

export default MenuButton;
