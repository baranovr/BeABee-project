import React from 'react';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Teacher } from '@app/api/teachers.api';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'text';
  record: Teacher & { key: number };
  index: number;
  children: React.ReactNode;
  requiredField?: boolean;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <BaseForm.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please input ${title}!`,
            },
          ]}
        >
          <BaseInput />
        </BaseForm.Item>
      ) : (
        children
      )}
    </td>
  );
};
