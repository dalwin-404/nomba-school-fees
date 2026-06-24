import {
  NombaProvider,
  NombaCreateAccountRequest,
  NombaResponse,
  NombaVirtualAccountData,
  NombaTransactionData,
} from './types';
import { NombaApiError } from './errors';
import { logInfo, logError } from '../logger';
import { createHmac } from 'crypto';

export class LiveNombaProvider implements NombaProvider {
  private baseUrl = process.env.NOMBA_BASE_URL!;
  private accountId = process.env.NOMBA_ACCOUNT_ID!;
  private subAccountId = process.env.NOMBA_SUB_ACCOUNT_ID!;
  private clientId = process.env.NOMBA_CLIENT_ID!;
  private clientSecret = process.env.NOMBA_CLIENT_SECRET!;
  private webhookSecret = process.env.NOMBA_WEBHOOK_SECRET!;

  private tokenCache: {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  } | null = null;

  async authenticate(): Promise<string> {
    if (this.tokenCache) {
      const bufferMs = 5 * 60 * 1000;
      if (this.tokenCache.expiresAt.getTime() - Date.now() > bufferMs) {
        return this.tokenCache.accessToken;
      }
    }
    return await this.issueToken();
  }

  private async issueToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/token/issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accountId': this.accountId,
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    const json = await response.json();
    if (json.code !== '00') {
      throw new NombaApiError(response.status, json.description || 'Failed to authenticate');
    }

    this.tokenCache = {
      accessToken: json.data.access_token,
      refreshToken: json.data.refresh_token,
      expiresAt: new Date(json.data.expiresAt),
    };

    logInfo('nomba-live', 'Token issued', { expiresAt: json.data.expiresAt });

    return json.data.access_token;
  }

  async createVirtualAccount(
    request: NombaCreateAccountRequest
  ): Promise<NombaResponse<NombaVirtualAccountData>> {
    const token = await this.authenticate();

    const response = await fetch(`${this.baseUrl}/accounts/virtual`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accountId': this.subAccountId || this.accountId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const json = await response.json();
    if (json.code !== '00') {
      logError('nomba-live', 'Create virtual account failed', { response: json });
      throw new NombaApiError(response.status, json.description || 'Failed to create virtual account');
    }

    return json;
  }

  async verifyTransaction(
    orderReference: string
  ): Promise<NombaResponse<NombaTransactionData>> {
    const token = await this.authenticate();

    const response = await fetch(`${this.baseUrl}/transactions/accounts/single?orderReference=${orderReference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accountId': this.subAccountId || this.accountId,
      },
    });

    const json = await response.json();
    if (json.code !== '00') {
      logError('nomba-live', 'Verify transaction failed', { response: json });
      throw new NombaApiError(response.status, json.description || 'Failed to verify transaction');
    }

    return json;
  }

  verifyWebhookSignature(rawBody: string, signature: string, timestamp: string): boolean {
    try {
      const hash = createHmac('sha256', this.webhookSecret).update(rawBody).digest('hex');
      return hash === signature;
    } catch (e) {
      logError('nomba-live', 'Webhook signature verification threw an error', { error: String(e) });
      return false;
    }
  }
}
