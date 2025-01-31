import React, { useEffect, useState } from 'react';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import type { PaginationMeta, TableAction } from '~/components/Table/Table';
import DynamicTable from '~/components/Table/Table';

interface BookKeeping {
    id: string;
    note: string;
    debit: number;
    credit: number;
    saldo: number;
    method_payment: string;
    type: string;
    date: string;
}

const BookKeepingList: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BookKeeping[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>({} as PaginationMeta);

    // Definisi kolom
    const columns = [
        {
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Keterangan',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Debit',
            dataIndex: 'debit',
            key: 'debit',
            align: 'right' as const,
            render: (value: number) => value.toLocaleString('id-ID'),
        },
        {
            title: 'Credit',
            dataIndex: 'credit',
            key: 'credit',
            align: 'right' as const,
            render: (value: number) => value.toLocaleString('id-ID'),
        },
        {
            title: 'Saldo',
            dataIndex: 'saldo',
            key: 'saldo',
            align: 'right' as const,
            render: (value: number) => value.toLocaleString('id-ID'),
        },
        {
            title: 'Metode Pembayaran',
            dataIndex: 'method_payment',
            key: 'method_payment',
            render: (value: string) => value.toUpperCase(),
        },
    ];

    // Definisi actions
    const actions: TableAction<BookKeeping>[] = [
        {
            key: 'edit',
            icon: <EditOutlined />,
            type: 'primary',
            onClick: (record) => navigate(`/book-keeping/edit/${record.id}`),
            buttonProps: {
                className: 'bg-blue-500',
            },
        },
        {
            key: 'view',
            icon: <EyeOutlined />,
            type: 'default',
            onClick: (record) => navigate(`/book-keeping/detail/${record.id}`),
            buttonProps: {
                className: 'bg-green-500 text-white hover:bg-green-600',
            },
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            type: 'primary',
            danger: true,
            needConfirm: true,
            confirmTitle: 'Hapus Data',
            confirmMessage: 'Apakah anda yakin ingin menghapus data ini?',
            onClick: (record) => handleDelete(record.id),
        },
    ];

    const handleDelete = async (id: string) => {
        // try {
        //   // Implementasi delete
        //   await deleteBookKeeping(id);
        //   fetchData();
        // } catch (error) {
        //   console.error('Error deleting data:', error);
        // }
    };

    const fetchData = async (page = 1, pageSize = 25) => {
        // try {
        //   setLoading(true);
        //   // Implementasi fetch data
        //   const response = await fetchBookKeepings(page, pageSize);
        //   setData(response.data);
        //   setMeta(response.meta);
        // } catch (error) {
        //   console.error('Error fetching data:', error);
        // } finally {
        //   setLoading(false);
        // }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Daftar Pembukuan</h1>
            <DynamicTable<BookKeeping>
                columns={columns}
                data={data}
                meta={meta}
                loading={loading}
                actions={actions}
                onPageChange={fetchData}
                tableProps={{
                    size: 'small',
                    bordered: true,
                }}
            />
        </div>
    );
};

export default BookKeepingList;