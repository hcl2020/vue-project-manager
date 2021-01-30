import * as vscode from 'vscode';
import { NodeDependenciesProvider } from './NodeDependenciesProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('vue-project-manager 扩展已激活');
  let workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath!;

  let disposable = vscode.commands.registerCommand('vue-project-manager.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from Vue Project Manager!');
  });
  context.subscriptions.push(disposable);

  const nodeDependenciesProvider = new NodeDependenciesProvider(workspaceRoot);
  vscode.window.registerTreeDataProvider('projectTreeView', nodeDependenciesProvider);
  vscode.commands.registerCommand('projectTreeView.refreshEntry', () => nodeDependenciesProvider.refresh());
}

export function deactivate() {}
