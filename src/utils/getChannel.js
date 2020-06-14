"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannel = void 0;
var isID_1 = require("./isID");
function getChannel(access, guild, query) {
    switch (access.toLowerCase()) {
        case 'id':
            return isID_1.isID(query) ? guild.channels.cache.find(function (channel) { return channel.id == query; }) : undefined;
        case 'name':
            return guild.channels.cache.find(function (channel) { return channel.name == query; });
    }
}
exports.getChannel = getChannel;
