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

  function loadConfig(): IConfig {
    try {
      // TODO: 类型检测
      delete workspaceRequire.cache[configFileUri.fsPath];
      return workspaceRequire(configFileUri.fsPath);
    } catch (e) {
      vscode.window.showWarningMessage(`缺少配置文件 ${PROJECT_CONFIG_FILENAME}`);
    }
    return { folders: [] };
  }

  const config = loadConfig();
  const nodeDependenciesProvider = new NodeDependenciesProvider(workspaceRootPath);
  const projectTreeDataProvider = new ProjectTreeDataProvider(workspaceRootPath, config);

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('nodeDependenciesTreeView', nodeDependenciesProvider),
    vscode.window.registerTreeDataProvider('projectTreeView', projectTreeDataProvider),
    vscode.commands.registerCommand('vpm.refreshProject', () => {
      let config = loadConfig();
      projectTreeDataProvider.refresh(config);
      vscode.window.showInformationMessage('已执行刷新');
    })
  );
}

export function deactivate() {}
