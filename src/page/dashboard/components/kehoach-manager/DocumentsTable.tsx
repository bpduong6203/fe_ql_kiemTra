import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { DownloadIcon, Trash2 } from 'lucide-react';
import FileUpload from '@/components/ui/file-upload-props';
import type { TaiLieu } from '@/types/interfaces';

interface DocumentsTableProps {
  taiLieus: TaiLieu[];
  loading: boolean;
  canEdit: boolean;
  handleDeleteClick: (id: string) => void;
  getLoaiTaiLieuText: (loai: number) => string;
  keHoachId: string;
  handleAddDocument: (files: FileWithType[]) => Promise<void>;
}

interface FileWithType {
  file: File;
  loaiTaiLieu: number;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({
  taiLieus,
  loading,
  canEdit,
  handleDeleteClick,
  getLoaiTaiLieuText,
  handleAddDocument,
}) => {
  const [newFiles, setNewFiles] = React.useState<FileWithType[]>([]);
  const [resetFiles, setResetFiles] = React.useState(false);

  const handleUpload = async () => {
    if (newFiles.length === 0) return;
    await handleAddDocument(newFiles);
    setNewFiles([]);
    setResetFiles(true);
    setTimeout(() => setResetFiles(false), 0);
  };

  // Lấy VITE_API_BASE_URL từ biến môi trường
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Hàm tạo liên kết tải file đầy đủ
  const getDownloadUrl = (linkFile: string) => {
    if (linkFile.startsWith('https://')) {
      return linkFile;
    }
    return `${baseUrl}${linkFile.startsWith('/') ? '' : '/'}${linkFile}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách tài liệu</CardTitle>
      </CardHeader>
      <CardContent>
        {canEdit && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Thêm tài liệu mới</h3>
            <FileUpload
              onFilesChange={setNewFiles}
              reset={resetFiles}
              isLoading={loading}
            />
            <Button
              className="mt-2"
              onClick={handleUpload}
              disabled={newFiles.length === 0 || loading}
            >
              Tải lên
            </Button>
          </div>
        )}
        {loading ? (
          <div>
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
          </div>
        ) : taiLieus.length === 0 ? (
          <p className="text-muted-foreground">Không có tài liệu.</p>
        ) : (
          <div className="overflow-x-auto rounded-sm">
            <table className="min-w-full border rounded-2xl shadow">
              <thead>
                <tr className="uppercase text-xs tracking-wide">
                  <th className="px-4 py-3 text-left font-medium">Tên tài liệu</th>
                  <th className="px-4 py-3 text-left font-medium">Loại tài liệu</th>
                  <th className="px-4 py-3 text-left font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {taiLieus.map((taiLieu) => (
                  <tr
                    key={taiLieu.id}
                    className="border-t hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <td className="px-4 py-2">{taiLieu.tenFile}</td>
                    <td className="px-4 py-2">{getLoaiTaiLieuText(taiLieu.loaiTaiLieu)}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" asChild>
                            <a
                              href={getDownloadUrl(taiLieu.linkFile)}
                              rel="noopener noreferrer"
                            >
                              <DownloadIcon className="size-4" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Tải tài liệu</TooltipContent>
                      </Tooltip>
                      {canEdit && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleDeleteClick(taiLieu.id)}
                              variant="destructive"
                              size="icon"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Xóa tài liệu</TooltipContent>
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsTable;