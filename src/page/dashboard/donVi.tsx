import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import GenericModal from '@/components/generic-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchIcon, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Field, DonVi } from '@/types/interfaces';

export default function DonViPage() {
  const [donViList, setDonViList] = useState<DonVi[]>([]);
  const [filteredDonViList, setFilteredDonViList] = useState<DonVi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('create');
  const [selectedDonVi, setSelectedDonVi] = useState<DonVi | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchDonVi = useCallback(async () => {
    try {
      setLoading(true);
      // Giả lập dữ liệu đơn vị
      const mockData: DonVi[] = [
        {
          id: '1',
          tenDonVi: 'Đơn vị A',
          diaChi: '123 Đường A, Hà Nội',
          soDienThoai: '0123456789',
          email: 'donvia@example.com',
          nguoiDaiDien: 'Nguyễn Văn A',
          chucVuNguoiDaiDien: 'Giám đốc',
        },
        {
          id: '2',
          tenDonVi: 'Đơn vị B',
          diaChi: '456 Đường B, TP.HCM',
          soDienThoai: '0987654321',
          email: 'donvib@example.com',
          nguoiDaiDien: 'Trần Thị B',
          chucVuNguoiDaiDien: 'Phó giám đốc',
        },
        {
          id: '3',
          tenDonVi: 'Đơn vị C',
          email: 'donvic@example.com',
        },
      ];
      const sortedDonVi = mockData.sort((a: DonVi, b: DonVi) =>
        sortOrder === 'asc' ? a.tenDonVi.localeCompare(b.tenDonVi) : b.tenDonVi.localeCompare(a.tenDonVi)
      );
      setDonViList(sortedDonVi);
      setFilteredDonViList(sortedDonVi);
    } catch (error) {
      console.error('Error fetching don vi:', error);
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [sortOrder]);

  useEffect(() => {
    fetchDonVi();
  }, [fetchDonVi]);

  // Lọc đơn vị theo thanh tìm kiếm
  useEffect(() => {
    const filtered = donViList.filter((donVi) =>
      donVi.tenDonVi.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDonViList(filtered);
  }, [searchQuery, donViList]);

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setFilteredDonViList([...filteredDonViList].sort((a, b) =>
      newSortOrder === 'asc' ? a.tenDonVi.localeCompare(b.tenDonVi) : b.tenDonVi.localeCompare(a.tenDonVi)
    ));
  };

  const openCreateModal = () => {
    setSelectedDonVi(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (donVi: DonVi) => {
    setSelectedDonVi(donVi);
    setModalMode('edit');
    setModalOpen(true);
  };

  const openViewModal = (donVi: DonVi) => {
    setSelectedDonVi(donVi);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      const payload = { ...data };
      await apiFetch(selectedDonVi ? `/donvi/${selectedDonVi.id}` : '/donvi', {
        method: selectedDonVi ? 'PUT' : 'POST',
        data: payload,
      });
      fetchDonVi();
      setModalOpen(false);
      toast.success(`Đã ${selectedDonVi ? 'cập nhật' : 'tạo'} đơn vị thành công`);
    } catch (error) {
      console.error('Error saving don vi:', error);
      toast.error('Lỗi khi lưu đơn vị');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn vị này?')) return;
    try {
      await apiFetch(`/donvi/${id}`, { method: 'DELETE' });
      fetchDonVi();
      toast.success('Đã xóa đơn vị thành công');
    } catch (error) {
      console.error('Error deleting don vi:', error);
      toast.error('Lỗi khi xóa đơn vị');
    }
  };

  const donViFields: Field[] = [
    { name: 'tenDonVi', label: 'Tên đơn vị', type: 'text', required: true },
    { name: 'diaChi', label: 'Địa chỉ', type: 'text' },
    { name: 'soDienThoai', label: 'Số điện thoại', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'nguoiDaiDien', label: 'Người đại diện', type: 'text' },
    { name: 'chucVuNguoiDaiDien', label: 'Chức vụ người đại diện', type: 'text' },
  ];

  return (
    <Card className="m-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Danh sách đơn vị
          <Button onClick={openCreateModal} variant="secondary">
            Tạo mới
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Thanh tìm kiếm */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đơn vị..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div>
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-sm">
            <table className="min-w-full border rounded-2xl shadow">
              <thead>
                <tr className="uppercase text-xs tracking-wide">
                  <th
                    className="px-4 py-3 text-left cursor-pointer font-medium transition-colors"
                    onClick={toggleSortOrder}
                  >
                    Tên {sortOrder === 'asc' ? '↑' : '↓'}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Địa chỉ</th>
                  <th className="px-4 py-3 text-left font-medium">Số điện thoại</th>
                  <th className="px-4 py-3 text-left font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonViList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-2 text-center text-sm text-muted-foreground">
                      Không tìm thấy đơn vị.
                    </td>
                  </tr>
                ) : (
                  filteredDonViList.map((donVi) => (
                    <tr key={donVi.id} className="border-t hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                      <td className="px-4 py-2">{donVi.tenDonVi}</td>
                      <td className="px-4 py-2">{donVi.diaChi || 'N/A'}</td>
                      <td className="px-4 py-2">{donVi.soDienThoai || 'N/A'}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button
                          onClick={() => openViewModal(donVi)}
                          variant="outline"
                          size="icon"
                          title="Xem đơn vị"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          onClick={() => openEditModal(donVi)}
                          variant="outline"
                          size="icon"
                          title="Sửa đơn vị"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(donVi.id)}
                          variant="destructive"
                          size="icon"
                          title="Xóa đơn vị"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <GenericModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={
            modalMode === 'view' ? 'Xem đơn vị' :
            modalMode === 'edit' ? 'Sửa đơn vị' : 'Tạo đơn vị mới'
          }
          initialData={selectedDonVi || {}}
          fields={donViFields.map(field => ({
            ...field,
            disabled: modalMode === 'view'
          }))}
          apiEndpoint={selectedDonVi ? `/donvi/${selectedDonVi.id}` : '/donvi'}
          method={selectedDonVi ? 'PUT' : 'POST'}
          onSave={modalMode === 'view' ? async () => {} : handleSave}
        />
      </CardContent>
    </Card>
  );
}