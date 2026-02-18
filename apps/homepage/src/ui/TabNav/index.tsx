import TabNavClient from "./TabNavClient";

type TabNavClientItem = {
  tabURL: string;
  tabTitle: string;
  selected: boolean;
};

function TabNav<T extends object>({
  tabList,
  currentTabIndex,
  makeTabURL,
  makeTabTitle,
}: {
  tabList: T[];
  currentTabIndex: number;
  makeTabURL: (tabInfo: T) => string;
  makeTabTitle: (tabInfo: T) => string;
}) {
  const tabs: TabNavClientItem[] = tabList.map((tabInfo, index) => ({
    tabURL: makeTabURL(tabInfo),
    tabTitle: makeTabTitle(tabInfo),
    selected: index === currentTabIndex,
  }));

  return <TabNavClient tabs={tabs} />;
}

export default TabNav;
