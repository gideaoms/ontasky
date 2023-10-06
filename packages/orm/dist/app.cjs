"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  BaseModel: () => import_BaseModel.BaseModel,
  ModelPaginator: () => import_Paginator.ModelPaginator,
  SnakeCaseNamingStrategy: () => import_SnakeCase.SnakeCaseNamingStrategy,
  scope: () => import_scope.scope
});
module.exports = __toCommonJS(app_exports);
var import_BaseModel = require("@adonisjs/lucid/build/src/Orm/BaseModel");
var import_Paginator = require("@adonisjs/lucid/build/src/Orm/Paginator");
var import_SnakeCase = require("@adonisjs/lucid/build/src/Orm/NamingStrategies/SnakeCase");
var import_scope = require("@adonisjs/lucid/build/src/Helpers/scope");
var import_Adapter = require("@adonisjs/lucid/build/src/Orm/Adapter");
var import_database = __toESM(require("@clark/database"), 1);
var import_ioc = require("@clark/ioc");
__reExport(app_exports, require("@adonisjs/lucid/build/src/Orm/Decorators"), module.exports);
import_BaseModel.BaseModel.$adapter = new import_Adapter.Adapter(import_database.default);
import_BaseModel.BaseModel.$container = import_ioc.ioc;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseModel,
  ModelPaginator,
  SnakeCaseNamingStrategy,
  scope,
  ...require("@adonisjs/lucid/build/src/Orm/Decorators")
});
