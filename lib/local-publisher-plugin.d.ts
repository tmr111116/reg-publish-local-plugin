import { PluginCreateOptions, PublisherPlugin } from "reg-suit-interface";
import { AbstractPublisher, FileItem, ObjectListResult, RemoteFileItem } from "reg-suit-util";
export interface PluginConfig {
}
export declare class LocalPublisherPlugin extends AbstractPublisher implements PublisherPlugin<PluginConfig> {
    private _options;
    constructor();
    init(options: PluginCreateOptions<PluginConfig>): void;
    fetch(key: string): Promise<any>;
    publish(key: string): Promise<{
        reportUrl: string;
    }>;
    protected getBucketRootDir(): undefined;
    protected getWorkingDirs(): import("reg-suit-interface").WorkingDirectoryInfo;
    protected getLocalGlobPattern(): undefined;
    getPluginDir(): string;
    protected listItems(_: string, prefix: string): Promise<ObjectListResult>;
    protected getBucketName(): string;
    protected downloadItem(remoteItem: RemoteFileItem, item: FileItem): Promise<FileItem>;
    protected uploadItem(key: string, item: FileItem): Promise<FileItem>;
}
