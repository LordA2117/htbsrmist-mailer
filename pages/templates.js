import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Plus, Save, X, Edit, Trash2 } from 'lucide-react';
import HTMLEditor from "@/components/HtmlEditor";
import PreviewScreen from "@/components/PreviewScreen";
import { ChevronsDown, ChevronsUp } from 'lucide-react'

const TemplatesPage = () => {
    const router = useRouter();
    const [templates, setTemplates] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showHtmlEditor, setShowHtmlEditor] = useState(false);
    const [htmlContent, setHtmlContent] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        displayText: '',
        htmlContent: ''
    });

    const fetchTemplates = async () => {
        try {
            const response = await fetch('/api/templates');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTemplates(data);
        } catch (error) {
            console.error('Error fetching templates:', error);
            alert('Failed to load templates. Please refresh the page.');
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleBack = () => {
        router.push('/');
    };

    const resetForm = () => {
    setFormData({
        name: '',
        subject: '',
        displayText: '',
        htmlContent: ''
    });
    setHtmlContent("");
};

    const handleStartCreate = () => {
        resetForm();
        setEditingId('new');
    };

    const handleCancel = () => {
        setEditingId(null);
        resetForm();
    };

    const handleStartEdit = (template) => {
    setFormData({
        name: template.name,
        subject: template.subject,
        displayText: template.displayText,
        htmlContent: template.htmlContent || ""  // Add this
    });
    setHtmlContent(template.htmlContent || "");  // Also set the htmlContent state
    setEditingId(template._id);
};

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            const url = editingId === 'new'
                ? '/api/templates'
                : `/api/templates/${editingId}`;

            const method = editingId === 'new' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchTemplates();
            setEditingId(null);
            resetForm();
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Failed to save template. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            try {
                const response = await fetch(`/api/templates/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setTemplates(templates.filter(template => template._id !== id));
            } catch (error) {
                console.error('Error deleting template:', error);
                alert('Failed to delete template. Please try again.');
                fetchTemplates();
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center mb-8 bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <button 
                        onClick={handleBack}
                        className="mr-4 p-2 text-green-600 hover:bg-green-600/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="flex-1 text-2xl font-bold text-green-600">
                        Email Templates
                    </h1>
                    {editingId !== 'new' && (
                        <button
                            onClick={handleStartCreate}
                            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                            <Plus size={16} />
                            New Template
                        </button>
                    )}
                </div>

                {/* Create/Edit Template Section */}
                {editingId && (
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-green-600 mb-6">
                            {editingId === 'new' ? 'Create New Template' : 'Edit Template'}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Template Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    placeholder="Enter template name"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => handleChange('subject', e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    placeholder="Enter email subject"
                                    required
                                />
                            </div>
                            
                            <div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-300 mb-2">
    Display Text
  </label>
  <input
    type="text"
    value={formData.displayText}
    onChange={(e) => handleChange('displayText', e.target.value)}
    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-600 focus:border-transparent"
    placeholder="Enter display text"
    required
  />

  {/* Toggle button */}
  <div className="mt-4">
    <button
      onClick={() => setShowHtmlEditor(!showHtmlEditor)}
      className="text-sm flex items-center gap-2 text-green-400 hover:underline"
    >
      {showHtmlEditor ? <><ChevronsUp size={16} /> Hide HTML Editor</> : <><ChevronsDown size={16} /> Show HTML Editor</>}
    </button>
  </div>

  {/* Collapsible content */}
  {showHtmlEditor && (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-1">
  <div className="bg-[#1b1f2a] rounded-xl p-4 shadow-md border border-gray-700">
    <h2 className="text-lg font-semibold text-white text-center mb-2">Mail Editor</h2>
    <HTMLEditor 
      value={formData.htmlContent} 
      onChange={(value) => {
        setFormData(prev => ({ ...prev, htmlContent: value }));
        setHtmlContent(value);
      }} 
    />
  </div>
</div>


      <div className="col-span-1">
        <PreviewScreen htmlContent={htmlContent} />
      </div>
    </div>
  )}
</div>
                        </div>

                        <div className="flex gap-4 justify-end mt-6">
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 border border-red-500 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.name.trim() || !formData.subject.trim() || !formData.displayText.trim()}
                                className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                <Save size={16} />
                                Save Template
                            </button>
                        </div>
                    </div>
                )}

                {/* Templates Grid */}
                {!editingId && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {templates.map((template) => (
                            <div key={template._id} className="bg-gray-900 border border-gray-700 rounded-lg hover:border-green-600 transition-colors">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-green-600 font-semibold flex-1">
                                            {template.name}
                                        </h3>
                                        <span className="bg-green-600/10 text-green-600 text-xs px-2 py-1 rounded-full">
                                            Template
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-400 text-sm mb-1">
                                        <strong>Subject:</strong> {template.subject || 'No subject'}
                                    </p>
                                    
                                    <div className="border-t border-gray-700 pt-2">
                                        <p className="text-gray-500 text-xs">
                                            Created: {new Date(template.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 pt-0">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleStartEdit(template)}
                                            className="p-1.5 text-green-600 hover:bg-green-600/10 rounded transition-colors"
                                            title="Edit Template"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(template._id);
                                            }}
                                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                            title="Delete Template"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {templates.length === 0 && !editingId && (
                    <div className="text-center py-16 bg-gray-900 border border-gray-700 rounded-lg">
                        <Plus size={48} className="text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No templates yet</h3>
                        <p className="text-gray-400 mb-6">Create your first email template to get started</p>
                        <button
                            onClick={handleStartCreate}
                            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors mx-auto"
                        >
                            <Plus size={16} />
                            Create Template
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplatesPage;
