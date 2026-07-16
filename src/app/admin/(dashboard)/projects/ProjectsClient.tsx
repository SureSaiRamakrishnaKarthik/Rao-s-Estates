"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import DataTable, { ColumnDef } from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Project } from '@/types/project';
import { deleteProjectAction } from './actions';
import { toast } from 'sonner';

export default function ProjectsClient({ initialData }: { initialData: any[] }) {
  const [projects, setProjects] = useState<any[]>(initialData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteProjectAction(deleteId);
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success('Project deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete project');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: 'Title',
      accessorKey: 'title',
      sortable: true,
      cell: (proj) => (
        <div>
          <div className="font-medium text-gray-900">{proj.title}</div>
          <div className="text-xs text-gray-500">{proj.developers?.name || 'No developer'}</div>
        </div>
      ),
    },
    {
      header: 'Location',
      accessorKey: 'locations.name',
      sortable: false,
      cell: (proj) => (
        <span className="text-gray-600">{proj.locations?.name || '-'}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'publish_status',
      sortable: true,
      cell: (proj) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
          proj.publish_status === 'published' ? 'bg-green-100 text-green-800' : 
          proj.publish_status === 'archived' ? 'bg-gray-100 text-gray-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {proj.publish_status}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (proj) => (
        <div className="flex justify-end gap-3">
          <Link href={`/admin/projects/${proj.slug}/edit`} className="text-blue-600 hover:text-blue-900 transition-colors p-1">
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setDeleteId(proj.id)} 
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
        title="Projects"
        description="Manage your real estate projects and their visibility."
        action={
          <Link 
            href="/admin/projects/new" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Link>
        }
      />

      {projects.length === 0 ? (
        <EmptyState 
          icon={Plus}
          title="No projects found"
          description="Get started by adding a new real estate project."
          actionLabel="Add Project"
          actionHref="/admin/projects/new"
        />
      ) : (
        <DataTable
          data={projects}
          columns={columns}
          searchable
          searchPlaceholder="Search projects by title..."
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This will permanently remove all associated media and data."
        confirmLabel="Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}
