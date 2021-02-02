import { TreeDataProvider, TreeItem, TreeItemCollapsibleState, Uri, workspace, FileType, EventEmitter } from 'vscode';

export interface IConfig {
  folders: IConfigFolder[];
}

interface IConfigFolder {
  name: string;
  path?: string;
  folders?: IConfigFolder[];
}

interface IElement {
  name: string;
  tooltip: string;
  hasChildren: boolean;
  resourceUri?: Uri;
  children?: IConfigFolder[];
}

export class ProjectTreeDataProvider implements TreeDataProvider<IElement> {
  // onDidChangeTreeData?: Event<T | undefined | null | void>;
  // getTreeItem(element: T): TreeItem | Thenable<TreeItem>;
  // getChildren(element?: T): ProviderResult<T[]>;
  // getParent?(element: T): ProviderResult<T>;
  // resolveTreeItem?(item: TreeItem, element: T): ProviderResult<TreeItem>;

  constructor(private rootPath: string, private config: IConfig) {}

  refreshEvent = new EventEmitter<IElement | undefined | null | void>();
  onDidChangeTreeData = this.refreshEvent.event;

  refresh(config: IConfig): void {
    this.config = config;
    this.refreshEvent.fire();
  }

  async getChildren(element?: IElement): Promise<IElement[]> {
    let realFiles = element?.resourceUri
      ? (await this.loadDirectory(element.resourceUri)).map(({ name, resourceUri, hasChildren }) => ({
          name,
          resourceUri,
          hasChildren,
          tooltip: name,
        }))
      : [];

    let children = (element ? element.children : this.config.folders) || [];

    let virtualFiles = children.map(({ name, ...item }) => {
      return {
        name,
        hasChildren: true,
        tooltip: name,
        children: item.folders || [],
        ...(item.path ? { resourceUri: Uri.joinPath(Uri.file(this.rootPath), item.path) } : {}),
      };
    });
    return [...virtualFiles, ...realFiles];
  }

  private async loadDirectory(dirUri: Uri) {
    return workspace.fs.readDirectory(dirUri).then((direntArray) =>
      direntArray
        .map(([name, fileType]) => ({
          name,
          resourceUri: Uri.joinPath(dirUri, name),
          hasChildren: fileType !== FileType.File,
        }))
        .sort((a, b) => {
          if (a.hasChildren === b.hasChildren) {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name > b.name ? 1 : -1;
          } else {
            return b.hasChildren ? 1 : -1;
          }
        })
    );
  }

  async getTreeItem(element: IElement) {
    let item = new ProjectTreeItem(
      element.resourceUri || element.name,
      element.hasChildren ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None
    );
    item.label = element.name;
    item.tooltip = element.tooltip;
    if (!element.hasChildren) {
      item.command = {
        title: 'this.label',
        command: 'vscode.open',
        arguments: [element.resourceUri],
      };
    }
    return item;
  }
}

export class ProjectTreeItem extends TreeItem {
  constructor(resourceUri: Uri | string, collapsibleState?: TreeItemCollapsibleState) {
    if (typeof resourceUri === 'string') {
      super(resourceUri, collapsibleState);
    } else {
      super(resourceUri, collapsibleState);
    }
    // this.contextValue = 'folder';
  }
}
