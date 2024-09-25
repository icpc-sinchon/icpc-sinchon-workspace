import { TabNav } from "@radix-ui/themes";
import { useRouter } from "next/router";

type Item = {
  name: string;
  link: string;
};

function TabNavigation({ items }: { items: Item[] }) {
  const router = useRouter();

  return (
    <TabNav.Root>
      {items.map((item) => (
        <TabNav.Link
          key={item.link}
          href={item.link}
          active={router.pathname === item.link}
        >
          {item.name}
        </TabNav.Link>
      ))}
    </TabNav.Root>
  );
}

export default TabNavigation;
