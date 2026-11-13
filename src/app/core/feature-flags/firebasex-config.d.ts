interface FirebasexConfig {
  setDefaults(defaults: object, success: () => void, error: (err: string) => void): void;

  setConfigSettings(
    fetchTimeout: number,
    minimumFetchInterval: number,
    success: () => void,
    error: (err: string) => void,
  ): void;

  fetchAndActivate(success: (activated: boolean) => void, error: (err: string) => void): void;

  getValue(key: string, success: (value: string) => void, error: (err: string) => void): void;
}

declare const FirebasexConfig: FirebasexConfig;
