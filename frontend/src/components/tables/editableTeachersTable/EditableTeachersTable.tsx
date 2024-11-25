import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import axiosInstance from '@app/api/axiosInstance';
import { Teacher } from '@app/api/teachers.api';
import { EditableCell } from '@app/components/tables/editableTeachersTable/EditableCell';
import { Subject } from '@app/api/teachers.api';
import { notificationController } from '@app/controllers/notificationController';

interface TableTeacher extends Teacher {
  key: number;
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

const initialPagination: Pagination = {
  current: 1,
  pageSize: 20,
};

export const EditableTeachersTable: React.FC = () => {
  const [form] = BaseForm.useForm();
  const [tableData, setTableData] = useState<{ data: TableTeacher[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const [editingKey, setEditingKey] = useState(0);
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const fetchTeachers = useCallback(async () => {
    setTableData((prevState) => ({ ...prevState, loading: true }));
    try {
      const response = await axiosInstance.get<Teacher[]>('platform/teachers/');
      if (isMounted.current) {
        const teachersWithKeys = response.data.map((teacher) => ({
          ...teacher,
          key: teacher.id,
        }));
        setTableData({
          data: teachersWithKeys,
          pagination: { ...initialPagination, total: teachersWithKeys.length },
          loading: false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      setTableData((prevState) => ({ ...prevState, loading: false }));
    }
  }, [isMounted]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleTableChange = (pagination: Pagination) => {
    setTableData((prevState) => ({ ...prevState, pagination }));
    cancel();
  };

  const isEditing = (record: TableTeacher) => record.key === editingKey;

  const edit = (record: TableTeacher) => {
    form.setFieldsValue({
      last_name: record.last_name,
      first_name: record.first_name,
      surname: record.surname,
      email: record.email,
      //
      // Not to change
      teacher_avatar: record.teacher_avatar,
      subjects: record.subjects,
      degree: record.degree,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const save = async (key: React.Key) => {
    try {
      const row = await form.validateFields();
      const newData = [...tableData.data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        try {
          await axiosInstance.patch(`platform/teachers/${key}/`, row);
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setTableData({ ...tableData, data: newData });
          setEditingKey(0);
        } catch (error) {
          console.error('Failed to update teacher:', error);
        }
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDeleteRow = async (teacherId: number) => {
    try {
      await axiosInstance.delete(`platform/teachers/${teacherId}/`);
      setTableData({
        ...tableData,
        data: tableData.data.filter((item) => item.key !== teacherId),
      });
      notificationController.success({
        message: 'Teacher deleted successfully!',
      });
    } catch (error) {
      notificationController.error({
        message: 'Failed to delete teacher! Please try again later!',
      });
    }
  };

  const columns = [
    {
      title: t('common.lastName'),
      dataIndex: 'last_name',
      width: '15%',
      editable: true,
      sorter: (a: TableTeacher, b: TableTeacher) => a.last_name.localeCompare(b.last_name),
    },
    {
      title: t('common.firstName'),
      dataIndex: 'first_name',
      width: '15%',
      editable: true,
      sorter: (a: TableTeacher, b: TableTeacher) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: 'Surname',
      dataIndex: 'surname',
      width: '15%',
      editable: true,
      sorter: (a: TableTeacher, b: TableTeacher) => a.surname.localeCompare(b.surname),
    },
    {
      title: t('common.email'),
      dataIndex: 'email',
      width: '20%',
      editable: true,
    },
    {
      title: 'Subjects',
      dataIndex: 'subjects',
      width: '20%',
      render: (subjects: Subject[]) => subjects.map((subject) => subject.name).join(', '),
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (_: any, record: TableTeacher) => {
        const editable = isEditing(record);
        return (
          <BaseSpace>
            {editable ? (
              <>
                <BaseButton type="primary" onClick={() => save(record.key)}>
                  {t('common.save')}
                </BaseButton>
                <BasePopconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
                  <BaseButton type="ghost">{t('common.cancel')}</BaseButton>
                </BasePopconfirm>
              </>
            ) : (
              <>
                <BaseButton type="ghost" disabled={editingKey !== 0} onClick={() => edit(record)}>
                  {t('common.edit')}
                </BaseButton>
                <BasePopconfirm
                  title={'All related homeworks and exams will be deleted!'}
                  onConfirm={() => handleDeleteRow(record.id)}
                >
                  <BaseButton type="default" danger>
                    {t('tables.delete')}
                  </BaseButton>
                </BasePopconfirm>
              </>
            )}
          </BaseSpace>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TableTeacher) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <BaseForm form={form} component={false}>
      <BaseTable
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={tableData.data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={tableData.pagination}
        onChange={handleTableChange}
        loading={tableData.loading}
        scroll={{ x: 800 }}
      />
    </BaseForm>
  );
};
