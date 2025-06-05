import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, Trash2, CheckCircle, XCircle, Eye } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

import type { NDGiaiTrinh } from "@/types/interfaces";

interface NDGiaiTrinhTableProps {
    ndGiaiTrinhList: NDGiaiTrinh[];
    loading: boolean;
    canEvaluate: boolean;
    canDeleteND: boolean;
    onDeleteND: (id: string) => Promise<void>;
    onEvaluateND: (id: string, trangThai: "Đạt" | "Chưa Đạt") => Promise<void>;
    onViewND: (ndGiaiTrinh: NDGiaiTrinh) => void;
    getDownloadUrl: (linkFile: string) => string;
    canManipulateND: boolean; 
}

const trangThaiColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'} = {
    'Chờ Đánh Giá': 'secondary',
    'Đạt': 'success',
    'Chưa Đạt': 'destructive',
    'Đã Sửa': 'default'
};

export const NDGiaiTrinhTable: React.FC<NDGiaiTrinhTableProps> = ({
    ndGiaiTrinhList,
    loading,
    canEvaluate,
    canDeleteND,
    onDeleteND,
    onEvaluateND,
    onViewND,
    getDownloadUrl,
    canManipulateND,
}) => {
    const [alertOpen, setAlertOpen] = useState(false);
    const [selectedNDId, setSelectedNDId] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setSelectedNDId(id);
        setAlertOpen(true);
    };

    const confirmDelete = () => {
        if (selectedNDId) {
            onDeleteND(selectedNDId);
            setAlertOpen(false);
            setSelectedNDId(null);
        }
    };

    if (loading) {
        return (
            <div className="p-4 space-y-2 border rounded-md">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border overflow-hidden">
                {ndGiaiTrinhList.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">Chưa có nội dung giải trình nào.</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="uppercase text-xs tracking-wide">
                                <TableHead className="w-[180px] font-medium">Nội dung</TableHead>
                                <TableHead className="font-medium">Tệp</TableHead>
                                <TableHead className="w-[120px] font-medium">Ngày tạo</TableHead>
                                <TableHead className="w-[120px] font-medium">Trạng thái</TableHead>
                                <TableHead className="font-medium">Người đánh giá</TableHead>
                                <TableHead className="w-[150px] text-right font-medium">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ndGiaiTrinhList.map((nd) => (
                                <TableRow key={nd.id}>
                                    <TableCell className="font-medium max-w-[200px] truncate">{nd.noiDung || 'N/A'}</TableCell>
                                    <TableCell>
                                        {nd.linkFile && nd.tenFile ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="icon" asChild>
                                                        <a
                                                            href={getDownloadUrl(nd.linkFile)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label={`Tải xuống file ${nd.tenFile}`}
                                                        >
                                                            <DownloadIcon className="size-4" />
                                                        </a>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Tải xuống: {nd.tenFile}</TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            'Không có tệp'
                                        )}
                                    </TableCell>
                                    <TableCell>{format(new Date(nd.ngayTao), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>
                                        <Badge variant={trangThaiColors[nd.trangThai] || 'outline'}>
                                            {nd.trangThai}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {nd.nguoiDanhGia?.hoTen || 'Chưa đánh giá'}
                                    </TableCell>
                                    <TableCell className="text-right whitespace-nowrap">
                                        {/* Nút Xem/Sửa - Dùng canManipulateND mới */}
                                        {canManipulateND && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => onViewND(nd)} className="h-8 w-8">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Xem/Sửa</TooltipContent>
                                            </Tooltip>
                                        )}

                                        {/* Nút Đánh giá Đạt/Chưa Đạt */}
                                        {(nd.trangThai === 'Chờ Đánh Giá' || nd.trangThai === 'Đã Sửa') && canEvaluate && (
                                            <>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => onEvaluateND(nd.id, 'Đạt')} className="text-green-600 h-8 w-8">
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Đánh giá Đạt</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => onEvaluateND(nd.id, 'Chưa Đạt')} className="text-red-600 h-8 w-8">
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Đánh giá Chưa Đạt</TooltipContent>
                                                </Tooltip>
                                            </>
                                        )}

                                        {/* Nút Xóa - Dùng canManipulateND mới */}
                                        {canDeleteND && canManipulateND && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(nd.id)} className="text-red-600 h-8 w-8">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Xóa</TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa Nội dung Giải Trình</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa nội dung giải trình này? Hành động này không thể hoàn tác và tệp đính kèm sẽ bị xóa.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white">
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};