import { Injectable, inject } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class RemoteConfigService {
  private readonly platform = inject(Platform);

  async getCategoriesEnabled(): Promise<boolean> {

    await this.platform.ready();

    if (typeof FirebasexConfig === 'undefined') {
      throw new Error('Firebase Remote Config no está disponible.');
    }

    // Original local params
    await new Promise<void>((resolve, reject) => {
      FirebasexConfig.setDefaults({ categories_enabled: true }, resolve, reject);
    });

    // Settings for different tests
    await new Promise<void>((resolve, reject) => {
      FirebasexConfig.setConfigSettings(10, 0, resolve, reject);
    });

    // Get and activate the remote values.
    await new Promise<void>((resolve, reject) => {
      FirebasexConfig.fetchAndActivate(() => resolve(), reject);
    });

    // Consult the parameter.
    const value = await new Promise<string>((resolve, reject) => {
      FirebasexConfig.getValue('categories_enabled', resolve, reject);
    });

    return value.trim().toLowerCase() === 'true';
  }
}
