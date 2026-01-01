import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SubscribeButtonProps {
  onClick: () => void;
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  disabled?: boolean;
  isSubscribed: boolean;
  className?: string;
}

export const SubscribeButton = ({
  onClick,
  size,
  disabled,
  isSubscribed,
  className,
}: SubscribeButtonProps) => {
  return (
    <Button
      className={cn("rounded-full", className)}
      onClick={onClick}
      size={size}
      disabled={disabled}
      variant={isSubscribed ? "secondary" : "default"}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
