import chalk from 'chalk';

const BASH_SCRIPT = `
# go-cli initialization for Bash/Zsh
function go() {
  case "$1" in
    watch|list|remove|clear|init|--help|-h|--version|-V)
      go-cli "$@"
      ;;
    "")
      go-cli --help
      ;;
    *)
      local target=$(go-cli jump "$1" 2>/dev/null)
      if [ -n "$target" ]; then
        cd "$target"
      fi
      ;;
  esac
}

# Add go-cli completion (optional)
if [ -n "\${BASH_VERSION}" ]; then
  complete -F _go_completion go
  function _go_completion() {
    local cur="\${COMP_WORDS[COMP_CWORD]}"
    if [ "\${COMP_CWORD}" -eq 1 ]; then
      COMPREPLY=(\$(compgen -W "watch list remove clear init" -- "\${cur}"))
    fi
  }
fi
`;

const ZSH_SCRIPT = `
# go-cli initialization for Zsh
function go() {
  case "$1" in
    watch|list|remove|clear|init|--help|-h|--version|-V)
      go-cli "$@"
      ;;
    "")
      go-cli --help
      ;;
    *)
      local target=$(go-cli jump "$1" 2>/dev/null)
      if [ -n "$target" ]; then
        cd "$target"
      fi
      ;;
  esac
}

# Zsh completion
compdef _go go
function _go() {
  local -a commands
  commands=(
    'watch:Record a directory path'
    'list:List all recorded paths'
    'remove:Remove paths matching keyword'
    'clear:Clear all recorded paths'
    'init:Output shell initialization script'
  )
  _describe 'command' commands
}
`;

const POWERSHELL_SCRIPT = `
# go-cli initialization for PowerShell
function go {
  param(
    [Parameter(ValueFromRemainingArguments)]
    [string[]]$CmdArgs
  )

  $reservedCommands = @('watch', 'list', 'remove', 'clear', 'init', '--help', '-h', '--version', '-V')

  if ($CmdArgs.Count -eq 0) {
    go-cli --help
    return
  }

  if ($reservedCommands -contains $CmdArgs[0]) {
    go-cli @CmdArgs
    return
  }

  # Jump to path - don't suppress stderr (inquirer uses it for UI)
  # Capture stdout only (the selected path)
  $output = go-cli jump $CmdArgs[0] | Out-String
  $target = $output.Trim()
  if ($target -and (Test-Path $target)) {
    Set-Location $target
  }
}

# PowerShell completion (optional)
Register-ArgumentCompleter -CommandName go -ScriptBlock {
  param($wordToComplete, $commandAst, $cursorPosition)
  $commands = @('watch', 'list', 'remove', 'clear', 'init')
  $commands | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
  }
}
`;

/**
 * Init command - output shell initialization script
 * @param {string} [shell] - Shell type: bash, zsh, powershell
 */
export default function init(shell) {
  if (!shell) {
    console.log(chalk.gray('\nUsage: go init <shell>'));
    console.log(chalk.gray('\nSupported shells:'));
    console.log(chalk.cyan('  bash      ') + chalk.gray('Initialize for Bash'));
    console.log(chalk.cyan('  zsh       ') + chalk.gray('Initialize for Zsh'));
    console.log(chalk.cyan('  powershell') + chalk.gray('Initialize for PowerShell'));
    console.log(chalk.gray('\nExample:'));
    console.log(chalk.gray('  Add to ~/.bashrc: eval "$(go init bash)"'));
    console.log(chalk.gray('  Add to ~/.zshrc:  eval "$(go init zsh)"'));
    console.log(chalk.gray('  Add to $PROFILE:  go init powershell | Out-File -Append $PROFILE'));
    return;
  }

  switch (shell.toLowerCase()) {
    case 'bash':
      console.log(BASH_SCRIPT.trim());
      break;
    case 'zsh':
      console.log(ZSH_SCRIPT.trim());
      break;
    case 'powershell':
      console.log(POWERSHELL_SCRIPT.trim());
      break;
    default:
      console.log(chalk.yellow(`Unknown shell: ${shell}`));
      console.log(chalk.gray('Supported: bash, zsh, powershell'));
  }
}