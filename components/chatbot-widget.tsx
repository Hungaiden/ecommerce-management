"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  MessageCircle,
  SendHorizontal,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { getGroq } from "@/service/getGroq";
import type { Product } from "@/service/products";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80";

const QUICK_PROMPTS = [
  "Tìm váy đi tiệc dưới 1 triệu",
  "Mình cần áo sơ mi công sở màu trắng",
  "Gợi ý outfit đi chơi cuối tuần",
];

type MessageRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  products?: Product[];
}

const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "chatbot-welcome",
      role: "assistant",
      content:
        "Xin chào, mình là trợ lý AI của TrendVibe. Hãy mô tả nhu cầu mua sắm, mình sẽ gợi ý sản phẩm phù hợp ngay cho bạn.",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, isLoading, messages]);

  const handleSendMessage = async (presetMessage?: string) => {
    const content = (presetMessage ?? input).trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content,
    };

    const historySnapshot = [...messages, userMessage];

    setMessages(historySnapshot);
    setInput("");
    setIsLoading(true);

    try {
      const context = historySnapshot
        .slice(-6)
        .map(
          (item) =>
            `${item.role === "user" ? "User" : "Assistant"}: ${item.content}`,
        )
        .join("\n");

      const response = await getGroq.recommendProduct({
        message: content,
        context,
      });

      const products = Array.isArray(response?.products)
        ? response.products
        : [];

      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          content:
            products.length > 0
              ? `Mình đã chọn được ${products.length} sản phẩm phù hợp với yêu cầu của bạn.`
              : "Mình chưa tìm thấy sản phẩm đủ phù hợp. Bạn thử mô tả rõ hơn về màu sắc, ngân sách hoặc kiểu dáng nhé.",
          products,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          content:
            "Hiện tại hệ thống AI đang bận. Bạn thử lại sau ít phút hoặc đổi cách mô tả yêu cầu nhé.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 right-4 z-50 w-[calc(100vw-1rem)] sm:right-5 sm:w-[420px]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-[0_24px_70px_rgba(16,185,129,0.25)]">
              <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-emerald-200/40 blur-3xl" />
              <div className="pointer-events-none absolute -left-12 bottom-20 h-36 w-36 rounded-full bg-cyan-100/50 blur-3xl" />

              <div className="relative flex items-start justify-between gap-3 border-b bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                    <Sparkles className="h-4 w-4" />
                    TrendVibe Assistant
                  </p>
                  <p className="mt-1 text-xs text-emerald-50">
                    Tư vấn nhanh theo nhu cầu thật của bạn
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full text-white hover:bg-white/15 hover:text-white"
                  aria-label="Đóng chatbot"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {messages.length <= 1 && (
                <div className="border-b bg-emerald-50/50 px-4 py-3">
                  <p className="mb-2 text-xs font-medium text-emerald-800">
                    Gợi ý nhanh
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void handleSendMessage(prompt)}
                        disabled={isLoading}
                        className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-emerald-700 transition-colors hover:border-emerald-400 hover:text-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <ScrollArea className="h-[420px] bg-gradient-to-b from-white via-white to-emerald-50/40 px-4 py-3">
                <div className="space-y-3">
                  {messages.map((message) => {
                    const isAssistant = message.role === "assistant";

                    return (
                      <div
                        key={message.id}
                        className={`flex items-start gap-2 ${
                          isAssistant ? "justify-start" : "justify-end"
                        }`}
                      >
                        {isAssistant && (
                          <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <Bot className="h-4 w-4" />
                          </span>
                        )}

                        <div
                          className={`max-w-[84%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                            isAssistant
                              ? "border border-emerald-100 bg-white text-gray-700"
                              : "bg-emerald-600 text-white"
                          }`}
                        >
                          <p>{message.content}</p>

                          {message.products && message.products.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {message.products.map((product) => {
                                const thumbnail =
                                  product.thumbnail ||
                                  product.images?.[0] ||
                                  FALLBACK_IMAGE;
                                const discountedPrice =
                                  product.discount && product.discount > 0
                                    ? product.price *
                                      (1 - product.discount / 100)
                                    : null;

                                return (
                                  <Link
                                    href={`/shop/${product._id}`}
                                    key={product._id}
                                    className="block rounded-xl border border-emerald-100 bg-emerald-50/70 p-2 transition-colors hover:border-emerald-300"
                                  >
                                    <div className="flex gap-3">
                                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white">
                                        <Image
                                          src={thumbnail}
                                          alt={product.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <p className="line-clamp-1 font-medium text-gray-900">
                                          {product.name}
                                        </p>

                                        {product.brand && (
                                          <p className="line-clamp-1 text-xs text-gray-500">
                                            {product.brand}
                                          </p>
                                        )}

                                        <div className="mt-1 flex items-center gap-2 text-xs">
                                          {discountedPrice ? (
                                            <>
                                              <span className="font-semibold text-red-600">
                                                {formatCurrency(
                                                  discountedPrice,
                                                )}
                                              </span>
                                              <span className="text-gray-400 line-through">
                                                {formatCurrency(product.price)}
                                              </span>
                                              <Badge
                                                variant="outline"
                                                className="border-red-200 text-red-600"
                                              >
                                                -{product.discount}%
                                              </Badge>
                                            </>
                                          ) : (
                                            <span className="font-semibold text-gray-900">
                                              {formatCurrency(product.price)}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {!isAssistant && (
                          <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                            <User className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Bot className="h-4 w-4" />
                      </span>
                      <div className="rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-gray-500">
                        Đang phân tích yêu cầu và chọn sản phẩm...
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              <div className="border-t bg-white px-4 py-3">
                <div className="flex items-end gap-2">
                  <Textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Nhập yêu cầu của bạn..."
                    className="min-h-[44px] max-h-28 resize-none border-emerald-200 text-sm focus-visible:ring-emerald-500"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => void handleSendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="h-11 w-11 shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-700"
                    aria-label="Gửi tin nhắn"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-[11px] text-gray-400">
                  Nhấn Enter để gửi, Shift + Enter để xuống dòng.
                </p>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="fixed bottom-5 right-5 z-40"
      >
        <Button
          type="button"
          size="icon"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_16px_30px_rgba(16,185,129,0.45)] hover:from-emerald-600 hover:to-teal-700"
          aria-label={isOpen ? "Đóng cửa sổ chatbot" : "Mở cửa sổ chatbot"}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
        </Button>
      </motion.div>
    </>
  );
}
