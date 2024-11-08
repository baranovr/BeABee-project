// createObjectsOverlay.tsx

import React from 'react';
import { DropdownCollapse } from '@app/components/header/Header.styles';
import { useTranslation } from 'react-i18next';
import { CreatePostForm } from "@app/components/header/components/createObjectsDropdown/createPost/createPostForm";
import * as S from '@app/components/header/components/settingsDropdown/settingsOverlay/SettingsOverlay/SettingsOverlay.styles';


export const CreateObjetsOverlay: React.FC = ({ ...props }) => {
  const { t } = useTranslation();

  return (
    <S.SettingsOverlayMenu {...props}>
      <DropdownCollapse bordered={false} expandIconPosition="end" ghost defaultActiveKey="themePicker">
        <DropdownCollapse.Panel header={t('header.createPost')} key="createPost">
          <CreatePostForm />
        </DropdownCollapse.Panel>
      </DropdownCollapse>
    </S.SettingsOverlayMenu>
  );
};
