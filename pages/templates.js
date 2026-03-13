// pages/templates.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Plus, Save, X, Edit, Trash2, LogOut } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import HTMLEditor from "@/components/HtmlEditor";
import PreviewScreen from "@/components/PreviewScreen";
import { ChevronsDown, ChevronsUp } from 'lucide-react';

// Formats/beautifies raw HTML string with proper indentation
const formatHTML = (html) => {
    if (!html) return "";
    let formatted = "";
    let indent = 0;
    const tab = "  ";

    // Normalize: collapse whitespace between tags
    const raw = html.replace(/>\s+</g, "><").trim();

    // Split into tokens: tags and text nodes
    const tokens = raw.match(/(<[^>]+>|[^<]+)/g);
    if (!tokens) return html;

    tokens.forEach((token) => {
        // Closing tag
        if (/^<\//.test(token)) {
            indent = Math.max(indent - 1, 0);
            formatted += tab.repeat(indent) + token + "\n";
        }
        // Self-closing or void tag
        else if (/\/>$/.test(token) || /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)(\s|>)/i.test(token)) {
            formatted += tab.repeat(indent) + token + "\n";
        }
        // Opening tag
        else if (/^<[a-zA-Z]/.test(token)) {
            formatted += tab.repeat(indent) + token + "\n";
            indent++;
        }
        // Text content
        else {
            const text = token.trim();
            if (text) {
                formatted += tab.repeat(indent) + text + "\n";
            }
        }
    });

    return formatted.trimEnd();
};

const TemplatesPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const ADMIN_EMAILS = ["mailer@htbchennai.in", "test@gmail.com"];

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

    // Fetch all templates
    const fetchTemplates = async () => {
        try {
            const response = await fetch('/api/templates');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

    // Navigation
    const handleBack = () => router.push('/');

    // Redirect if no session
    useEffect(() => {
        if (typeof window !== "undefined" && !session && router.isReady) {
            router.push("/signIn");
        }
    }, [session, router]);

    if (!session) return null;


    // Reset form data
    const resetForm = () => {
        setFormData({ name: '', subject: '', displayText: '', htmlContent: '' });
        setHtmlContent("");
    };

    // Start creating new template
    const handleStartCreate = () => {
        resetForm();
        setEditingId('new');
    };

    const handleCancel = () => {
        setEditingId(null);
        resetForm();
    };

    // Start editing existing template
    const handleStartEdit = (template) => {
        setFormData({
            name: template.name,
            subject: template.subject,
            displayText: template.displayText,
            htmlContent: formatHTML(template.htmlContent || "")
        });
        setHtmlContent(formatHTML(template.htmlContent || ""));
        setEditingId(template._id);
    };

    // Input changes
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Save template (create or update)
    const handleSave = async () => {
        try {
            const url = editingId === 'new' ? '/api/templates' : `/api/templates/${editingId}`;
            const method = editingId === 'new' ? 'POST' : 'PUT';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            fetchTemplates();
            setEditingId(null);
            resetForm();
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Failed to save template. Please try again.');
        }
    };

    // Delete template
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this template?')) return;
        try {
            const response = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            setTemplates(templates.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('Failed to delete template. Please try again.');
            fetchTemplates();
        }
    };

    return (
        <div className="min-h-screen text-white bg-black overflow-x-hidden">

            {/* Mobile-optimized container with proper padding */}
            <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 font-sans max-w-7xl mx-auto">

                {/* Header - Mobile responsive */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all touch-manipulation"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <img src="/logo.png" alt="HTB Logo" className="h-8 object-contain hidden sm:block" />
                        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white/90">Email Templates</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {editingId !== 'new' && (
                            <button
                                onClick={handleStartCreate}
                                className="flex items-center gap-2 bg-white hover:bg-[#e5e5e5] text-black px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base mr-2"
                            >
                                <Plus size={18} className="flex-shrink-0" />
                                <span className="hidden xs:inline">New Template</span>
                                <span className="xs:hidden">New</span>
                            </button>
                        )}

                        {session && ADMIN_EMAILS.includes(session.user.email) && (
                            <button
                                onClick={() => router.push("/signUp")}
                                className="hidden sm:flex items-center gap-2 text-[#aaa] hover:text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                            >
                                Add User
                            </button>
                        )}

                        <div className="hidden sm:block w-[1px] h-4 bg-white/10 mx-1" />

                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 bg-[#222] border border-[#333] hover:bg-[#333] hover:border-[#444] text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                            <LogOut size={16} className="hidden xs:block" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Create/Edit Template - Mobile optimized */}
                {editingId && (
                    <div className="glass-panel p-6 sm:p-8 mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-white/90 mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-white rounded-full inline-block"></span>
                            {editingId === 'new' ? 'Build New Template' : 'Configure Template'}
                        </h2>

                        {/* Form fields - Stacked on mobile */}
                        <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-1">
                                <label className="block mb-2 text-gray-400 font-medium text-sm">
                                    Template Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors text-sm sm:text-base"
                                    placeholder="e.g. Welcome Email"
                                    required
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <label className="block mb-2 text-gray-400 font-medium text-sm">
                                    Subject Line
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => handleChange('subject', e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors text-sm sm:text-base"
                                    placeholder="Enter email subject"
                                    required
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block mb-2 text-gray-400 font-medium text-sm">
                                    Sender Display Text
                                </label>
                                <input
                                    type="text"
                                    value={formData.displayText}
                                    onChange={(e) => handleChange('displayText', e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors text-sm sm:text-base"
                                    placeholder="e.g. John Doe - Security Team"
                                    required
                                />

                                <button
                                    onClick={() => setShowHtmlEditor(!showHtmlEditor)}
                                    className="mt-4 flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors touch-manipulation font-medium bg-[#111] px-4 py-2 rounded-lg border border-[#222] w-fit"
                                >
                                    {showHtmlEditor ? (
                                        <>
                                            <ChevronsUp size={16} /> Hide Workspace
                                        </>
                                    ) : (
                                        <>
                                            <ChevronsDown size={16} /> Expand Workspace
                                        </>
                                    )}
                                </button>

                                {/* HTML Editor - Mobile optimized layout */}
                                {showHtmlEditor && (
                                    <div className="mt-6 space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                                        <div className="bg-black/40 p-4 sm:p-6 rounded-2xl border border-[#9FEF00]/20">
                                            <h3 className="text-base sm:text-lg font-medium text-white/90 mb-4 flex items-center gap-2">
                                                <span className="w-1 h-4 bg-white rounded-full inline-block"></span>
                                                Markup Source
                                            </h3>
                                            <div className="min-h-[300px] sm:min-h-[400px] border border-[#222] rounded-[8px] overflow-hidden">
                                                <HTMLEditor
                                                    value={formData.htmlContent}
                                                    onChange={(value) => {
                                                        setFormData(prev => ({ ...prev, htmlContent: value }));
                                                        setHtmlContent(value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 sm:p-6 rounded-[8px] min-h-[300px] sm:min-h-[400px] border border-[#222]">
                                            <PreviewScreen htmlContent={htmlContent} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action buttons - Mobile optimized */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 border-t border-[#9FEF00]/20 pt-6">
                            <button
                                onClick={handleCancel}
                                className="flex items-center justify-center gap-2 border border-white/20 text-white/70 hover:bg-white/5 hover:text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm sm:text-base touch-manipulation"
                            >
                                <X size={18} /> Discard
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.name.trim() || !formData.subject.trim() || !formData.displayText.trim()}
                                className="flex items-center justify-center gap-2 bg-white hover:bg-[#e5e5e5] text-black disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg font-medium transition-colors text-sm sm:text-base touch-manipulation"
                            >
                                <Save size={18} /> Compile Template
                            </button>
                        </div>
                    </div>
                )}

                {/* Templates Grid - Mobile responsive */}
                {!editingId && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {templates.map(template => (
                            <div
                                key={template._id}
                                className="glass-panel glass-panel-hover p-6"
                            >
                                <div className="mb-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-white font-medium text-lg leading-tight pr-2">
                                            {template.name}
                                        </h3>
                                        <span className="bg-[#9FEF00]/10 border border-[#9FEF00]/30 text-[#9FEF00] font-mono text-xs px-3 py-1 rounded-full whitespace-nowrap">
                                            TEMPLATE
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4">
                                        <strong className="text-gray-300">SUB:</strong>
                                        <span className="ml-2 break-words text-gray-400">
                                            {template.subject || 'No subject'}
                                        </span>
                                    </p>
                                    <div className="border-t border-[#9FEF00]/10 pt-4 mt-2 flex justify-between items-center text-gray-500 text-xs font-mono">
                                        <span>INIT: {new Date(template.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center justify-end gap-3 mt-auto">
                                    <button
                                        onClick={() => handleStartEdit(template)}
                                        className="p-2 border border-[#333] text-gray-400 hover:text-white hover:border-[#555] hover:bg-[#222] rounded-lg transition-all touch-manipulation"
                                        aria-label={`Edit ${template.name}`}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(template._id);
                                        }}
                                        className="p-2 border border-[#333] text-gray-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 rounded-lg transition-all touch-manipulation"
                                        aria-label={`Delete ${template.name}`}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State - Mobile optimized */}
                {!editingId && templates.length === 0 && (
                    <div className="text-center py-20 glass-panel">
                        <div className="w-20 h-20 bg-[#9FEF00]/10 border border-[#9FEF00]/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(159,239,0,0.15)]">
                            <Plus size={40} className="text-[#9FEF00]" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-white">Registry Empty</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            No active templates are defined in the database. Compile your first payload configuration to begin.
                        </p>
                        <button
                            onClick={handleStartCreate}
                            className="flex items-center gap-2 bg-white hover:bg-[#e5e5e5] text-black px-6 py-2.5 rounded-lg font-medium transition-colors mx-auto"
                        >
                            <Plus size={18} /> Initialize Template
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplatesPage;