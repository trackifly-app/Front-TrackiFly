import { Pencil, Check, X } from 'lucide-react';

interface Props {
  label: string;
  value?: string;
  field: string;
  editingField: string | null;
  tempValue: string;
  setTempValue: (value: string) => void;
  onEdit: (field: string, value?: string) => void;
  onSave: (field: string) => void;
  onCancel: () => void;
  type?: 'text' | 'select' | 'date';
}

export default function UserEditor({ label, value, field, editingField, tempValue, setTempValue, onEdit, onSave, onCancel, type = 'text' }: Props) {
  const isEditing = editingField === field;

  return (
    <div className="bg-surface-muted rounded-xl p-4 border border-border">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm text-muted">{label}</p>

        {!isEditing && (
          <button onClick={() => onEdit(field, value)}>
            <Pencil size={16} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          {type === 'select' ? (
            <select className="w-full px-2 py-1 rounded border border-border bg-background" value={tempValue} onChange={(e) => setTempValue(e.target.value)}>
              <option value="">Seleccionar</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <input type={type} max={type === 'date' ? new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0] : undefined} className="w-full px-2 py-1 rounded border border-border bg-background" value={tempValue || ''} onChange={(e) => setTempValue(e.target.value)} />
          )}

          <button onClick={() => onSave(field)}>
            <Check size={16} />
          </button>

          <button onClick={onCancel}>
            <X size={16} />
          </button>
        </div>
      ) : (
        <p className="text-foreground font-medium">{value || 'No especificado'}</p>
      )}
    </div>
  );
}
