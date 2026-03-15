"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";

import { APP_URL } from "@/constants";
import { Button } from "@/components/ui/button";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("categoryId") || "";

  const [value, setValue] = useState(query);

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = new URL("/search", APP_URL);
    const newQuery = value.trim();

    url.searchParams.set("query", encodeURIComponent(newQuery));
    if (categoryId) {
      url.searchParams.set("categoryId", categoryId);
    }

    if (newQuery === "") {
      url.searchParams.delete("query");
    }

    router.push(url.toString());
  };

  return (
    <form className="flex w-full max-w-120" onSubmit={handleSearch}>
      <div className="relative w-full">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Search"
          className="w-full rounded-l-full border py-2 pr-12 pl-4 focus:border-blue-500 focus:outline-none"
        />
        {value && (
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full"
            onClick={() => setValue("")}
          >
            <XIcon className="text-gray-500" />
          </Button>
        )}
      </div>
      <button
        type="submit"
        disabled={!value.trim()}
        className="rounded-r-full border border-l-0 bg-gray-100 px-5 py-2.5 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
};
