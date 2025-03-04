import React, { useState } from 'react';
import styled from 'styled-components';

interface TabItem {
  key: string;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  defaultActiveKey?: string;
  items: TabItem[];
  onChange?: (activeKey: string) => void;
}

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e8e8e8;
`;

const TabHeaderItem = styled.div<{ $active: boolean, $disabled?: boolean }>`
  padding: 12px 16px;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  color: ${(props) => (props.$disabled ? '#00000040' : props.$active ? '#1890ff' : 'rgba(0, 0, 0, 0.85)')};
  border-bottom: 2px solid ${(props) => (props.$active ? '#1890ff' : 'transparent')};
  transition: all 0.3s;

  &:hover {
    ${(props) =>
      !props.$disabled &&
      `
      color: #40a9ff;
      border-bottom-color: #40a9ff;
    `}
  }
`;

const TabContent = styled.div`
  padding: 16px;
`;

export const Tabs: React.FC<TabsProps> = ({ defaultActiveKey = '1', items, onChange }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  const handleTabChange = (key: string) => {
    const selectedTab = items.find((item) => item.key === key);
    if (selectedTab && !selectedTab.disabled) {
      setActiveKey(key);
      onChange?.(key);
    }
  };

  const activeTab = items.find((item) => item.key === activeKey);

  return (
    <TabContainer>
      <TabHeader>
        {items.map((item) => (
          <TabHeaderItem
            key={item.key}
            $active={item.key === activeKey}
            $disabled={item.disabled}
            onClick={() => handleTabChange(item.key)}
          >
            {item.label}
          </TabHeaderItem>
        ))}
      </TabHeader>
      {activeTab && <TabContent>{activeTab.children}</TabContent>}
    </TabContainer>
  );
};
