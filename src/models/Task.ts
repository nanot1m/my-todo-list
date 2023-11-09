import { action, computed, observable } from "mobx"
import { z } from "zod"

import { TaskStatus } from "./TaskStatus"

export type TaskJSON = z.infer<typeof TaskJSON>
export const TaskJSON = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	status: z.nativeEnum(TaskStatus),
	dueDate: z.string().pipe(z.coerce.date()).nullable(),
	createdAt: z.string().pipe(z.coerce.date()),
	priority: z.union([z.number().int().min(0), z.undefined()]),
})

export class Task {
	readonly id: string
	@observable accessor title: string
	@observable accessor description: string
	@observable accessor status: TaskStatus
	@observable accessor createdAt: Date
	@observable accessor dueDate: Date | null
	@observable accessor priority: number

	constructor(
		id: string,
		title: string,
		description: string,
		status: TaskStatus,
		createdAt: Date,
		dueDate: Date | null = null,
		priority: number = 0,
	) {
		this.id = id
		this.title = title
		this.description = description
		this.status = status
		this.createdAt = createdAt
		this.dueDate = dueDate
		this.priority = priority
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

	@action
	setDueDate(dueDate: Date | null) {
		this.dueDate = dueDate
	}

	@action
	setPriority(priority: number) {
		this.priority = priority
	}

	@computed
	get done(): boolean {
		return this.status === TaskStatus.DONE
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
			json.priority,
		)
	}
}
