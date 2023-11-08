import { action, computed, observable } from "mobx"
import { z } from "zod"

import { Task, TaskJSON } from "./Task"
import { TaskStatus } from "./TaskStatus"

export type TaskListJSON = z.infer<typeof TaskListJSON>
export const TaskListJSON = z.object({
	tasks: z.array(TaskJSON),
})

function tasksCompareFn(a: Task, b: Task): number {
	if (a.priority > b.priority) return -1
	if (a.priority < b.priority) return 1
	if (a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime()
	if (a.dueDate) return -1
	if (b.dueDate) return 1
	return a.createdAt.getTime() - b.createdAt.getTime()
}

export class TaskList {
	@observable accessor tasks: Task[]

	constructor(tasks: Task[]) {
		this.tasks = tasks
	}

	@computed
	get openTasks(): Task[] {
		return this.tasks
			.filter((task) => task.status === TaskStatus.OPEN)
			.sort(tasksCompareFn)
	}

	@action
	addTask(task: Task) {
		this.tasks.push(task)
	}

	@action
	removeTask(task: Task) {
		this.tasks.splice(this.tasks.indexOf(task), 1)
	}

	toJSON() {
		return {
			tasks: this.tasks.map((task) => task.toJSON()),
		}
	}

	static fromJSON(json: TaskListJSON): TaskList {
		return new TaskList(
			json.tasks.map((taskJson) => Task.fromJSON(taskJson)),
		)
	}
}
