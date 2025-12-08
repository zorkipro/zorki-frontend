import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";

interface EditableCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  editKey: string;
  isEditing: boolean;
  onEditChange: (editKey: string | null) => void;
  renderContent: () => React.ReactNode;
  renderEditForm: () => React.ReactNode;
}

export const EditableCard: React.FC<EditableCardProps> = ({
  title,
  icon,
  value,
  editKey,
  isEditing,
  onEditChange,
  renderContent,
  renderEditForm,
}) => {
  return (
    <Card className="relative">
      <CardContent className="p-4 text-center">
        <div className="absolute top-2 right-2">
          <Dialog
            open={isEditing}
            onOpenChange={(open) => onEditChange(open ? editKey : null)}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Редактировать {title}</DialogTitle>
                <DialogDescription>
                  Внесите изменения в поле "{title}" и сохраните их
                </DialogDescription>
              </DialogHeader>
              {renderEditForm()}
            </DialogContent>
          </Dialog>
        </div>
        {icon}
        {renderContent()}
      </CardContent>
    </Card>
  );
};
