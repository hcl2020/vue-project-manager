<p>
  <h1 align="center">Vue Project Manager 项目管理器</h1>
</p>

<p align="center">
  <a href="https://github.com/hcl2020/vue-project-manager">
    <img src="https://img.shields.io/github/issues/hcl2020/vue-project-manager?color=06c&logo=github&logoColor=white&style=flat-square">
  </a>
 
  <a href="https://marketplace.visualstudio.com/items?itemName=hcl2020.vue-project-manager">
    <img src="https://vsmarketplacebadge.apphb.com/version-short/hcl2020.vue-project-manager.svg?style=flat-square&color=06c">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=hcl2020.vue-project-manager">
    <img src="https://vsmarketplacebadge.apphb.com/installs-short/hcl2020.vue-project-manager.svg?style=flat-square&color=06c">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=hcl2020.vue-project-manager">
    <img src="https://vsmarketplacebadge.apphb.com/rating-star/hcl2020.vue-project-manager.svg?style=flat-square&color=06c">
  </a>
  <br>
</p>

Vue Project tooling for VS Code.

用于辅助管理具有大量组件、子项目、子模块和深层次目录结构的大型项目。在不重构原有项目的前提下重新组织文件目录结构，方便开发时快速查找和跳转代码。

## Features 功能

- 自定义项目视图 ❌
  - 自定义虚拟目录结构 ✔️
  - 文件实时筛选过滤 ❌
  - 自定义文件名格式 ❌
  - 文件名前缀分组 ❌
- node_modules 管理 ❌
  - 展示依赖树, 跳转对应package.json ✔️
  - 依赖管理(安装/卸载/检查/更新) ❌
- Vue 组件快速跳转/补全 ❌
  - css ❌
  - className ❌
  - components ❌
  - assets ❌
- 项目目标进度管理 ❌

## Extension Settings 设置

在项目根目录增加配置文件 `vue.project.config.js`

```javascript
module.exports = {
  folders: [
    { name: 'Root', path: '.' },
    {
      name: 'Pages',
      folders: ['cms', 'live', 'user'].map((name) => ({
        name,
        path: `src/Pages/${name}`,
        folders: [{ name: 'PageComponents', path: `src/PageComponents/${name}` }],
      })),
    },
  ],
};
```

## Known Issues

See [Issues](https://github.com/hcl2020/vue-project-manager/issues).

## Release Notes

See [Release](https://github.com/hcl2020/vue-project-manager/releases)

### 0.0.1

Initial release of Alpha.

### 0.0.2

Initial release of Beta.

### 0.1.2

Initial release of Beta.2
