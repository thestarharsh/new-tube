import { AlertTriangleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage = ({
  message = "Something went wrong",
}: ErrorMessageProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border",
        "border-muted bg-muted/40 text-muted-foreground",
        "px-4 py-2 text-sm",
      )}
    >
      <AlertTriangleIcon className="h-4 w-4 font-bold text-red-400" />
      <span className="font-bold text-red-400">{message}</span>
    </div>
  );
};
