# react-fetching-snippets extension for VS Code

## Features

Allows to easily paste boilerplate code for common data fetching pattern in React.

```typescriptreact
export default function Component() {
  const [data, setData] = useState<DataType | null>(null)

  useEffect(() => {
    fetchData().then(setData)
  }, [])

  ...
```

## TypeScript support

if you're using typescript, boilerplate code will contain type annotation for useState hook

## Commands
`react-fetching-snippets.addFetchFunction` prompts for fetching function name and persists it in workspace storage

`react-fetching-snippets.insertFetch` prompts state variable name and fetching function name, then it inserts boilerplate code


## Extension Settings

* `react-fetching-snippets.useSemicolons` (boolean) whether to use semicolons at the end of lines
