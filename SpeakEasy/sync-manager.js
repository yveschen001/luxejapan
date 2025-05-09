class SyncManager {
  constructor() {
    this.setupSync();
  }

  async setupSync() {
    // 设置同步
    await this.syncSettings();
    // 历史记录同步
    await this.syncHistory();
    // 书签同步
    await this.syncBookmarks();
  }
} 