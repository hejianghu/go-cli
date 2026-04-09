#!/bin/bash
# go-cli wrapper for Bash/Zsh
# Usage: Source this file in your shell config (~/.bashrc or ~/.zshrc)
#   source /path/to/go-cli.sh
# Or add this line:
#   eval "$(go-cli init bash)"

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

# Bash completion
if [ -n "${BASH_VERSION}" ]; then
  complete -F _go_completion go
  function _go_completion() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    if [ "${COMP_CWORD}" -eq 1 ]; then
      COMPREPLY=($(compgen -W "watch list remove clear init" -- "${cur}"))
    fi
  }
fi

# Zsh completion (when sourced in zsh)
if [ -n "${ZSH_VERSION}" ]; then
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
fi