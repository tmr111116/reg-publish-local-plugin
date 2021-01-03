import { PublisherPluginFactory } from "reg-suit-interface";
import { LocalPublisherPlugin } from "./local-publisher-plugin";

const pluginFactory: PublisherPluginFactory = () => {
  return {
    publisher: new LocalPublisherPlugin()
  };
};

export = pluginFactory;
