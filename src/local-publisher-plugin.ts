import { promises as fs } from "fs";
import { dirname } from "path";
import { PluginCreateOptions, PublisherPlugin } from "reg-suit-interface";
import { AbstractPublisher, FileItem, ObjectListResult, RemoteFileItem } from "reg-suit-util";

export interface PluginConfig {

}

export class LocalPublisherPlugin extends AbstractPublisher implements PublisherPlugin<PluginConfig> {
  private _options!: PluginCreateOptions<PluginConfig>;

  constructor() {
    super();
  }

  init(options: PluginCreateOptions<PluginConfig>) {
    this.noEmit = options.noEmit;
    this.logger = options.logger;
    this._options = options;
  }

  fetch(key: string) {
    return this.fetchInternal(key);
  }

  publish(key: string) {
    return this.publishInternal(key).then(_ => {
      const reportUrl = `http://localhost:8080/${key}`
      return {reportUrl}
    })
  }

  protected getBucketRootDir() {
    return undefined;
  }

  protected getWorkingDirs() {
    return this._options.workingDirs;
  }

  protected getLocalGlobPattern() {
    return undefined;
  }

  getPluginDir() {
    return `tmp/reg-publish-local`
  }

  protected listItems(_: string, prefix: string): Promise<ObjectListResult> {
    return new Promise(async (resolve, _reject) => {
      const dir = `${this.getPluginDir()}/${prefix}`
      const canAccess = await fs.access(dir).then(() => true, _ => false)
      if (!canAccess) {
        return resolve({
          isTruncated: false,
          contents: []
        });
      }

      const files = await fs.readdir(dir)
      const contents = files.map(key => { return { key }});
      resolve({
        isTruncated: false,
        contents: contents
      });
    })
  }

  protected getBucketName() {
    return '~~bucket unused~~'
  }

  protected downloadItem(remoteItem: RemoteFileItem, item: FileItem): Promise<FileItem> {
    const sourcePath = `${this.getPluginDir()}/${remoteItem.remotePath}`
    this.logger.verbose(`downloadItem: '${sourcePath}' -> '${item.absPath}'`);
    return fs.mkdir(dirname(item.absPath), { recursive: true })
      .then(() => fs.copyFile(sourcePath, item.absPath))
      .then(() => item)
  }

  protected uploadItem(key: string, item: FileItem): Promise<FileItem> {
    const destPath = `${this.getPluginDir()}/${key}/${item.path}`
    this.logger.verbose(`uploadItem: '${item.absPath}' -> '${destPath}'`);
    return fs.mkdir(dirname(destPath), { recursive: true })
      .then(() => fs.copyFile(item.absPath, destPath))
      .then(() => item)
  }
}
