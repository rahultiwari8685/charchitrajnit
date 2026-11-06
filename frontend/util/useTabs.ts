import { useState } from "react"

export function useTabs<T extends string>(defaultTab: T, tabs: T[]) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);

  const switchTab = (tab: T) => setActiveTab(tab);

  return { activeTab, switchTab };
}