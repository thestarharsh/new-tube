import { CategoriesSection } from "../sections/categories-section";
import { VideosResultSection } from "../sections/videos-result-section";

interface SearchViewProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const SearchView = ({ query, categoryId }: SearchViewProps) => {
  return (
    <div className="mx-auto mb-10 flex max-w-[1300] flex-col gap-y-6 px-4 pt-2.5">
      <CategoriesSection categoryId={categoryId} />
      <VideosResultSection query={query} categoryId={categoryId} />
    </div>
  );
};
