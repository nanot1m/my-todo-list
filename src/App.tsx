import { Container, Heading } from "@chakra-ui/react"
import { StateStorage } from "./storage"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"

export const App = observer(
	({ stateStorage }: { stateStorage: StateStorage }) => {
		useEffect(() => {
			stateStorage.restoreFromFile()
		}, [stateStorage])

		return (
			<Container maxW="container.md">
				<Heading as="h2">{stateStorage.status}</Heading>
				{stateStorage.state && stateStorage.state.version}
			</Container>
		)
	},
)

export default App
