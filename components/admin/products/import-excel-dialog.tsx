"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminImportProducts,
  type ImportProductResult,
} from "@/service/admin/products";
import * as XLSX from "xlsx";

interface ImportExcelDialogProps {
  onImported?: () => void;
}

export function ImportExcelDialog({ onImported }: ImportExcelDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportProductResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.match(/.(xlsx|xls)$/i)) {
      toast.error("Chỉ hỗ trợ file .xlsx hoặc .xls");
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await adminImportProducts(file);
      setResult(res);
      if (res.success > 0) {
        toast.success();
        onImported?.();
      }
      if (res.failed > 0) {
        toast.warning();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Import thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "name",
      "slug",
      "sku",
      "description",
      "price",
      "discount",
      "images",
      "thumbnail",
      "brand",
      "category",
      "sizes",
      "colors",
      "material",
      "stock",
      "sold",
      "rating",
      "reviewCount",
      "isFeatured",
      "status",
      "deletedAt",
    ];
    const example = [
      "Áo thun cotton basic",
      "ao-thun-cotton-basic",
      "TS001",
      "Mô tả sản phẩm",
      299000,
      10,
      "https://example.com/img1.jpg,https://example.com/img2.jpg",
      "https://example.com/img1.jpg",
      "Nike",
      "<category_id>",
      "S,M,L,XL",
      "Black,White",
      "Cotton",
      100,
      0,
      4.5,
      0,
      "TRUE",
      "active",
      "",
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Product");
    XLSX.writeFile(wb, "template_import_products.xlsx");
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
        else setOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Import Excel
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Import sản phẩm từ Excel</DialogTitle>
          <DialogDescription>
            Upload file .xlsx theo đúng định dạng. Cột <strong>category</strong>{" "}
            phải là ObjectId của danh mục trong hệ thống.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <button
            onClick={handleDownloadTemplate}
            className="flex w-full items-center gap-3 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span>Tải file Excel mẫu (template)</span>
          </button>

          <div
            className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-gray-400" />
            {file ? (
              <div className="text-center">
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB — Click để đổi file
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600">Nhấn để chọn file Excel</p>
                <p className="text-xs text-gray-400 mt-1">Hỗ trợ .xlsx, .xls</p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {result && (
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">
                    {result.success} thành công
                  </span>
                </div>
                {result.failed > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">
                      {result.failed} thất bại
                    </span>
                  </div>
                )}
              </div>
              {result.errors.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {result.errors.map((e, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-red-600"
                    >
                      <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>
                        Dòng {e.row}: {e.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Đóng
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Đang import..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
