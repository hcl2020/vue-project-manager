import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function pathExists(p: string): boolean {
  try {
    fs.accessSync(p);
  } catch (err) {
    return false;
  }
  return true;
}

export class NodeDependenciesProvider implements vscode.TreeDataProvider<Dependency> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: Dependency): Promise<Dependency[]> {
    if (!this.workspaceRoot) {
      // vscode.window.showInformationMessage('No dependency in empty workspace');
      return [];
    }

    if (element) {
      return element.resourceUri?.fsPath ? this.getDepsInPackageJson(element.resourceUri?.fsPath) : [];
    } else {
      const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
      if (pathExists(packageJsonPath)) {
        return this.getDepsInPackageJson(packageJsonPath);
      } else {
        // vscode.window.showInformationMessage('Workspace has no package.json');
        return [];
      }
    }
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
    if (pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      const packageDirPath = path.dirname(packageJsonPath);

      const getDeps = (deps: Record<string, string>, isDev = false): Dependency[] => {
        const iconPath = new vscode.ThemeIcon(isDev ? 'github-alt' : 'github');

        return Object.entries(deps).map(
          ([moduleName, version]: [moduleName: string, version: string]): Dependency => {
            let subPackageJsonPath = [
              path.join(this.workspaceRoot, 'node_modules', moduleName, 'package.json'),
              path.join(packageDirPath, 'node_modules', moduleName, 'package.json'),
            ].find((p) => pathExists(p));

            if (subPackageJsonPath) {
              return new Dependency(
                moduleName,
                version,
                vscode.TreeItemCollapsibleState.Collapsed,
                iconPath,
                vscode.Uri.file(subPackageJsonPath)
              );
            } else {
              return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None, iconPath);
            }
          }
        );
      };

      const deps = getDeps(packageJson.dependencies || {});
      const devDeps = getDeps(packageJson.devDependencies || {}, true);

      return deps.concat(devDeps);
    } else {
      return [];
    }
  }

  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | null | void> = new vscode.EventEmitter<
    Dependency | undefined | null | void
  >();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
    vscode.window.showInformationMessage('已刷新');
  }
}

class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly iconPath?: vscode.ThemeIcon,
    public readonly resourceUri?: vscode.Uri
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.resourceUri?.fsPath;

    if (this.resourceUri) {
      this.command = {
        title: 'this.label',
        command: 'vscode.open',
        arguments: [this.resourceUri],
      };
    }
  }
}
