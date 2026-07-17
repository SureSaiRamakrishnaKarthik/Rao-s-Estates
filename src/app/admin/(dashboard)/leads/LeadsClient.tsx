"use client";

import React, { useState } from 'react';
import { deleteLeadAction, updateLeadStatusAction } from './actions';
import { toast } from 'sonner';
import { Trash2, Edit } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: string;
  created_at: string;
  projects?: { title: string };
}

export default function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteLeadAction(deleteId);
      setLeads((prev) => prev.filter((l) => l.id !== deleteId));
      toast.success('Lead deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete lead');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!editLead) return;
    setIsSavingStatus(true);
    try {
      await updateLeadStatusAction(editLead.id, status);
      setLeads((prev) => prev.map((l) => l.id === editLead.id ? { ...l, status } : l));
      toast.success('Lead status updated');
      setEditLead(null);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsSavingStatus(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4">Source / Project</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {!leads || leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-500">
                    No leads found. When users submit inquiries, they will appear here.
                  </td>
                </tr>
              ) : (
                leads.map((lead: Lead) => (
                  <tr key={lead.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 text-stone-500 whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-6 py-4 font-medium text-stone-900">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <a href={`mailto:${lead.email}`} className="text-stone-600 hover:text-stone-900">{lead.email}</a>
                        <a href={`tel:${lead.phone}`} className="text-stone-600 hover:text-stone-900">{lead.phone}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      <div className="flex flex-col gap-1">
                        <span className="capitalize px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-xs w-fit">
                          {lead.source?.replace('_', ' ') || 'Website'}
                        </span>
                        {lead.projects && (
                          <span className="text-xs truncate max-w-[200px]" title={lead.projects.title}>
                            {lead.projects.title}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600 max-w-xs">
                      <p className="line-clamp-2" title={lead.message}>
                        {lead.message || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'contacted' ? 'bg-amber-100 text-amber-800' :
                        lead.status === 'converted' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-stone-100 text-stone-800'
                      }`}>
                        {lead.status || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => setEditLead(lead)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteId(lead.id)} 
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        isLoading={isDeleting}
      />

      {editLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-stone-900 mb-4">Update Lead Status</h3>
            <p className="text-sm text-stone-600 mb-6">Change the status for <strong>{editLead.name}</strong>.</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleUpdateStatus('new')} 
                disabled={isSavingStatus}
                className="w-full text-left px-4 py-3 border rounded hover:bg-stone-50 flex justify-between items-center"
              >
                <span>New</span>
                {editLead.status === 'new' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
              </button>
              <button 
                onClick={() => handleUpdateStatus('contacted')} 
                disabled={isSavingStatus}
                className="w-full text-left px-4 py-3 border rounded hover:bg-stone-50 flex justify-between items-center"
              >
                <span>Contacted</span>
                {editLead.status === 'contacted' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
              </button>
              <button 
                onClick={() => handleUpdateStatus('converted')} 
                disabled={isSavingStatus}
                className="w-full text-left px-4 py-3 border rounded hover:bg-stone-50 flex justify-between items-center"
              >
                <span>Converted</span>
                {editLead.status === 'converted' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
              </button>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setEditLead(null)}
                className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
                disabled={isSavingStatus}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
