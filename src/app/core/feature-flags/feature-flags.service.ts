import { Injectable, inject, signal } from '@angular/core';

import { RemoteConfigService } from './remote-config.service';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsService {
  private readonly remoteConfig = inject(RemoteConfigService);

  readonly categoriesEnabled = signal(true);

  async load(): Promise<void> {
    try {
      const enabled = await this.remoteConfig.getCategoriesEnabled();
      this.categoriesEnabled.set(enabled);
    } catch (error) {
      console.error('Error cargando Feature Flags:', error);

      // If firebase fails, keep categories enabled.
      this.categoriesEnabled.set(true);
    }
  }
}
