import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmojiPicker } from '../../components/ui/EmojiPicker';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import type { ChildProfile } from '../../types';

export const ChildrenManager: React.FC = () => {
    const users = useStore(state => state.users);
    const addChild = useStore(state => state.addChild);
    const updateChild = useStore(state => state.updateChild);
    const deleteChild = useStore(state => state.deleteChild);

    const [isAddingChild, setIsAddingChild] = useState(false);
    const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        avatar: '👦',
        iban: '',
        birthDate: ''
    });

    const children = users.filter(u => u.role === 'child') as ChildProfile[];

    const handleAddChild = () => {
        if (formData.name.trim().length < 2) {
            alert('El nombre debe tener al menos 2 caracteres');
            return;
        }
        addChild(
            formData.name.trim(),
            formData.avatar,
            formData.iban.replace(/\s/g, ''),
            formData.birthDate
        );
        setFormData({ name: '', avatar: '👦', iban: '', birthDate: '' });
        setIsAddingChild(false);
    };

    const handleEditChild = () => {
        if (!editingChild) return;
        if (formData.name.trim().length < 2) {
            alert('El nombre debe tener al menos 2 caracteres');
            return;
        }
        updateChild(editingChild.id, {
            name: formData.name.trim(),
            avatar: formData.avatar,
            iban: formData.iban.replace(/\s/g, ''),
            birthDate: formData.birthDate
        });
        setFormData({ name: '', avatar: '👦', iban: '', birthDate: '' });
        setEditingChild(null);
    };

    const handleDeleteChild = () => {
        if (!deleteConfirm) return;
        deleteChild(deleteConfirm.id);
        setDeleteConfirm(null);
    };

    const openEditModal = (child: ChildProfile) => {
        setFormData({
            name: child.name,
            avatar: child.avatar,
            iban: child.iban || '',
            birthDate: child.birthDate || ''
        });
        setEditingChild(child);
    };

    const closeModals = () => {
        setFormData({ name: '', avatar: '👦', iban: '', birthDate: '' });
        setIsAddingChild(false);
        setEditingChild(null);
    };

    const formatIBAN = (value: string) => {
        const clean = value.replace(/\s/g, '').toUpperCase();
        const groups = clean.match(/.{1,4}/g);
        return groups ? groups.join(' ') : clean;
    };

    const handleIBANChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\s/g, '').toUpperCase();
        if (raw.length <= 24) { // ES + 2 digits + 20 digits = 24
            setFormData({ ...formData, iban: raw });
        }
    };

    return (
        <div>
            {/* Children List */}
            <div className="space-y-3 mb-4">
                {children.length === 0 ? (
                    <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 border-dashed">
                        <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
                            No hay hijos añadidos. ¡Añade tu primer hijo!
                        </p>
                    </Card>
                ) : (
                    children.map((child) => (
                        <Card
                            key={child.id}
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-colors duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl">{child.avatar}</div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white">{child.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Nivel {child.level} • {child.balance.toFixed(2)}€ • {child.xp} XP
                                        </p>
                                        {(child.iban || child.birthDate) && (
                                            <div className="mt-1 space-y-0.5">
                                                {child.iban && (
                                                    <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                                        IBAN: {formatIBAN(child.iban)}
                                                    </p>
                                                )}
                                                {child.birthDate && (
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                                        Nacimiento: {new Date(child.birthDate).toLocaleDateString('es-ES')}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(child)}
                                        className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm({ id: child.id, name: child.name })}
                                        className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Add Child Button */}
            <Button
                onClick={() => setIsAddingChild(true)}
                variant="outline"
                fullWidth
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10"
            >
                <Plus size={20} />
                Añadir Hijo/a
            </Button>

            {/* Add/Edit Modal */}
            {(isAddingChild || editingChild) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeModals}
                    />

                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={closeModals}
                            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            <X size={18} className="text-slate-600 dark:text-slate-300" />
                        </button>

                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">
                            {editingChild ? 'Editar Hijo/a' : 'Añadir Hijo/a'}
                        </h2>

                        <div className="space-y-5">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nombre del hijo/a"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none transition-colors"
                                    autoFocus
                                />
                            </div>

                            {/* Avatar Picker */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Avatar
                                </label>
                                <EmojiPicker
                                    selectedEmoji={formData.avatar}
                                    onSelect={(emoji) => setFormData({ ...formData, avatar: emoji })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* IBAN Input */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        IBAN / Número de Cuenta
                                    </label>
                                    <input
                                        type="text"
                                        value={formatIBAN(formData.iban)}
                                        onChange={handleIBANChange}
                                        placeholder="ES00 0000 0000 00 0000000000"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-mono text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none transition-colors"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Soporta formato de 20 o 24 caracteres</p>
                                </div>

                                {/* Birth Date Input */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Fecha de Nacimiento
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={closeModals}
                                    variant="secondary"
                                    fullWidth
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={editingChild ? handleEditChild : handleAddChild}
                                    variant="primary"
                                    fullWidth
                                >
                                    {editingChild ? 'Guardar' : 'Añadir'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm !== null}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={handleDeleteChild}
                title="¿Eliminar hijo/a?"
                message={`¿Estás seguro de que quieres eliminar a "${deleteConfirm?.name}"? Se eliminarán todas sus tareas y recompensas. Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                variant="danger"
            />
        </div>
    );
};
