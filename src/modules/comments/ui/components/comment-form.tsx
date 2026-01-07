import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";

interface CommentFormProps {
  videoId: string;
  onSuccess?: () => void;
}

export const CommentForm = ({ videoId, onSuccess }: CommentFormProps) => {
  const { user } = useUser();

  return (
    <form className="group flex gap-4">
      <UserAvatar
        imageUrl={user?.imageUrl || "/user-placeholder.svg"}
        name={user?.username || "User"}
        size={"lg"}
      />
      <div className="flex-1">
        <Textarea
          placeholder="Add a comment..."
          className="resize-none overflow-hidden bg-transparent"
          rows={3}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="submit" size={"sm"}>
            Comment
          </Button>
        </div>
      </div>
    </form>
  );
};
