import React from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// Generic interface untuk pagination meta yang umum digunakan
export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

// Interface untuk action buttons
export interface TableAction<T> {
    key: string;
    icon?: React.ReactNode;
    label?: string;
    onClick: (record: T) => void;
    type?: 'primary' | 'default' | 'link' | 'text' | 'dashed';
    danger?: boolean;
    needConfirm?: boolean;
    confirmTitle?: string;
    confirmMessage?: string;
    buttonProps?: Record<string, any>;
}

// Props untuk komponen tabel
export interface ReusableTableProps<T> {
    columns: ColumnsType<T>;
    data: T[];
    meta: PaginationMeta;
    loading?: boolean;
    rowKey?: string;
    actions?: TableAction<T>[];
    actionColumn?: {
        title?: string;
        fixed?: boolean | 'left' | 'right';
        width?: number;
    };
    tableProps?: Record<string, any>;
    onPageChange?: (page: number, pageSize: number) => void;
}

const DynamicTable = <T extends Record<string, any>>({
    columns,
    data,
    meta,
    loading = false,
    rowKey = 'id',
    actions,
    actionColumn = {
        title: 'Aksi',
        fixed: 'right',
        width: 150
    },
    tableProps = {},
    onPageChange
}: ReusableTableProps<T>) => {
    // Membuat kolom aksi jika actions disediakan
    const getActionColumn = (): ColumnsType<T>[0] | null => {
        if (!actions?.length) return null;

        return {
            title: actionColumn.title,
            key: 'action',
            fixed: actionColumn.fixed,
            width: actionColumn.width,
            render: (_, record) => (
                <div className="flex space-x-2">
                    {actions.map((action) => {
                        const ActionButton = () => (
                            <Button
                                key={action.key}
                                type={action.type || 'default'}
                                size="small"
                                icon={action.icon}
                                danger={action.danger}
                                onClick={() => action.onClick(record)}
                                {...action.buttonProps}
                            >
                                {action.label}
                            </Button>
                        );

                        if (action.needConfirm) {
                            return (
                                <Popconfirm
                                    key={action.key}
                                    title={action.confirmTitle || 'Konfirmasi'}
                                    description={action.confirmMessage || 'Apakah anda yakin?'}
                                    onConfirm={() => action.onClick(record)}
                                    okText="Ya"
                                    cancelText="Tidak"
                                >
                                    <ActionButton />
                                </Popconfirm>
                            );
                        }

                        return <ActionButton key={action.key} />;
                    })}
                </div>
            ),
        };
    };

    const finalColumns = [...columns];
    const actionCol = getActionColumn();
    if (actionCol) {
        finalColumns.push(actionCol);
    }

    return (
        <Table<T>
            columns={finalColumns}
            dataSource={data}
            rowKey={rowKey}
            loading={loading}
            pagination={{
                current: meta.current_page,
                pageSize: meta.per_page,
                total: meta.total,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} data`,
            }}
            onChange={(pagination) => {
                onPageChange?.(pagination.current || 1, pagination.pageSize || meta.per_page);
            }}
            scroll={{ x: 'max-content' }}
            {...tableProps}
        />
    );
};

export default DynamicTable;