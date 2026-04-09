# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 构建/测试命令

```bash
npm test                # 运行所有测试
npm test -- --coverage  # 运行测试并生成覆盖率报告
```

注意：Jest 需要 `--experimental-vm-modules` 标志，因为本项目使用 ES Modules（package.json 中 `"type": "module"`）。

## 架构

这是一个用于收藏目录并快速跳转的 CLI 工具。核心设计：Node.js 无法改变父 shell 的工作目录，因此使用 shell wrapper 函数。

**Shell wrapper 模式（关键）**：
- 用户运行 `go <keyword>` → shell 函数拦截
- Shell 调用 `go-cli jump <keyword>` → 路径输出到 stdout，UI 输出到 stderr
- Shell 读取 stdout 并执行 `cd <path>`
- 预留命令（watch、list、remove、clear、init）直接传递给 go-cli
- Wrapper 脚本嵌入在 `src/commands/init.js` 中（BASH_SCRIPT、ZSH_SCRIPT、POWERSHELL_SCRIPT）

**入口文件**：
- `bin/go-cli.js` - CLI 入口，Commander 程序配置
- `src/index.js` - 导出所有命令（供编程式使用）

**命令流程**：
- `src/commands/` 中的命令是薄封装，调用 utils 完成实际工作
- `src/utils/storage.js` - 管理 `~/.go-cli/paths.json`（创建/读取/写入）
- `src/utils/search.js` - Fuse.js 模糊搜索 + 精确匹配辅助函数
- 交互式命令（jump、remove、clear）使用 `inquirer` 进行用户交互

**Jump 命令的 stdout/stderr 分离**：
- `jump` 仅将选中的路径输出到 stdout（供 shell wrapper 捕获）
- 所有用户界面（inquirer 提示、信息消息）输出到 stderr
- 这使得 shell wrapper 可以：`target=$(go-cli jump "$1" 2>/dev/null)` 仅捕获 stdout

## 数据存储

路径存储在 `~/.go-cli/paths.json`，格式为 `{path: string, addedAt: string}` 数组。测试中使用 `setStorageDir()` 可覆盖存储位置。