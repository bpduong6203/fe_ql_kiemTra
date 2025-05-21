import React from "react";

interface TabsProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-6 py-6 border-b mt-4 whitespace-nowrap">
        {categories.map((tab) => (
          <button
            key={tab}
            onClick={() => onCategorySelect(tab)}
            className={`text-sm font-medium pb-2 transition-colors ${
              tab === selectedCategory
                ? "border-b-2 border-black dark:border-white"
                : "text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
