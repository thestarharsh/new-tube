import { SubscriptionsSection } from "../sections/subscriptions-section";

interface SubscriptionsViewProps {}

export const SubscriptionsView = ({}: SubscriptionsViewProps) => {
  return (
    <div className="mx-auto mb-10 flex max-w-3xl flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-muted-foreground text-xs">
          View and manage your subscriptions
        </p>
      </div>
      <SubscriptionsSection />
    </div>
  );
};
