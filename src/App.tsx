import {
	Box,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Checkbox,
	Collapse,
	Container,
	HStack,
	Heading,
	Icon,
	IconButton,
	Input,
	Text,
	Textarea,
} from "@chakra-ui/react"
import { autorun } from "mobx"
import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react"
import {
	AiFillFileAdd,
	AiFillFileText,
	AiOutlineCheck,
	AiOutlineClose,
	AiOutlineDownload,
	AiOutlineEdit,
	AiOutlinePlus,
} from "react-icons/ai"

import { Task } from "./models/Task"
import { TaskList } from "./models/TaskList"
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

		useEffect(() => {
			if (autoSave && stateStorage.fileHandle) {
				return autorun(() => {
					stateStorage.saveFile()
				})
			}
		}, [autoSave, stateStorage])

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

export const TaskEditView = ({
	task,
	onSubmit,
	onCancel,
}: {
	task?: Task
	onSubmit(data: { title: string; description: string }): void
	onCancel(): void
}) => {
	const [title, setTitle] = useState(task?.title ?? "")
	const [description, setDescription] = useState(task?.description ?? "")

	return (
		<Card>
			<CardHeader>
				<Input
					placeholder="Title"
					defaultValue={task?.title}
					onChange={(e) => {
						setTitle(e.currentTarget.value)
					}}
				/>
			</CardHeader>
			<CardBody>
				<Textarea
					placeholder="Description"
					defaultValue={task?.description}
					onChange={(e) => {
						setDescription(e.currentTarget.value)
					}}
				/>
			</CardBody>
			<CardFooter>
				<HStack>
					<IconButton
						aria-label="Cancel"
						title="Cancel"
						icon={<Icon as={AiOutlineClose} />}
						onClick={onCancel}
					/>
					<IconButton
						aria-label="Save"
						title="Save"
						icon={<Icon as={AiOutlineCheck} />}
						onClick={() => {
							onSubmit({
								title: title.trim(),
								description: description.trim(),
							})
						}}
					/>
				</HStack>
			</CardFooter>
		</Card>
	)
}

export const TaskView = observer(({ task }: { task: Task }) => {
	const [isEditing, setIsEditing] = useState(false)

	if (isEditing) {
		return (
			<TaskEditView
				task={task}
				onSubmit={(data) => {
					task.setTitle(data.title)
					task.setDescription(data.description)
					setIsEditing(false)
				}}
				onCancel={() => {
					setIsEditing(false)
				}}
			/>
		)
	}

	return (
		<Card>
			<CardHeader>{task.title}</CardHeader>
			<CardBody>{task.description}</CardBody>
			<CardFooter>
				<IconButton
					aria-label="Edit task"
					title="Edit task"
					icon={<Icon as={AiOutlineEdit} />}
					onClick={() => setIsEditing(!isEditing)}
				/>
			</CardFooter>
		</Card>
	)
})

export const NewTaskView = observer(({ taskList }: { taskList: TaskList }) => {
	const [isEditing, setIsEditing] = useState(false)

	if (isEditing) {
		return (
			<TaskEditView
				onSubmit={(data) => {
					taskList.createTaskWithTextAndDescription(
						data.title,
						data.description,
					)
					setIsEditing(false)
				}}
				onCancel={() => {
					setIsEditing(false)
				}}
			/>
		)
	}

	return (
		<Card>
			<CardHeader>New task</CardHeader>
			<CardFooter>
				<IconButton
					aria-label="Add task"
					title="Add task"
					icon={<Icon as={AiOutlinePlus} />}
					onClick={() => setIsEditing(!isEditing)}
				/>
			</CardFooter>
		</Card>
	)
})

export const TaskListView = observer(({ taskList }: { taskList: TaskList }) => {
	return (
		<Box display="flex" flexDirection="column" gap={2}>
			{taskList.tasks.map((task) => (
				<TaskView key={task.id} task={task} />
			))}
			<NewTaskView taskList={taskList} />
		</Box>
	)
})

export const App = observer(
	({ stateStorage }: { stateStorage: StateStorage }) => {
		useEffect(() => {
			stateStorage.load()
		}, [stateStorage])

		useEffect(() => {
			if (stateStorage.fileHandle?.name) {
				document.title = `${stateStorage.fileHandle.name} - My todo list.`
			}
		}, [stateStorage.fileHandle])

		return (
			<Container py={8}>
				<Header stateStorage={stateStorage} />
				<AutoSaveToggle stateStorage={stateStorage} />
				{stateStorage.state && (
					<TaskListView taskList={stateStorage.state.taskList} />
				)}
			</Container>
		)
	},
)

export default App
