"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adminCreateCampaign,
  adminGetCampaigns,
  adminGetSubscribers,
  adminSendCampaign,
  adminUpdateSubscriberStatus,
  type Campaign,
  type Subscriber,
} from "@/service/admin/newsletter";
import { Loader2, MailCheck, Send, Users } from "lucide-react";

const fmt = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("vi-VN");
};

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  const [subscriberKeyword, setSubscriberKeyword] = useState("");
  const [campaignStatus, setCampaignStatus] = useState<
    "all" | "draft" | "sent"
  >("all");

  const [updatingSubscriberId, setUpdatingSubscriberId] = useState<
    string | null
  >(null);
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(
    null,
  );
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const activeSubscriberCount = useMemo(
    () => subscribers.filter((item) => item.isActive).length,
    [subscribers],
  );

  const fetchSubscribers = useCallback(async () => {
    setLoadingSubscribers(true);
    try {
      const result = await adminGetSubscribers({
        offset: 0,
        limit: 200,
        keyword: subscriberKeyword || undefined,
      });
      setSubscribers(result.hits || []);
    } catch {
      toast.error("Không thể tải danh sách subscriber");
    } finally {
      setLoadingSubscribers(false);
    }
  }, [subscriberKeyword]);

  const fetchCampaigns = useCallback(async () => {
    setLoadingCampaigns(true);
    try {
      const result = await adminGetCampaigns({
        offset: 0,
        limit: 100,
        status: campaignStatus === "all" ? undefined : campaignStatus,
      });
      setCampaigns(result.hits || []);
    } catch {
      toast.error("Không thể tải danh sách campaign");
    } finally {
      setLoadingCampaigns(false);
    }
  }, [campaignStatus]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleToggleSubscriber = async (
    subscriber: Subscriber,
    isActive: boolean,
  ) => {
    setUpdatingSubscriberId(subscriber._id);
    try {
      const updated = await adminUpdateSubscriberStatus(
        subscriber._id,
        isActive,
      );
      setSubscribers((prev) =>
        prev.map((item) => (item._id === subscriber._id ? updated : item)),
      );
      toast.success("Cập nhật trạng thái subscriber thành công");
    } catch {
      toast.error("Không thể cập nhật trạng thái subscriber");
    } finally {
      setUpdatingSubscriberId(null);
    }
  };

  const handleCreateCampaign = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim() || !subject.trim() || !content.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề, subject và nội dung");
      return;
    }

    setCreatingCampaign(true);
    try {
      const created = await adminCreateCampaign({
        title: title.trim(),
        subject: subject.trim(),
        content: content.trim(),
      });

      setCampaigns((prev) => [created, ...prev]);
      setTitle("");
      setSubject("");
      setContent("");
      toast.success("Tạo campaign thành công");
    } catch {
      toast.error("Không thể tạo campaign");
    } finally {
      setCreatingCampaign(false);
    }
  };

  const handleSendCampaign = async (campaign: Campaign) => {
    setSendingCampaignId(campaign._id);
    try {
      const result = await adminSendCampaign(campaign._id);
      setCampaigns((prev) =>
        prev.map((item) =>
          item._id === campaign._id ? result.campaign : item,
        ),
      );
      toast.success(`Đã gửi campaign tới ${result.sentCount} subscriber`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gửi campaign thất bại");
    } finally {
      setSendingCampaignId(null);
    }
  };

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Newsletter Marketing"
        description="Quản lý subscriber và gửi email campaign"
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Tổng subscribers</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {subscribers.length}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Đang hoạt động</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {activeSubscriberCount}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Campaign</p>
            <p className="mt-1 text-2xl font-bold text-indigo-600">
              {campaigns.length}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Tạo campaign mới
          </h3>
          <form onSubmit={handleCreateCampaign} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                placeholder="Tiêu đề campaign"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <Input
                placeholder="Subject email"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </div>
            <Textarea
              placeholder="Nội dung email (có thể nhập text hoặc HTML)"
              rows={8}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            <div className="flex items-center justify-end">
              <Button type="submit" disabled={creatingCampaign}>
                {creatingCampaign ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Lưu campaign nháp"
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Subscribers
              </h3>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Tìm email..."
                  value={subscriberKeyword}
                  onChange={(event) => setSubscriberKeyword(event.target.value)}
                  className="w-56"
                />
                <Button variant="outline" onClick={fetchSubscribers}>
                  Làm mới
                </Button>
              </div>
            </div>

            <div className="max-h-[420px] overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Nhận mail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingSubscribers ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="py-8 text-center text-gray-400"
                      >
                        Đang tải...
                      </TableCell>
                    </TableRow>
                  ) : subscribers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="py-8 text-center text-gray-400"
                      >
                        Chưa có subscriber
                      </TableCell>
                    </TableRow>
                  ) : (
                    subscribers.map((subscriber) => (
                      <TableRow key={subscriber._id}>
                        <TableCell>
                          <div className="font-medium text-gray-800">
                            {subscriber.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {fmt(subscriber.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              subscriber.isActive ? "default" : "secondary"
                            }
                          >
                            {subscriber.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={subscriber.isActive}
                            disabled={updatingSubscriberId === subscriber._id}
                            onCheckedChange={(checked) =>
                              handleToggleSubscriber(subscriber, checked)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Campaigns</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={campaignStatus === "all" ? "default" : "outline"}
                  onClick={() => setCampaignStatus("all")}
                  size="sm"
                >
                  Tất cả
                </Button>
                <Button
                  variant={campaignStatus === "draft" ? "default" : "outline"}
                  onClick={() => setCampaignStatus("draft")}
                  size="sm"
                >
                  Draft
                </Button>
                <Button
                  variant={campaignStatus === "sent" ? "default" : "outline"}
                  onClick={() => setCampaignStatus("sent")}
                  size="sm"
                >
                  Sent
                </Button>
              </div>
            </div>

            <div className="max-h-[420px] overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingCampaigns ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="py-8 text-center text-gray-400"
                      >
                        Đang tải...
                      </TableCell>
                    </TableRow>
                  ) : campaigns.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="py-8 text-center text-gray-400"
                      >
                        Chưa có campaign
                      </TableCell>
                    </TableRow>
                  ) : (
                    campaigns.map((campaign) => (
                      <TableRow key={campaign._id}>
                        <TableCell>
                          <p className="font-medium text-gray-800">
                            {campaign.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {campaign.subject}
                          </p>
                          <p className="text-xs text-gray-400">
                            Tạo: {fmt(campaign.createdAt)}
                            {campaign.sentAt
                              ? ` • Gửi: ${fmt(campaign.sentAt)}`
                              : ""}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              campaign.status === "sent"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {campaign.status === "sent" ? "Đã gửi" : "Nháp"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.status === "sent" ? (
                            <Button size="sm" variant="outline" disabled>
                              <MailCheck className="mr-2 h-4 w-4" />
                              Đã gửi
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleSendCampaign(campaign)}
                              disabled={sendingCampaignId === campaign._id}
                            >
                              {sendingCampaignId === campaign._id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Đang gửi...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  Gửi cho {activeSubscriberCount} người
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-amber-50 p-4 text-sm text-amber-700">
          <p className="flex items-center gap-2 font-medium">
            <Users className="h-4 w-4" />
            Lưu ý gửi mail
          </p>
          <p className="mt-1">
            Chỉ subscriber có trạng thái Active mới nhận được email campaign.
          </p>
        </div>
      </div>
    </div>
  );
}
