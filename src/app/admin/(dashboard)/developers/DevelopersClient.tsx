"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { ColumnDef } from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Developer } from '@/types/developer';
import { deleteDeveloperAction } from './actions';
import { toast } from 'sonner';

export default function DevelopersClient({ initialData }: { initialData: Developer[] }) {
  const [developers, setDevelopers] = useState<Developer[]>(initialData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDeveloperAction(deleteId);
      setDevelopers((prev) => prev.filter((d) => d.id !== deleteId));
      toast.success('Developer deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete developer');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Developer>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      sortable: true,
      cell: (dev) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold border border-gray-200">
            {dev.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{dev.name}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
      sortable: true,
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      sortable: true,
      cell: (dev) => new Date(dev.created_at).toLocaleDateString(),
    },
    {
      header: 'Actions',
      cell: (dev) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/developers/${dev.slug}/edit`} className="text-blue-600 hover:text-blue-900 transition-colors p-1">
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setDeleteId(dev.id)} 
            className="text-red-600 hover:text-red-900 transition-colors p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }
  ];

  return (
    <div>
      <PageHeader
        title="Developers"
        description="Manage the real estate developers operating your projects."
        action={
          <Link 
            href="/admin/developers/new" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Developer
          </Link>
        }
      />

      {developers.length === 0 ? (
        <EmptyState 
          icon={Plus}
          title="No developers found"
          description="Get started by creating a new developer profile."
          actionLabel="Add Developer"
          actionHref="/admin/developers/new"
        />
      ) : (
        <DataTable
          data={developers}
          columns={columns}
          searchable
          searchPlaceholder="Search developers by name..."
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Developer"
        description="Are you sure you want to delete this developer? This action cannot be undone and may affect associated projects."
        confirmLabel="Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}
