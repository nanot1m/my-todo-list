import { action, observable } from "mobx"
import { z } from "zod"

import { TaskStatus } from "./TaskStatus"

export type TaskJSON = z.infer<typeof TaskJSON>
export const TaskJSON = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	status: z.nativeEnum(TaskStatus),
	dueDate: z.date().nullable(),
	createdAt: z.date(),
})

export class Task {
	readonly id: number
	@observable accessor title: string
	@observable accessor description: string
	@observable accessor status: TaskStatus
	@observable accessor createdAt: Date
	@observable accessor dueDate: Date | null = null

	constructor(
		id: number,
		title: string,
		description: string,
		status: TaskStatus,
		createdAt: Date,
		dueDate: Date | null = null,
	) {
		this.id = id
		this.title = title
		this.description = description
		this.status = status
		this.createdAt = createdAt
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

	toJSON() {
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			status: this.status,
			createdAt: this.createdAt,
			dueDate: this.dueDate,
		}
	}

	static fromJSON(json: TaskJSON): Task {
		return new Task(
			json.id,
			json.title,
			json.description,
			json.status,
			json.createdAt,
			json.dueDate,
		)
	}
}
