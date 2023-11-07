import {
	Box,
	Checkbox,
	Collapse,
	Container,
	HStack,
	Heading,
	Icon,
	IconButton,
	Text,
} from "@chakra-ui/react"
import { useEffect } from "react"
import { observer, useLocalObservable } from "mobx-react-lite"
import {
	AiFillFileAdd,
	AiFillFileText,
	AiOutlineDownload,
} from "react-icons/ai"

import { StateStorage } from "./storage/StateStorage"

export const App = observer(
	({ stateStorage }: { stateStorage: StateStorage }) => {
		useEffect(() => {
			stateStorage.load()
		}, [stateStorage])

		const appState = useLocalObservable(() => ({
			autoSave: false,
			toggleAutoSave() {
				this.autoSave = !this.autoSave
			},
		}))

		return (
			<Container py={8}>
				<Box
					as="header"
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					mb={2}
				>
					<Heading as="h1">My todo list.</Heading>
					<HStack>
						<IconButton
							aria-label="New file"
							title="New file"
							icon={<Icon as={AiFillFileAdd} />}
							onClick={stateStorage.createNewFile}
						/>
						<IconButton
							aria-label="Open file"
							title="Open file"
							icon={<Icon as={AiFillFileText} />}
							onClick={stateStorage.openFile}
						/>
						<IconButton
							aria-label="Save file"
							title="Save file"
							icon={<Icon as={AiOutlineDownload} />}
							onClick={stateStorage.saveFile}
						/>
					</HStack>
				</Box>
				<Collapse in={Boolean(stateStorage.fileHandle)} animateOpacity>
					{stateStorage.fileHandle && (
						<Box
							display="flex"
							justifyContent="space-between"
							pb={2}
						>
							<Text>{stateStorage.fileHandle.name}</Text>
							<Checkbox
								checked={appState.autoSave}
								onChange={appState.toggleAutoSave}
							>
								Autosave
							</Checkbox>
						</Box>
					)}
				</Collapse>
			</Container>
		)
	},
)

export default App
