import http from "./http";

type CreatePaymentUrlResponse =
  | string
  | {
      paymentUrl?: string;
      url?: string;
      data?: string;
    };

const parsePaymentUrl = (payload: CreatePaymentUrlResponse): string => {
  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const candidateUrls = [payload.paymentUrl, payload.url, payload.data];
    const paymentUrl = candidateUrls.find(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    );

    if (paymentUrl) {
      return paymentUrl;
    }
  }

  throw new Error("Khong nhan duoc link thanh toan VNPay.");
};

export const createVNPayPaymentUrl = async (bookingId: string) => {
  const response = await http.post<CreatePaymentUrlResponse>(
    `/payment/create-payment-url/${bookingId}`,
  );

  return parsePaymentUrl(response.data);
};
