import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Key } from 'rc-table/lib/interface';
import { Subject, getSubjectsData } from '@app/api/subjects.api';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { Button, message, Modal, Form, Input, Select, Space } from 'antd';
import axiosInstance from '@app/api/axiosInstance';
import { notificationController } from '@app/controllers/notificationController';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useSearchParams } from 'react-router-dom';

const groupChoices = [
  { value: 'CS-31', label: 'CS-31' },
  { value: 'CS-32', label: 'CS-32' },
  { value: 'CS-33', label: 'CS-33' },
  { value: 'CS-34', label: 'CS-34' },
  { value: 'CS-41', label: 'CS-41' },
  { value: 'CS-42', label: 'CS-42' },
  { value: 'CS-43', label: 'CS-43' },
  { value: 'CS-44', label: 'CS-44' },
];

export const SubjectsTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableData, setTableData] = useState<{ data: Subject[]; loading: boolean }>({
    data: [],
    loading: false,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const itemsOnPage = searchParams.get('perPage') || '5';
  const currentPage = searchParams.get('page') || '1';

  const [form] = Form.useForm();
  const { user } = useAppSelector((state) => state.user);

  const fetchSubjects = useCallback(() => {
    setTableData((prev) => ({ ...prev, loading: true }));
    getSubjectsData()
      .then((res: any) => {
        if (isMounted.current) {
          setTableData({ data: res, loading: false });
        }
      })
      .catch(() => {
        setTableData((prev) => ({ ...prev, loading: false }));
        message.error('Failed to load data');
      });
  }, [isMounted]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleDelete = async () => {
    try {
      await Promise.all(selectedRowKeys.map((id) => axiosInstance.delete(`platform/subjects/${id}/`)));
      fetchSubjects();
      setSelectedRowKeys([]);
      notificationController.success({
        message: 'Subject(s) deleted successfully!',
      });
    } catch (error) {
      notificationController.error({ message: 'Failed to delete subject(s)! Please try again later!' });
    }
  };

  // Prepare filters for name column
  const groupFilters = useMemo(() => {
    if (!tableData.data.length) return [];

    return tableData.data
      .map((subject) => ({
        text: subject.group,
        value: subject.group,
      }))
      .filter((value, index, self) => self.findIndex((t) => t.value === value.value) === index);
  }, [tableData.data]);

  const handleTableChange = (pagination: any) => {
    setSearchParams({
      page: pagination.current.toString(),
      perPage: pagination.pageSize.toString(),
    });
  };

  const handleEdit = async (values: { name: string; group: string }) => {
    if (!editingSubject) return;

    try {
      await axiosInstance.patch(`platform/subjects/${editingSubject.id}/`, {
        name: values.name,
        group: values.group,
      });
      fetchSubjects();
      setEditingSubject(null);
      notificationController.success({ message: 'Subject updated successfully!' });
    } catch (error) {
      notificationController.error({ message: 'Failed to update subject! Please try again later!' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columns = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Subject, b: Subject) => a.name.localeCompare(b.name),
    },
    {
      title: t('common.group'),
      dataIndex: 'group',
      key: 'group',
      filters: groupFilters,
      onFilter: (value: string | number | boolean, record: Subject) => record.group === value.toString(),
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => formatDate(text),
    },
    ...(user && (user.statusInService === 'Creator' || user.statusInService === 'Admin')
      ? [
          {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: Subject) => (
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    setEditingSubject(record);
                    form.setFieldsValue({ name: record.name, group: record.group });
                  }}
                >
                  Edit
                </Button>
              </Space>
            ),
          },
        ]
      : []),
  ];

  const paginationConfig = {
    current: +currentPage,
    pageSize: itemsOnPage === 'all' ? tableData.data.length : +itemsOnPage,
    total: tableData.data.length,
    pageSizeOptions: ['5', '15', '45', 'all'],
    showSizeChanger: true,
  };

  return (
    <>
      {user &&
        (user.statusInService === 'Creator' || user.statusInService === 'Admin') &&
        selectedRowKeys.length > 0 && (
          <Button type="primary" danger onClick={handleDelete} style={{ marginBottom: 16 }}>
            Delete Selected
          </Button>
        )}
      <BaseTable
        columns={columns}
        dataSource={tableData.data.map((item) => ({
          ...item,
          key: item.id,
        }))}
        pagination={paginationConfig}
        rowSelection={
          user && (user.statusInService === 'Creator' || user.statusInService === 'Admin') ? rowSelection : undefined
        }
        loading={tableData.loading}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
      />

      {user && (user.statusInService === 'Creator' || user.statusInService === 'Admin') && (
        <Modal title="Edit Subject" open={!!editingSubject} onCancel={() => setEditingSubject(null)} footer={null}>
          <Form form={form} onFinish={handleEdit}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="group" label="Group" rules={[{ required: true, message: 'Please select group' }]}>
              <Select options={groupChoices} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};
