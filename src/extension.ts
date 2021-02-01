import * as vscode from 'vscode';
import * as path from 'path';
import Module = require('module');
import { NodeDependenciesProvider } from './NodeDependenciesProvider';
import { ProjectTreeDataProvider } from './ProjectTreeDataProvider';

const PROJECT_CONFIG_FILENAME = 'vue.project.config.js';

export function activate(context: vscode.ExtensionContext) {
  let workspaceRootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath!;
  let configFileUri = vscode.Uri.file(path.join(workspaceRootPath, PROJECT_CONFIG_FILENAME));

  let workspaceRequire = Module.createRequire(workspaceRootPath);
  // let workspaceRequire = __non_webpack_require__;

  try {
    var { folders = [] } = workspaceRequire(configFileUri.fsPath);
    let projectTreeDataProvider = new ProjectTreeDataProvider(workspaceRootPath, { folders });
    vscode.window.registerTreeDataProvider('projectTreeView', projectTreeDataProvider);
  } catch (e) {
    vscode.window.showWarningMessage(`缺少配置文件 ${PROJECT_CONFIG_FILENAME}`);
  }

  const nodeDependenciesProvider = new NodeDependenciesProvider(workspaceRootPath);
  vscode.window.registerTreeDataProvider('nodeDependenciesTreeView', nodeDependenciesProvider);
  context.subscriptions.push(
    vscode.commands.registerCommand('vpm.refreshEntry', () => nodeDependenciesProvider.refresh())
  );
}

export function deactivate() {}
