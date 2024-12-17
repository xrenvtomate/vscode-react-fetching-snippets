import * as vscode from "vscode"

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("react-fetching-snippets")
  const useSemicolons = config.get<boolean>("useSemicolons") ?? false

  let insertBoilerplateCommand = vscode.commands.registerCommand(
    "react-fetching-snippets.insertFetch",
    async () => {
      const stateName = await vscode.window.showInputBox({
        placeHolder: "Enter the state variable name",
      })
      if (!stateName) {
        vscode.window.showErrorMessage("No state name provided")
        return
      }

      const savedFunctions =
        context.workspaceState.get<Array<string>>("snippetFunctions") || []
      const selectedFunction = await vscode.window.showQuickPick(
        ["None", ...savedFunctions],
        {
          placeHolder: "Select the function to use for fetching data",
        }
      )
      if (!stateName) {
        vscode.window.showErrorMessage("No fetching function provided")
        return
      }

      insertBoilerplate(
        stateName,
        useSemicolons,
        selectedFunction === "None" ? undefined : selectedFunction
      )
    }
  )

  let insertBoilerplateWithFunctionCommand = vscode.commands.registerCommand(
    "react-fetching-snippets.addFetchFunction",
    async () => {
      const functionName = await vscode.window.showInputBox({
        placeHolder: "Enter the function name",
      })
      if (!functionName) {
        return
      }
      let savedFunctions =
        context.workspaceState.get<Array<string>>("snippetFunctions") || []
      savedFunctions.push(functionName)
      context.workspaceState.update("snippetFunctions", savedFunctions)
    }
  )

  context.subscriptions.push(
    insertBoilerplateCommand,
    insertBoilerplateWithFunctionCommand
  )
}

function insertBoilerplate(
  stateName: string,
  useSemicolons: boolean,
  functionName?: string
) {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showErrorMessage("No active editor")
    return
  }
  const languageId = editor.document.languageId
  if (
    ![
      "javascript",
      "typescript",
      "javascriptreact",
      "typescriptreact",
    ].includes(languageId)
  ) {
    vscode.window.showErrorMessage("The extension only works for react code")
  }

  const isTypeScript = languageId === "typescriptreact"

  const insertText = `
  const [${stateName}, set${
    stateName.charAt(0).toUpperCase() + stateName.slice(1)
  }] = useState${isTypeScript ? "<any | null>" : ""}(null)${
    useSemicolons ? ";" : ""
  }
  
  useEffect(() => {
    ${
      functionName
        ? `${functionName}().then(set${
            stateName.charAt(0).toUpperCase() + stateName.slice(1)
          })${useSemicolons ? ";" : ""}`
        : "//"
    }
  }, [])${useSemicolons ? ";" : ""}
`

  editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, insertText)
  })
}

export function deactivate() {}
