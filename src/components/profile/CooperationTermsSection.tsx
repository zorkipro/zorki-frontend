/**
 * Секция "Условия сотрудничества" в редакторе профиля
 * Позволяет редактировать и отображать условия сотрудничества блогера
 */

import React, { useState, useEffect } from "react";
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
  /** Текущие условия сотрудничества */
  cooperationConditions: string;
  /** Имя секции для редактирования */
  editingSection: string | null;
  /** Флаг сохранения */
  saving: boolean;
  /** Callback при изменении редактируемой секции */
  onEditingSectionChange: (section: string | null) => void;
  /** Callback при сохранении */
  onSave: (data: { cooperation_conditions: string }) => Promise<void>;
}

/**
 * Компонент для редактирования условий сотрудничества
 */
export const CooperationTermsSection: React.FC<CooperationTermsSectionProps> =
  React.memo(
    ({
      cooperationConditions,
      editingSection,
      saving,
      onEditingSectionChange,
      onSave,
    }) => {
      const [editConditions, setEditConditions] = useState(
        cooperationConditions || "",
      );

      // Обновляем состояние при изменении cooperationConditions
      useEffect(() => {
        setEditConditions(cooperationConditions || "");
      }, [cooperationConditions]);

      const handleSaveClick = async () => {
        try {
          await onSave({ cooperation_conditions: editConditions });
          onEditingSectionChange(null);
        } catch (error) {
          // Ошибка уже обработана в handleSave
        }
      };

      return (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="absolute top-2 right-2">
              <Dialog
                open={editingSection === "cooperation_conditions"}
                onOpenChange={(open) =>
                  onEditingSectionChange(open ? "cooperation_conditions" : null)
                }
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="w-4 h-4" />
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
                      <Button
                        variant="outline"
                        onClick={() => onEditingSectionChange(null)}
                      >
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

            <h3 className="font-semibold mb-4">Условия сотрудничества</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {cooperationConditions ||
                  "Нажмите на иконку редактирования, чтобы добавить условия сотрудничества..."}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    },
  );

CooperationTermsSection.displayName = "CooperationTermsSection";
