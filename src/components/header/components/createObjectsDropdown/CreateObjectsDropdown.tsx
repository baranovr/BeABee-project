import React, { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { BasePopover } from '@app/components/common/BasePopover/BasePopover';
import { CreateObjetsOverlay } from '@app/components/header/components/createObjectsDropdown/createObjectsOverlay/createObjectsOverlay';

export const CreateObjectsDropdown: React.FC = () => {
  const [isOpened, setOpened] = useState(false);

  return (
    <BasePopover content={<CreateObjetsOverlay />} trigger="click" onOpenChange={setOpened}>
      <HeaderActionWrapper>
        <BaseButton type={isOpened ? 'ghost' : 'text'} icon={<EditOutlined />} />
      </HeaderActionWrapper>
    </BasePopover>
  );
};
