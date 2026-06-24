// ===================================================
// Nomba API Types — mirrors real API response shapes
// ===================================================

// --- Standard Nomba response envelope ---
export interface NombaResponse<T> {
  code: string;         // "00" = success
  description: string;
  data: T;
}

// --- Authentication ---
export interface NombaTokenData {
  businessId: string;
  access_token: string;
  refresh_token: string;
  expiresAt: string;    // ISO 8601
}

// --- Virtual Account ---
export interface NombaCreateAccountRequest {
  accountRef: string;       // 16-64 chars, unique per student
  accountName: string;      // "FirstName LastName - School Fees"
  callbackUrl?: string;     // Webhook URL for this specific account
  expectedAmount?: string;  // Optional expected amount
}

export interface NombaVirtualAccountData {
  createdAt: string;
  accountHolderId: string;
  accountRef: string;
  accountName: string;
  currency: string;
  bankName: string;
  bankAccountNumber: string;  // 10-digit NUBAN
  bankAccountName: string;    // "Nomba/FirstName LastName"
  callbackUrl: string;
  expired: boolean;
}

// --- Webhook ---
export interface NombaWebhookPayload {
  event: string;  // "payment_success", "payment_failed", etc.
  data: {
    id: string;                   // Transaction ID from Nomba
    amount: number;
    currency: string;
    status: string;               // "SUCCESS"
    customer?: {
      name: string;
    };
    senderName: string;
    merchantTxRef: string;        // Your unique reference (accountRef)
    orderReference: string;       // Nomba's order reference
    timeCreated: string;          // ISO 8601
    paymentMethod: string;        // "transfer", "card", etc.
  };
}

// --- Transaction Verification ---
export interface NombaTransactionData {
  id: string;
  status: string;       // "SUCCESS" | "PENDING_BILLING" | "NEW"
  amount: number;
  currency: string;
  timeCreated: string;
  orderReference: string;
}

// --- Provider Interface ---
export interface NombaProvider {
  /**
   * Authenticate with Nomba and return an access token.
   * Mock: returns a fake token immediately.
   * Live: calls POST /v1/auth/token/issue with client credentials.
   */
  authenticate(): Promise<string>;

  /**
   * Create a virtual account (NUBAN) for a student.
   * Mock: generates a deterministic 939-prefix account number.
   * Live: calls POST /v1/accounts/virtual.
   */
  createVirtualAccount(
    request: NombaCreateAccountRequest
  ): Promise<NombaResponse<NombaVirtualAccountData>>;

  /**
   * Verify a transaction server-side after receiving a webhook.
   * Mock: always returns SUCCESS.
   * Live: calls GET /v1/transactions/accounts/single?orderReference=<ref>
   */
  verifyTransaction(
    orderReference: string
  ): Promise<NombaResponse<NombaTransactionData>>;

  /**
   * Verify the HMAC-SHA256 signature of an incoming webhook.
   * Mock: accepts all signatures (or validates against mock secret).
   * Live: validates against NOMBA_WEBHOOK_SECRET.
   */
  verifyWebhookSignature(
    rawBody: string,
    signature: string,
    timestamp: string
  ): boolean;
}
