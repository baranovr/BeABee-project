import React from 'react';
import { DropdownCollapse } from '@app/components/header/Header.styles';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@app/hooks/reduxHooks';
import * as S from '@app/components/header/components/settingsDropdown/settingsOverlay/SettingsOverlay/SettingsOverlay.styles';
import { CreatePostForm } from "@app/components/header/components/createObjectsDropdown/createPost/createPostForm";
import { CreateSubjectForm } from "@app/components/header/components/createObjectsDropdown/createSubject/createSubjectForm";
import { CreateNewsForm } from "@app/components/header/components/createObjectsDropdown/createNews/createNews";
import { CreateImportantInfoForm } from "@app/components/header/components/createObjectsDropdown/createImportantInfo/createImportantInfo";
import { CreateTeacherForm } from "@app/components/header/components/createObjectsDropdown/createTeacher/createTeacherForm";
import { CreateHomeworkForm } from "@app/components/header/components/createObjectsDropdown/createHomework/createHomeworkForm";
import { CreateExamForm } from "@app/components/header/components/createObjectsDropdown/createExam/createExamForm";

export const CreateObjetsOverlay: React.FC = ({ ...props }) => {
  const { t } = useTranslation();
  const { user } = useAppSelector(state => state.user);
  
  const isAdminOrCreator = user?.statusInService === "Admin" || user?.statusInService === "Creator";

  return (
    <S.SettingsOverlayMenu {...props}>
      <DropdownCollapse bordered={false} expandIconPosition="end" ghost defaultActiveKey="themePicker">
        {/* Доступно только админам и креаторам */}
        {isAdminOrCreator && (
          <>
            <DropdownCollapse.Panel header={t('header.createHomework')} key="createHomework">
              <CreateHomeworkForm />
            </DropdownCollapse.Panel>
            <DropdownCollapse.Panel header={t('header.createSubject')} key="createSubject">
              <CreateSubjectForm />
            </DropdownCollapse.Panel>
            <DropdownCollapse.Panel header={t('header.createTeacher')} key="createTeacher">
              <CreateTeacherForm />
            </DropdownCollapse.Panel>
            <DropdownCollapse.Panel header={t('header.createExam')} key="createExam">
              <CreateExamForm />
            </DropdownCollapse.Panel>
          </>
        )}

        {/* Доступно всем пользователям */}
        <DropdownCollapse.Panel header={t('header.createNews')} key="createNews">
          <CreateNewsForm />
        </DropdownCollapse.Panel>
        <DropdownCollapse.Panel header={t('header.createImportantInfo')} key="createImportantInfo">
          <CreateImportantInfoForm />
        </DropdownCollapse.Panel>
        <DropdownCollapse.Panel header={t('header.createPost')} key="createPost">
          <CreatePostForm />
        </DropdownCollapse.Panel>
      </DropdownCollapse>
    </S.SettingsOverlayMenu>
  );
};
