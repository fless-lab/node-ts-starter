import { AsyncLocalStorage } from 'async_hooks';

export class AsyncStorageService {
  private static instance: AsyncStorageService;
  private storage: AsyncLocalStorage<Map<string, any>>;

  private constructor() {
    this.storage = new AsyncLocalStorage();
  }

  public static getInstance(): AsyncStorageService {
    if (!AsyncStorageService.instance) {
      AsyncStorageService.instance = new AsyncStorageService();
    }
    return AsyncStorageService.instance;
  }

  public set(key: string, value: any) {
    const store = this.storage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  public get(key: string): any {
    const store = this.storage.getStore();
    return store ? store.get(key) : undefined;
  }

  public run(callback: () => void, initialValue?: Map<string, any>) {
    this.storage.run(initialValue || new Map(), callback);
  }
}
