import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { notificationController } from 'controllers/notificationController';
import { Status } from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status';
import { useMounted } from '@app/hooks/useMounted';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { StudentInTable, getStudentsInTable, deleteStudent, inviteStudent } from '@app/api/studentsTable.api';
import { useSearchParams } from 'react-router-dom';
import { getUsersList } from '@app/api/users.api';
import { UserInList } from '@app/api/user.types';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Modal, Button } from 'antd';
import StudentCreationForm from '@app/components/tables/StudentsTable/StudentCreateForm';
import { Key } from 'rc-table/lib/interface';

interface FloatButtonProps {
  onClick?: () => void;
}

export const FloatButton: React.FC<FloatButtonProps> = ({ onClick }) => {
  const { user } = useAppSelector((state) => state.user);

  const canShowButton = user && (user.statusInService === 'Creator' || user.statusInService === 'Admin');

  if (!canShowButton) {
    return null;
  }

  return (
    <Button
      type="primary"
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '150px',
        right: '60px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        zIndex: 1000,
      }}
    >
      +
    </Button>
  );
};

export const defineColorByRoleLocation = (value: string): string => {
  switch (value) {
    case 'Headman':
    case 'Deputy headman':
      return 'var(--error-color)';
    case 'Student':
      return 'var(--primary-color)';
    case 'In Ukraine':
      return 'var(--warning-color)';
    case 'Lives aboard':
      return 'var(--success-color)';
    default:
      return 'var(--primary-color)';
  }
};

export const StudentsTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableData, setTableData] = useState<{
    data: StudentInTable[];
    loading: boolean;
  }>({
    data: [],
    loading: false,
  });

  const { user } = useAppSelector((state) => state.user);
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  // Get pagination params from URL
  const itemsOnPage = searchParams.get('perPage') || '5';
  const currentPage = searchParams.get('page') || '1';

  const fetch = useCallback(() => {
    setTableData((prevState) => ({ ...prevState, loading: true }));

    getStudentsInTable()
      .then((students) => {
        if (isMounted.current) {
          setTableData({
            data: students,
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.error('Failed to load students:', error);
        notificationController.error({
          message: 'Loading data error!',
          description: error.message,
        });

        setTableData((prevState) => ({
          ...prevState,
          loading: false,
        }));
      });
  }, [isMounted, t]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleDeleteRow = async (id: number) => {
    try {
      await deleteStudent(id);
      setTableData((prevState) => ({
        ...prevState,
        data: prevState.data.filter((item) => item.id !== id),
      }));

      notificationController.success({
        message: 'Student deleted successfully!',
        description: 'Note: The student is deleted only on the table! You cannot delete him from the service!',
      });
    } catch (error) {
      notificationController.error({
        message: 'Failed to delete student! Please try again later!',
      });
    }
  };

  // Calculate visible items based on pagination
  const firstItem = +itemsOnPage * +currentPage - +itemsOnPage + 1;
  const lastItem = Math.min(+itemsOnPage * +currentPage, tableData.data.length);

  const visibleItems = useMemo(() => {
    return itemsOnPage === 'all' ? tableData.data : tableData.data.slice(firstItem - 1, lastItem);
  }, [tableData.data, itemsOnPage, firstItem, lastItem]);

  // Prepare filters for name column
  const nameFilters = useMemo(() => {
    if (!tableData.data.length) return [];

    return tableData.data
      .map((student) => ({
        text: student.last_name,
        value: student.last_name,
      }))
      .filter((value, index, self) => self.findIndex((t) => t.value === value.value) === index);
  }, [tableData.data]);

  const handleTableChange = (pagination: any) => {
    setSearchParams({
      page: pagination.current.toString(),
      perPage: pagination.pageSize.toString(),
    });
  };

  const [users, setUsers] = useState<UserInList[]>([]);

  useEffect(() => {
    getUsersList()
      .then((users: UserInList[]) => {
        setUsers(users);
      })
      .catch((error) => {
        console.error('Failed to load users:', error);
        notificationController.error({
          message: 'Loading data error!',
        });
      });
  }, [t]);

  // Функция для проверки существования пользователя
  const isUserExists = (email: string) => {
    return users.some((user) => user.email === email);
  };

  // Функция для отправки приглашения
  const handleInvite = async (student: StudentInTable) => {
    // Проверяем, существует ли пользователь
    if (isUserExists(student.first_name)) {
      notificationController.info({
        message: 'User already exists!',
      });
      return;
    }

    try {
      await inviteStudent(student.id);
      notificationController.success({
        message: 'Invitation sent!',
      });
    } catch (error) {
      notificationController.error({
        message: 'Invitation not sent! Please try again later!',
      });
    }
  };

  const columns: ColumnsType<StudentInTable> = [
    {
      title: t('common.lastName'),
      dataIndex: 'last_name',
      filterMode: 'tree',
      filterSearch: true,
      filters: nameFilters,
      onFilter: (value: boolean | Key, record: StudentInTable) => record.last_name === String(value),
    },
    {
      title: t('common.firstName'),
      dataIndex: 'first_name',
    },
    {
      title: 'Surname',
      dataIndex: 'surname',
    },
    {
      title: t('common.group'),
      dataIndex: 'full_group',
      sorter: (a: StudentInTable, b: StudentInTable) => a.full_group.localeCompare(b.full_group),
      showSorterTooltip: false,
    },
    {
      title: t('common.email'),
      dataIndex: 'email',
    },
    {
      title: t('common.role_location'),
      key: 'tags',
      render: (text, record: StudentInTable) => (
        <BaseRow gutter={[10, 10]}>
          <BaseCol>
            <Status color={defineColorByRoleLocation(record.role)} text={record.role.toUpperCase()} />
          </BaseCol>
          <BaseCol>
            <Status color={defineColorByRoleLocation(record.location)} text={record.location.toUpperCase()} />
          </BaseCol>
        </BaseRow>
      ),
    },
    ...(user && (user.statusInService === 'Creator' || user.statusInService === 'Admin')
      ? [
          {
            title: t('tables.actions'),
            key: 'actions',
            render: (_: any, record: StudentInTable) => (
              <BaseSpace>
                <BaseButton type="ghost" onClick={() => handleInvite(record)} disabled={isUserExists(record.email)}>
                  {isUserExists(record.email) ? t('tables.alreadyUser') : t('tables.invite')}
                </BaseButton>
                <BaseButton type="default" danger onClick={() => handleDeleteRow(record.id)}>
                  {t('tables.delete')}
                </BaseButton>
              </BaseSpace>
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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <BaseTable
        columns={columns}
        dataSource={visibleItems}
        pagination={paginationConfig}
        loading={tableData.loading}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
        bordered
      />
      <FloatButton onClick={showModal} />
      <Modal title="Create New Student" open={isModalVisible} onCancel={handleCancel} footer={null} destroyOnClose>
        <StudentCreationForm />
      </Modal>
    </>
  );
};
