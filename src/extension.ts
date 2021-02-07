import * as vscode from 'vscode';
import * as path from 'path';
import Module = require('module');
import { NodeDependenciesProvider } from './NodeDependenciesProvider';
import { ProjectTreeDataProvider, IConfig } from './ProjectTreeDataProvider';

const PROJECT_CONFIG_FILENAME = 'vue.project.config.js';

export function activate(context: vscode.ExtensionContext) {
  let workspaceRootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath!;
  let configFileUri = vscode.Uri.file(path.join(workspaceRootPath, PROJECT_CONFIG_FILENAME));
  let workspaceRequire = Module.createRequire(workspaceRootPath);
  // let workspaceRequire = __non_webpack_require__;

  function loadConfig(): IConfig | undefined {
    try {
      // TODO: 类型检测
      delete workspaceRequire.cache[configFileUri.fsPath];
      return workspaceRequire(configFileUri.fsPath);
    } catch (e) {
      console.log(e.message);
    }
  }

  const config = loadConfig();
  const nodeDependenciesProvider = new NodeDependenciesProvider(workspaceRootPath);
  const projectTreeDataProvider = new ProjectTreeDataProvider(workspaceRootPath, config || { folders: [] });

  let refreshProject = function refreshProject() {
    let config = loadConfig();
    if (config) {
      projectTreeDataProvider.refresh(config);
      vscode.window.showInformationMessage('已执行刷新');
    } else {
      vscode.window.showWarningMessage(`缺少配置文件 ${PROJECT_CONFIG_FILENAME}`);
    }
  };

  let createConfigFile = async function createConfigFile() {
    try {
      await vscode.workspace.fs.readFile(configFileUri); // TODO: 解析验证配置
      console.warn('配置文件已经存在');
    } catch (e) {
      let fileContent = `
module.exports = {
  folders: [
    { name: 'Root', path: '.' }
  ]
};`;
      await vscode.workspace.fs.writeFile(configFileUri, Buffer.from(fileContent, 'utf8'));
    }
    refreshProject();
  };

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('nodeDependenciesTreeView', nodeDependenciesProvider),
    vscode.window.registerTreeDataProvider('projectTreeView', projectTreeDataProvider),
    vscode.commands.registerCommand('vpm.refreshProject', refreshProject),
    vscode.commands.registerCommand('vpm.createConfigFile', createConfigFile)
  );
}

export function deactivate() {}
