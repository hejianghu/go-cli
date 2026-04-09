# go-cli wrapper for PowerShell
# Usage: Add this to your PowerShell profile ($PROFILE)
#   . C:\path\to\go-cli.ps1
# Or run: go init powershell | Out-File -Append $PROFILE

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

# PowerShell completion
Register-ArgumentCompleter -CommandName go -ScriptBlock {
  param($wordToComplete, $commandAst, $cursorPosition)
  $commands = @('watch', 'list', 'remove', 'clear', 'init')
  $commands | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
  }
}