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
import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react"
import {
	AiFillFileAdd,
	AiFillFileText,
	AiOutlineDownload,
} from "react-icons/ai"

import { StateStorage } from "./storage/state-storage"

const Header = ({ stateStorage }: { stateStorage: StateStorage }) => {
	return (
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
	)
}

export const AutoSaveToggle = observer(
	({ stateStorage }: { stateStorage: StateStorage }) => {
		const [autoSave, setAutoSave] = useState(false)

		return (
			<Collapse in={Boolean(stateStorage.fileHandle)} animateOpacity>
				{stateStorage.fileHandle && (
					<Box display="flex" justifyContent="space-between" pb={2}>
						<Text>{stateStorage.fileHandle.name}</Text>
						<Checkbox
							checked={autoSave}
							onChange={(e) =>
								setAutoSave(e.currentTarget.checked)
							}
						>
							Autosave
						</Checkbox>
					</Box>
				)}
			</Collapse>
		)
	},
)

export const App = observer(
	({ stateStorage }: { stateStorage: StateStorage }) => {
		useEffect(() => {
			stateStorage.load()
		}, [stateStorage])

		return (
			<Container py={8}>
				<Header stateStorage={stateStorage} />
				<AutoSaveToggle stateStorage={stateStorage} />
			</Container>
		)
	},
)

export default App
