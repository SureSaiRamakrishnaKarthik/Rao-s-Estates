"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { ColumnDef } from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Location } from '@/types/location';
import { deleteLocationAction } from './actions';
import { toast } from 'sonner';

export default function LocationsClient({ initialData }: { initialData: Location[] }) {
  const [locations, setLocations] = useState<Location[]>(initialData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteLocationAction(deleteId);
      setLocations((prev) => prev.filter((l) => l.id !== deleteId));
      toast.success('Location deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete location');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Location>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      sortable: true,
      cell: (loc) => (
        <div className="font-medium text-gray-900">{loc.name}</div>
      ),
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
      sortable: true,
      cell: (loc) => (
        <span className="text-gray-500 font-mono text-sm">{loc.slug}</span>
      ),
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      sortable: true,
      cell: (loc) => new Date(loc.created_at).toLocaleDateString(),
    },
    {
      header: 'Actions',
      cell: (loc) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/locations/${loc.slug}/edit`} className="text-blue-600 hover:text-blue-900 transition-colors p-1">
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setDeleteId(loc.id)} 
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
        title="Locations"
        description="Manage regions and cities where projects are available."
        action={
          <Link 
            href="/admin/locations/new" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Location
          </Link>
        }
      />

      {locations.length === 0 ? (
        <EmptyState 
          icon={Plus}
          title="No locations found"
          description="Get started by adding a new region or city."
          actionLabel="Add Location"
          actionHref="/admin/locations/new"
        />
      ) : (
        <DataTable
          data={locations}
          columns={columns}
          searchable
          searchPlaceholder="Search locations by name..."
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Location"
        description="Are you sure you want to delete this location? This action cannot be undone and may affect associated projects."
        confirmLabel="Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}
