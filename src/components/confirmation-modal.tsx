import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  message: string;
  subMessage?: string;
}

export const ConfirmationModal = ({
  isOpen,
  onOpenChange,
  onCancel,
  onConfirm,
  title,
  message,
  subMessage,
}: ConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-y-0.5">
          <p>{message}</p>
          {subMessage && (
            <p className="text-muted-foreground text-sm italic">{subMessage}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button variant={"default"} onClick={() => onConfirm()}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
