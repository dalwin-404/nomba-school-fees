import { NombaProvider } from './types';
import { MockNombaProvider } from './mock-provider';
import { LiveNombaProvider } from './live-provider';

let providerInstance: NombaProvider | null = null;

export function getNombaProvider(): NombaProvider {
  if (providerInstance) {
    return providerInstance;
  }

  if (process.env.NOMBA_PROVIDER === 'live') {
    providerInstance = new LiveNombaProvider();
  } else {
    providerInstance = new MockNombaProvider();
  }

  return providerInstance;
}
