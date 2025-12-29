import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { X, Camera, Upload, AlertTriangle } from 'lucide-react';
import { validatePhotoTimestamp, fileToBase64 } from '../../../utils/exifValidator';

interface CompleteTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (proof: string, proofPhoto?: string, proofPhotoTimestamp?: string, fraudWarning?: boolean) => void;
    taskTitle: string;
}

export const CompleteTaskModal: React.FC<CompleteTaskModalProps> = ({
    isOpen,
    onClose,
    onComplete,
    taskTitle
}) => {
    const [proof, setProof] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [validating, setValidating] = useState(false);
    const [validationResult, setValidationResult] = useState<{
        isValid: boolean;
        message: string;
        photoTimestamp?: Date;
    } | null>(null);

    if (!isOpen) return null;

    const handlePhotoSelect = async (file: File) => {
        setPhotoFile(file);
        setValidating(true);
        setValidationResult(null);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setPhotoPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Validate EXIF timestamp
        try {
            const result = await validatePhotoTimestamp(file, 5);

            if (result.error) {
                setValidationResult({
                    isValid: false,
                    message: `⚠️ ${result.error}. La foto se enviará de todos modos.`
                });
            } else if (!result.isValid && result.photoTimestamp) {
                const minutesDiff = result.minutesDifference || 0;
                setValidationResult({
                    isValid: false,
                    message: `⚠️ La foto tiene ${minutesDiff} minutos de antigüedad. Puede detectarse como posible fraude.`,
                    photoTimestamp: result.photoTimestamp
                });
            } else {
                setValidationResult({
                    isValid: true,
                    message: '✓ Foto verificada correctamente',
                    photoTimestamp: result.photoTimestamp || undefined
                });
            }
        } catch (error) {
            setValidationResult({
                isValid: false,
                message: '⚠️ No se pudo validar la foto. Se enviará de todos modos.'
            });
        } finally {
            setValidating(false);
        }
    };

    const handleSubmit = async () => {
        let photoBase64: string | undefined;
        let photoTimestamp: string | undefined;
        let fraudWarning = false;

        if (photoFile) {
            photoBase64 = await fileToBase64(photoFile);
            if (validationResult?.photoTimestamp) {
                photoTimestamp = validationResult.photoTimestamp.toISOString();
            }
            fraudWarning = validationResult ? !validationResult.isValid : false;
        }

        onComplete(proof || '¡Tarea completada!', photoBase64, photoTimestamp, fraudWarning);

        // Reset state
        setProof('');
        setPhotoFile(null);
        setPhotoPreview(null);
        setValidationResult(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white dark:bg-slate-800 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Completar Tarea</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <span className="font-semibold">{taskTitle}</span>
                </p>

                {/* Text Proof */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Mensaje (opcional)
                    </label>
                    <textarea
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                        placeholder="¿Algo que quieras contarle a papá/mamá?"
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
                        rows={3}
                    />
                </div>

                {/* Photo Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Foto de prueba
                    </label>

                    {!photoPreview ? (
                        <div className="grid grid-cols-2 gap-2">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && handlePhotoSelect(e.target.files[0])}
                                />
                                <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-primary/30 dark:border-primary/20 bg-primary/5 dark:bg-primary/5 hover:bg-primary/10 dark:hover:bg-primary/10 transition-colors">
                                    <Camera size={24} className="text-primary" />
                                    <span className="text-xs font-semibold text-primary">Tomar Foto</span>
                                </div>
                            </label>

                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && handlePhotoSelect(e.target.files[0])}
                                />
                                <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <Upload size={24} className="text-slate-500 dark:text-slate-400" />
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Subir Archivo</span>
                                </div>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-600">
                                <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
                                <button
                                    onClick={() => {
                                        setPhotoFile(null);
                                        setPhotoPreview(null);
                                        setValidationResult(null);
                                    }}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                    <X size={16} className="text-white" />
                                </button>
                            </div>

                            {validating && (
                                <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                    Validando foto...
                                </div>
                            )}

                            {validationResult && (
                                <div
                                    className={`text-xs p-2 rounded-lg ${validationResult.isValid
                                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                            : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                                        }`}
                                >
                                    {validationResult.message}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex gap-2">
                        <AlertTriangle size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                            La foto se verifica automáticamente. Si no fue tomada hace poco, puede marcarse como sospechosa.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="lg"
                        fullWidth
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={handleSubmit}
                        className="flex-1"
                    >
                        ¡Completar!
                    </Button>
                </div>
            </Card>
        </div>
    );
};
