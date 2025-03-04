import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Homework, getHomeworks } from '@app/api/homeworks.api';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { Button, message, DatePicker, Card } from 'antd';
import { Key } from 'rc-table/lib/interface';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '@app/api/axiosInstance';
import { notificationController } from '@app/controllers/notificationController';
import moment from 'moment';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { RangeValue } from 'rc-picker/lib/interface';

export const HomeworksTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.user);
  const [tableData, setTableData] = useState<{ data: Homework[]; loading: boolean }>({
    data: [],
    loading: false,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const { RangePicker } = DatePicker;

  // State for deadline range filtering
  const [deadlineRange, setDeadlineRange] = useState<[moment.Moment | null, moment.Moment | null]>([null, null]);

  // Handle deadline range change
  const handleDeadlineFilter = (dates: RangeValue<moment.Moment>) => {
    if (!dates || !dates[0] || !dates[1]) {
      setDeadlineRange([null, null]);
      return;
    }
    setDeadlineRange([dates[0], dates[1]]);
  };

  // Filter data based on deadline range
  const filteredData = tableData.data.filter((item) => {
    if (!deadlineRange || !deadlineRange[0] || !deadlineRange[1]) {
      return true;
    }
    const itemDate = moment(item.created_at);
    return itemDate.isBetween(deadlineRange[0], deadlineRange[1], 'day', '[]');
  });

  const itemsOnPage = searchParams.get('perPage') || '5';
  const currentPage = searchParams.get('page') || '1';

  const fetchHomeworks = useCallback(() => {
    setTableData((prev) => ({ ...prev, loading: true }));
    getHomeworks()
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
    fetchHomeworks();
  }, [fetchHomeworks]);

  const handleDelete = async () => {
    try {
      await Promise.all(selectedRowKeys.map((id) => axiosInstance.delete(`platform/homeworks/${id}/`)));
      fetchHomeworks();
      setSelectedRowKeys([]);
      notificationController.success({
        message: 'Homework(s) deleted successfully!',
      });
    } catch (error) {
      notificationController.error({ message: 'Failed to delete homework(s)! Please try again later!' });
    }
  };

  const formatTeacherName = (lastName: string, firstName: string, middleName: string) =>
    `${lastName} ${firstName.charAt(0)}. ${middleName.charAt(0)}.`;

  const truncateTitle = (title: string) => (title.length > 30 ? `${title.substring(0, 30)}...` : title);

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

  const handleTableChange = (pagination: any) => {
    setSearchParams({
      page: pagination.current.toString(),
      perPage: pagination.pageSize.toString(),
    });
  };

  // Memoized filter options
  const groupFilters = useMemo(() => {
    return tableData.data
      .map((item) => ({ text: item.for_group, value: item.for_group }))
      .filter((value, index, self) => self.findIndex((t) => t.value === value.value) === index);
  }, [tableData.data]);

  const subjectFilters = useMemo(() => {
    return tableData.data
      .map((item) => ({ text: item.subject, value: item.subject }))
      .filter((value, index, self) => self.findIndex((t) => t.value === value.value) === index);
  }, [tableData.data]);

  const teacherFilters = useMemo(() => {
    return tableData.data
      .map((item) => ({
        text: formatTeacherName(item.teacher_last_name, item.teacher_first_name, item.teacher_surname),
        value: formatTeacherName(item.teacher_last_name, item.teacher_first_name, item.teacher_surname),
      }))
      .filter((value, index, self) => self.findIndex((t) => t.value === value.value) === index);
  }, [tableData.data]);

  // Expandable row render function
  const expandedRowRender = (record: Homework) => {
    const columns = [
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
    ];

    const data = [
      {
        key: record.id,
        description: record.description || 'No description available',
      },
    ];

    return <BaseTable columns={columns} dataSource={data} pagination={false} showHeader={false} />;
  };

  const columns = [
    {
      title: t('common.title'),
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => truncateTitle(text),
    },
    {
      title: t('common.subject'),
      dataIndex: 'subject',
      key: 'subject',
      filters: subjectFilters,
      onFilter: (value: string | number | boolean, record: Homework) => record.subject === value,
    },
    {
      title: t('common.teacher'),
      dataIndex: 'teacher',
      key: 'teacher',
      filters: teacherFilters,
      onFilter: (value: string | number | boolean, record: Homework) =>
        formatTeacherName(record.teacher_last_name, record.teacher_first_name, record.teacher_surname) === value,
      render: (_: any, record: Homework) =>
        formatTeacherName(record.teacher_last_name, record.teacher_first_name, record.teacher_surname),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (text: string) => formatDate(text),
      sorter: (a: Homework, b: Homework) => a.deadline.localeCompare(b.deadline),
    },
    {
      title: 'Group',
      dataIndex: 'for_group',
      key: 'for_group',
      filters: groupFilters,
      onFilter: (value: string | number | boolean, record: Homework) => record.for_group === value,
    },
  ];

  const paginationConfig = {
    current: +currentPage,
    pageSize: itemsOnPage === 'all' ? tableData.data.length : +itemsOnPage,
    total: tableData.data.length,
    pageSizeOptions: ['5', '15', '45', 'all'],
    showSizeChanger: true,
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <>
      {selectedRowKeys.length > 0 && (
        <Button type="primary" danger onClick={handleDelete} style={{ marginBottom: 16 }}>
          Delete Selected
        </Button>
      )}
      <RangePicker onChange={handleDeadlineFilter} style={{ marginBottom: '16px', left: '10px' }} />
      <BaseTable
        columns={columns}
        dataSource={filteredData.map((item) => ({
          ...item,
          key: item.id,
        }))}
        pagination={paginationConfig}
        rowSelection={
          user && (user.statusInService === 'Creator' || user.statusInService === 'Admin') ? rowSelection : undefined
        }
        onChange={handleTableChange}
        loading={tableData.loading}
        scroll={{ x: 800 }}
        expandable={{
          expandedRowRender,
          rowExpandable: () => true,
          expandRowByClick: true,
        }}
      />
    </>
  );
};
