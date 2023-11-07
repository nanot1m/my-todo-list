import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import React from "react"
import ReactDOM from "react-dom/client"

import App from "./App.tsx"
import { createStorageManager } from "./storage/index.ts"
import { localStorageProvider } from "./storage/local-storage.ts"
import { StateStorage } from "./storage/state-storage.ts"

const root = document.getElementById("root")
if (!root) {
	throw new Error("No root element")
}

const reactRoot = ReactDOM.createRoot(root)

const storageManager = createStorageManager(localStorageProvider)

const customTheme = extendTheme({
	config: {
		useSystemColorMode: true,
	},
})

reactRoot.render(
	<React.StrictMode>
		<ChakraProvider theme={customTheme}>
			<App stateStorage={new StateStorage(storageManager)} />
		</ChakraProvider>
	</React.StrictMode>,
)
