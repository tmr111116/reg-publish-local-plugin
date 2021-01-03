"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalPublisherPlugin = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const reg_suit_util_1 = require("reg-suit-util");
class LocalPublisherPlugin extends reg_suit_util_1.AbstractPublisher {
    constructor() {
        super();
    }
    init(options) {
        this.noEmit = options.noEmit;
        this.logger = options.logger;
        this._options = options;
    }
    fetch(key) {
        return this.fetchInternal(key);
    }
    publish(key) {
        return this.publishInternal(key).then(_ => {
            const reportUrl = `http://localhost:8080/${key}`;
            return { reportUrl };
        });
    }
    getBucketRootDir() {
        return undefined;
    }
    getWorkingDirs() {
        return this._options.workingDirs;
    }
    getLocalGlobPattern() {
        return undefined;
    }
    getPluginDir() {
        return `tmp/reg-publish-local`;
    }
    listItems(_, prefix) {
        return new Promise(async (resolve, _reject) => {
            const dir = `${this.getPluginDir()}/${prefix}`;
            const canAccess = await fs_1.promises.access(dir).then(() => true, _ => false);
            if (!canAccess) {
                return resolve({
                    isTruncated: false,
                    contents: []
                });
            }
            const files = await fs_1.promises.readdir(dir);
            const contents = files.map(key => { return { key }; });
            resolve({
                isTruncated: false,
                contents: contents
            });
        });
    }
    getBucketName() {
        return '~~bucket unused~~';
    }
    downloadItem(remoteItem, item) {
        const sourcePath = `${this.getPluginDir()}/${remoteItem.remotePath}`;
        this.logger.verbose(`downloadItem: '${sourcePath}' -> '${item.absPath}'`);
        return fs_1.promises.mkdir(path_1.dirname(item.absPath), { recursive: true })
            .then(() => fs_1.promises.copyFile(sourcePath, item.absPath))
            .then(() => item);
    }
    uploadItem(key, item) {
        const destPath = `${this.getPluginDir()}/${key}/${item.path}`;
        this.logger.verbose(`uploadItem: '${item.absPath}' -> '${destPath}'`);
        return fs_1.promises.mkdir(path_1.dirname(destPath), { recursive: true })
            .then(() => fs_1.promises.copyFile(item.absPath, destPath))
            .then(() => item);
    }
}
exports.LocalPublisherPlugin = LocalPublisherPlugin;
