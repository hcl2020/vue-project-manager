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

## Features

- 自定义项目视图 ❌
  - 自定义虚拟目录结构 ✔️
  - 自定义文件名格式 ❌
  - 文件名前缀分组 ❌
- node_modules 依赖管理/跳转 ❌
- Vue 组件快速跳转/补全 ❌
  - css ❌
  - className ❌
  - components ❌
  - assets ❌
- 项目目标进度管理 ❌

## Extension Settings

Example `vue.project.config.js`

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
