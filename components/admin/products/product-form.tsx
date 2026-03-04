"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Loader2 } from "lucide-react";
import {
  adminCreateProduct,
  adminUpdateProduct,
  type Product,
  type CreateProductPayload,
} from "@/service/admin/products";

const CATEGORIES = [
  "Pullovers",
  "Shirts",
  "Pants",
  "T-Shirts",
  "Shoes",
  "Accessories",
  "Jackets",
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const COLOR_OPTIONS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Gray",
  "Navy",
  "Brown",
];

interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: Product;
}

type FormData = {
  name: string;
  sku: string;
  description: string;
  price: string;
  discount: string;
  brand: string;
  category: string;
  material: string;
  stock: string;
  status: "active" | "inactive" | "out_of_stock";
  isFeatured: boolean;
  thumbnail: string;
  imageInput: string;
  images: string[];
  sizes: string[];
  colors: string[];
};

export function ProductForm({ mode, initialData }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: initialData?.name ?? "",
    sku: initialData?.sku ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price?.toString() ?? "",
    discount: initialData?.discount?.toString() ?? "0",
    brand: initialData?.brand ?? "",
    category: initialData?.category ?? "",
    material: initialData?.material ?? "",
    stock: initialData?.stock?.toString() ?? "0",
    status: initialData?.status ?? "active",
    isFeatured: initialData?.isFeatured ?? false,
    thumbnail: initialData?.thumbnail ?? "",
    imageInput: "",
    images: initialData?.images ?? [],
    sizes: initialData?.sizes ?? [],
    colors: initialData?.colors ?? [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errs.name = "Tên sản phẩm không được để trống";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      errs.price = "Giá phải là số không âm";
    if (Number(form.stock) < 0) errs.stock = "Tồn kho không âm";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddImage = () => {
    const url = form.imageInput.trim();
    if (!url) return;
    if (form.images.includes(url)) {
      toast.error("URL ảnh đã tồn tại");
      return;
    }
    set("images", [...form.images, url]);
    set("imageInput", "");
    if (!form.thumbnail) set("thumbnail", url);
  };

  const handleRemoveImage = (url: string) => {
    const updated = form.images.filter((u) => u !== url);
    set("images", updated);
    if (form.thumbnail === url) {
      set("thumbnail", updated[0] ?? "");
    }
  };

  const toggleSize = (size: string) => {
    set(
      "sizes",
      form.sizes.includes(size)
        ? form.sizes.filter((s) => s !== size)
        : [...form.sizes, size],
    );
  };

  const toggleColor = (color: string) => {
    set(
      "colors",
      form.colors.includes(color)
        ? form.colors.filter((c) => c !== color)
        : [...form.colors, color],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload: CreateProductPayload = {
        name: form.name.trim(),
        sku: form.sku.trim() || undefined,
        description: form.description.trim(),
        price: Number(form.price),
        discount: Number(form.discount),
        images: form.images,
        thumbnail: form.thumbnail || form.images[0] || undefined,
        brand: form.brand.trim() || undefined,
        category: form.category || undefined,
        sizes: form.sizes,
        colors: form.colors,
        material: form.material.trim() || undefined,
        stock: Number(form.stock),
        isFeatured: form.isFeatured,
        status: form.status,
      };

      if (mode === "create") {
        await adminCreateProduct(payload);
        toast.success("Tạo sản phẩm thành công!");
      } else {
        await adminUpdateProduct(initialData!._id, payload);
        toast.success("Cập nhật sản phẩm thành công!");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Có lỗi xảy ra, vui lòng thử lại",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Left column: main info ── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Thông tin chung */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">
                  Tên sản phẩm <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                  className={errors.name ? "border-rose-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500">{errors.name}</p>
                )}
              </div>

              {/* SKU & Brand */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={form.sku}
                    onChange={(e) => set("sku", e.target.value)}
                    placeholder="Mã SKU"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="brand">Thương hiệu</Label>
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={(e) => set("brand", e.target.value)}
                    placeholder="Nike, Adidas..."
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Mô tả chi tiết sản phẩm..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Giá & Tồn kho */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Giá & Tồn kho</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">
                  Giá bán (VNĐ) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="0"
                  className={errors.price ? "border-rose-500" : ""}
                />
                {errors.price && (
                  <p className="text-xs text-rose-500">{errors.price}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="discount">Giảm giá (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min={0}
                  max={100}
                  value={form.discount}
                  onChange={(e) => set("discount", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">
                  Tồn kho <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value)}
                  placeholder="0"
                  className={errors.stock ? "border-rose-500" : ""}
                />
                {errors.stock && (
                  <p className="text-xs text-rose-500">{errors.stock}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="material">Chất liệu</Label>
                <Input
                  id="material"
                  value={form.material}
                  onChange={(e) => set("material", e.target.value)}
                  placeholder="Cotton, Polyester..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Kích thước & Màu sắc */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kích thước & Màu sắc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Kích thước</Label>
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`rounded border px-3 py-1 text-sm transition-colors ${
                        form.sizes.includes(size)
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-300 text-gray-600 hover:border-indigo-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Màu sắc</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColor(color)}
                      className={`rounded border px-3 py-1 text-sm transition-colors ${
                        form.colors.includes(color)
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-300 text-gray-600 hover:border-indigo-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hình ảnh */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hình ảnh sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={form.imageInput}
                  onChange={(e) => set("imageInput", e.target.value)}
                  placeholder="Nhập URL ảnh và nhấn Thêm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {form.images.map((url) => (
                    <div key={url} className="group relative">
                      <div className="relative aspect-square overflow-hidden rounded-md border bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/80";
                          }}
                        />
                      </div>
                      {form.thumbnail === url && (
                        <span className="absolute bottom-1 left-1 rounded bg-indigo-600 px-1 text-[10px] text-white">
                          Thumbnail
                        </span>
                      )}
                      <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {form.thumbnail !== url && (
                          <button
                            type="button"
                            onClick={() => set("thumbnail", url)}
                            className="rounded bg-indigo-600 px-1 text-[10px] text-white"
                            title="Đặt làm thumbnail"
                          >
                            ★
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(url)}
                          className="rounded bg-rose-600 p-0.5 text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right column: meta ── */}
        <div className="space-y-6">
          {/* Phân loại */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Phân loại</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Danh mục</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => set("category", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Trạng thái */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trạng thái & Hiển thị</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Trạng thái bán hàng</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    set("status", v as FormData["status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang bán</SelectItem>
                    <SelectItem value="inactive">Ẩn</SelectItem>
                    <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Sản phẩm nổi bật
                  </Label>
                  <p className="text-xs text-gray-500">
                    Hiển thị trên trang chủ
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={form.isFeatured}
                  onCheckedChange={(v) => set("isFeatured", v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Current tags preview */}
          {(form.sizes.length > 0 || form.colors.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Đã chọn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.sizes.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-xs text-gray-500">Kích thước</p>
                    <div className="flex flex-wrap gap-1">
                      {form.sizes.map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {form.colors.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-xs text-gray-500">Màu sắc</p>
                    <div className="flex flex-wrap gap-1">
                      {form.colors.map((c) => (
                        <Badge key={c} variant="outline">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Tạo sản phẩm" : "Lưu thay đổi"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/admin/products")}
              disabled={saving}
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
