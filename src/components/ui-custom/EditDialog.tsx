
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';

export type FieldConfig = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'switch' | 'date';
  options?: { value: string; label: string }[];
  placeholder?: string;
  readOnly?: boolean;
};

interface EditDialogProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Record<string, any>) => void;
  fields: FieldConfig[];
  initialData: Record<string, any>;
  isLoading?: boolean;
}

export const EditDialog: React.FC<EditDialogProps> = ({
  title,
  open,
  onOpenChange,
  onSave,
  fields,
  initialData,
  isLoading = false
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialData);

  React.useEffect(() => {
    if (open) {
      setFormData(initialData);
    }
  }, [open, initialData]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              
              {field.type === 'text' && (
                <Input
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  readOnly={field.readOnly}
                  className={field.readOnly ? 'bg-muted cursor-not-allowed' : ''}
                />
              )}
              
              {field.type === 'number' && (
                <Input
                  id={field.name}
                  type="number"
                  value={formData[field.name] || 0}
                  onChange={(e) => handleChange(field.name, parseFloat(e.target.value))}
                  placeholder={field.placeholder}
                  readOnly={field.readOnly}
                  className={field.readOnly ? 'bg-muted cursor-not-allowed' : ''}
                />
              )}
              
              {field.type === 'textarea' && (
                <Textarea
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  readOnly={field.readOnly}
                  className={field.readOnly ? 'bg-muted cursor-not-allowed' : ''}
                />
              )}
              
              {field.type === 'date' && (
                <Input
                  id={field.name}
                  type="datetime-local"
                  value={formData[field.name] ? new Date(formData[field.name]).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleChange(field.name, new Date(e.target.value).toISOString())}
                  readOnly={field.readOnly}
                  className={field.readOnly ? 'bg-muted cursor-not-allowed' : ''}
                />
              )}
              
              {field.type === 'select' && field.options && (
                <Select
                  value={formData[field.name] || ''}
                  onValueChange={(value) => handleChange(field.name, value)}
                  disabled={field.readOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {field.type === 'switch' && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id={field.name}
                    checked={!!formData[field.name]}
                    onCheckedChange={(checked) => handleChange(field.name, checked)}
                    disabled={field.readOnly}
                  />
                  <Label htmlFor={field.name}>
                    {formData[field.name] ? 'Enabled' : 'Disabled'}
                  </Label>
                </div>
              )}
            </div>
          ))}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
