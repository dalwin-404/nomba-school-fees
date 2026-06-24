import {
  NombaProvider,
  NombaCreateAccountRequest,
  NombaResponse,
  NombaVirtualAccountData,
  NombaTransactionData,
} from './types';
import { generateMockNuban } from './nuban';
import { NombaApiError } from './errors';
import { logInfo } from '../logger';

export class MockNombaProvider implements NombaProvider {
  private simulateLatency() {
    const latency = parseInt(process.env.NOMBA_MOCK_LATENCY_MS || '200', 10);
    return new Promise((resolve) => setTimeout(resolve, latency));
  }

  private checkOutage() {
    if (process.env.NOMBA_MOCK_OUTAGE === 'true') {
      throw new NombaApiError(503, 'Service temporarily unavailable');
    }
  }

  async authenticate(): Promise<string> {
    await this.simulateLatency();
    this.checkOutage();
    logInfo('nomba-mock', 'Authenticated successfully');
    return 'mock-jwt-token-12345';
  }

  async createVirtualAccount(
    request: NombaCreateAccountRequest
  ): Promise<NombaResponse<NombaVirtualAccountData>> {
    await this.simulateLatency();
    this.checkOutage();

    const bankAccountNumber = generateMockNuban(request.accountRef);

    logInfo('nomba-mock', `Created virtual account for ${request.accountRef}`);

    return {
      code: '00',
      description: 'Success',
      data: {
        createdAt: new Date().toISOString(),
        accountHolderId: 'mock-account-holder-id',
        accountRef: request.accountRef,
        accountName: request.accountName,
        currency: 'NGN',
        bankName: 'Nombank MFB',
        bankAccountNumber,
        bankAccountName: `Nomba/${request.accountName}`,
        callbackUrl: request.callbackUrl || '',
        expired: false,
      },
    };
  }

  async verifyTransaction(
    orderReference: string
  ): Promise<NombaResponse<NombaTransactionData>> {
    await this.simulateLatency();
    this.checkOutage();

    logInfo('nomba-mock', `Verified transaction ${orderReference}`);

    return {
      code: '00',
      description: 'Success',
      data: {
        id: `mock-txn-${Date.now()}`,
        status: 'SUCCESS',
        amount: 50000, // In a real mock, we'd parameterize this or look it up, but SUCCESS is fine for this flow
        currency: 'NGN',
        timeCreated: new Date().toISOString(),
        orderReference,
      },
    };
  }

  verifyWebhookSignature(rawBody: string, signature: string, timestamp: string): boolean {
    // In mock mode, we accept all signatures
    logInfo('nomba-mock', 'Webhook signature verified (mock)');
    return true;
  }
}
