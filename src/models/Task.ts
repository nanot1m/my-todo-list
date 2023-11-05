import { z } from "zod"
import { observable, action } from "mobx"
import { TaskStatus } from "./TaskStatus"

export type TaskJSON = z.infer<typeof TaskJSON>
export const TaskJSON = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	status: z.nativeEnum(TaskStatus),
	dueDate: z.string().nullable(),
})

export class Task {
	readonly id: number
	@observable accessor title: string
	@observable accessor description: string
	@observable accessor status: TaskStatus
	@observable accessor dueDate: Date | null = null

	constructor(
		id: number,
		title: string,
		description: string,
		status: TaskStatus,
		dueDate: Date | null = null,
	) {
		this.id = id
		this.title = title
		this.description = description
		this.status = status
		this.dueDate = dueDate
	}

	@action
	setTitle(title: string) {
		this.title = title
	}

	@action
	setDescription(description: string) {
		this.description = description
	}

	@action
	setStatus(status: TaskStatus) {
		this.status = status
	}

	static fromJSON(json: TaskJSON): Task {
		return new Task(
			json.id,
			json.title,
			json.description,
			json.status,
			json.dueDate ? new Date(json.dueDate) : null,
		)
	}
}
