import type { HeaderViewModel } from "@/lib/site-view-models";

import { HeaderNavigation } from "./HeaderNavigation";
import { MaxWidth } from "./MaxWidth";
import { MobileNavigation } from "./MobileNavigation";

type HeaderProps = HeaderViewModel;

function Header({ navigation }: HeaderProps) {
  return (
    <header className="pointer-events-none py-2 text-foreground">
      <MaxWidth className="flex items-center justify-center">
        <HeaderNavigation items={navigation} ariaLabel="التنقل الرئيسي" />
        <MobileNavigation navigation={navigation} />
      </MaxWidth>
    </header>
  );
}

export { Header };
