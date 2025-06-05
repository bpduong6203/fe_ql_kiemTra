import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, PlusIcon, ChevronDown } from 'lucide-react';

interface GiaiTrinhToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: 'asc' | 'desc';
  toggleSortOrder: () => void;
  canCreateGiaiTrinh: boolean;
  onOpenCreateModal: () => void;
}

export const GiaiTrinhToolbar: React.FC<GiaiTrinhToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  sortOrder,
  toggleSortOrder,
  canCreateGiaiTrinh,
  onOpenCreateModal,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Input
          type="text"
          placeholder="Tìm kiếm giải trình..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      </div>

      <div className="flex gap-2">
        <Button onClick={toggleSortOrder} variant="outline">
          Sắp xếp {sortOrder === 'asc' ? 'A-Z' : 'Z-A'} <ChevronDown className="ml-2 size-4" />
        </Button>
        {canCreateGiaiTrinh && (
          <Button onClick={onOpenCreateModal}>
            <PlusIcon className="mr-2 size-4" />
            Tạo Giải Trình
          </Button>
        )}
      </div>
    </div>
  );
};