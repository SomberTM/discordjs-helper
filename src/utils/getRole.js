"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRole = void 0;
var isID_1 = require("./isID");
function getRole(access, guild, query) {
    switch (access.toLowerCase()) {
        case ('id'):
            return isID_1.isID(query) ? guild.roles.cache.find(function (role) { return role.id == query; }) : undefined;
        case ('name'):
            return guild.roles.cache.find(function (role) { return role.name == query; });
    }
}
exports.getRole = getRole;
