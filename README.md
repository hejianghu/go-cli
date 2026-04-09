# Go CLI

一个用于管理和快速跳转到常用项目目录的 CLI 工具。支持 Windows（PowerShell） 和 Mac/Linux（zsh+bash） 系统。

## 功能

| 命令 | 功能 |
|------|------|
| `go watch [path]` | 记录路径，默认当前目录 |
| `go <keyword>` | 搜索并跳转 |
| `go list` | 查看所有记录 |
| `go remove <keyword>` | 删除匹配路径（需确认） |
| `go clear` | 清空所有记录（需确认） |

## 安装

```bash
npm install -g go-cli
```

### Shell 配置

由于 Node.js 无法直接改变父终端的工作目录，需要配置 shell wrapper。

**Bash (Mac/Linux)**：
```bash
echo 'eval "$(go-cli init bash)"' >> ~/.bashrc
source ~/.bashrc
```

**Zsh (Mac/Linux)**：
```bash
echo 'eval "$(go-cli init zsh)"' >> ~/.zshrc
source ~/.zshrc
```

**PowerShell (Windows)**：
```powershell
go-cli init powershell | Out-File -Append $PROFILE
. $PROFILE
```

## 使用

```bash
# 记录路径
go watch                    # 当前目录
go watch /path/to/project   # 指定目录
go watch .\src              # 相对路径

# 跳转
go uni                      # 搜索包含 "uni" 的路径并跳转

# 管理记录
go list                     # 查看所有
go remove uni               # 删除匹配项
go clear                    # 清空所有
```

## 数据存储

路径记录存储在 `~/.go-cli/paths.json`

## License

MIT