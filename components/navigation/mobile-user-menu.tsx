import Image from "next/image";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import IconVerticalEllipsis from "public/images/icon-vertical-ellipsis.svg";

export default function MobileUserMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="ml-4" variant="ghost" size="icon">
          <Image src={IconVerticalEllipsis} alt="Menu" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-lighter-blue-gray">
        <SheetHeader>
          <SheetTitle>Main Menu</SheetTitle>
          <SheetDescription>Description</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">Hello</div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
