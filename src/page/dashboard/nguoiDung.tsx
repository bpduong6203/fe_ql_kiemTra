import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import { useUser } from './components/user-manager/useUser';
import { UserTable } from './components/user-manager/UserTable';
import { UserModal } from './components/user-manager/UserModal';
import { UserViewModal } from './components/user-manager/UserViewModal';
import type { NguoiDung } from '@/types/interfaces';

export default function UserManager() {
  const {
    filteredUserList,
    rolesList,
    donViList,
    loading,
    sortOrder,
    searchQuery,
    setSearchQuery,
    userRole,
    fetchUsers,
    toggleSortOrder,
    handleSave,
    handleDelete,
    handleRoleChange,
    handleDonViChange,
    canEdit,
    canHardDelete,
  } = useUser();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('create');
  const [selectedUser, setSelectedUser] = useState<NguoiDung | null>(null);

  const openCreateModal = () => {
    setSelectedUser(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (user: NguoiDung) => {
    setSelectedUser(user);
    setModalMode('edit');
    setModalOpen(true);
  };

  const openViewModal = (user: NguoiDung) => {
    setSelectedUser(user);
    setModalMode('view');
    setModalOpen(true);
  };

  return (
    <Card className="m-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Danh sách người dùng
          {canEdit && (
            <Button onClick={openCreateModal} variant="secondary">
              Tạo mới
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Tìm kiếm người dùng..."
        />
        <UserTable
          filteredUserList={filteredUserList}
          loading={loading}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
          canEdit={canEdit}
          canHardDelete={canHardDelete}
          rolesList={rolesList}
          donViList={donViList}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onRoleChange={handleRoleChange}
          onDonViChange={handleDonViChange}
        />
        {modalMode === 'view' ? (
          <UserViewModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            selectedUser={selectedUser}
            rolesList={rolesList}
            donViList={donViList}
          />
        ) : (
          <UserModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            mode={modalMode}
            selectedUser={selectedUser}
            rolesList={rolesList}
            donViList={donViList}
            onSave={async (data) => {
              if (modalMode === 'create' || modalMode === 'edit') {
                await handleSave(data, modalMode, selectedUser?.id);
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};