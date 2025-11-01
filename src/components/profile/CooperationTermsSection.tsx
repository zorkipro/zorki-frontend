import React, { useState } from "react";
import { Edit } from "lucide-react";
import { Card, CardContent } from "@/ui-kit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui-kit";
import { Button } from "@/ui-kit";
import { Label } from "@/ui-kit";
import { Textarea } from "@/ui-kit";

export interface CooperationTermsSectionProps {
  cooperationConditions: string;
  editingSection: string | null;
  saving: boolean;
  onEditingSectionChange: (section: string | null) => void;
  onSave: (data: { cooperation_conditions: string }) => Promise<void>;
}

export const CooperationTermsSection: React.FC<CooperationTermsSectionProps> = ({
  cooperationConditions,
  editingSection,
  saving,
  onEditingSectionChange,
  onSave,
}) => {
  const [editConditions, setEditConditions] = useState(cooperationConditions || "");

  const handleSaveClick = async () => {
    await onSave({ cooperation_conditions: editConditions });
    onEditingSectionChange(null);
  };

  const handleCancel = () => {
    setEditConditions(cooperationConditions || "");
    onEditingSectionChange(null);
  };

  return (
    <Card className="relative">
      <CardContent className="p-4 sm:p-5">
        <div className="absolute top-3 right-3">
            <Dialog
              open={editingSection === "cooperation_conditions"}
              onOpenChange={(open) => {
                if (!open) {
                  setEditConditions(cooperationConditions || "");
                }
                onEditingSectionChange(open ? "cooperation_conditions" : null);
              }}
            >
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Редактировать условия сотрудничества
                </DialogTitle>
                <DialogDescription>
                  Обновите условия сотрудничества для вашего профиля
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cooperation_conditions">
                    Условия сотрудничества
                  </Label>
                  <Textarea
                    id="cooperation_conditions"
                    value={editConditions}
                    onChange={(e) => setEditConditions(e.target.value)}
                    placeholder="Опишите условия сотрудничества..."
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Отмена
                  </Button>
                  <Button onClick={handleSaveClick} disabled={saving}>
                    {saving ? "Сохранение..." : "Сохранить"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <h3 className="font-semibold mb-4 sm:mb-5 text-sm sm:text-base">Условия сотрудничества</h3>
        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {cooperationConditions ||
              "Нажмите на иконку редактирования, чтобы добавить условия сотрудничества..."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
