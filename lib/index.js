"use strict";
const local_publisher_plugin_1 = require("./local-publisher-plugin");
const pluginFactory = () => {
    return {
        publisher: new local_publisher_plugin_1.LocalPublisherPlugin()
    };
};
module.exports = pluginFactory;
