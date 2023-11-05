import { z } from "zod"
import { observable, action, computed } from "mobx"

import { Task, TaskJSON } from "./Task"
import { TaskStatus } from "./TaskStatus"

export type TaskListJSON = z.infer<typeof TaskListJSON>
export const TaskListJSON = z.object({
	tasks: z.array(TaskJSON),
})

export class TaskList {
	@observable accessor tasks: Task[]

	constructor(tasks: Task[]) {
		this.tasks = tasks
	}

	@computed
	get openTasks(): Task[] {
		return this.tasks.filter((task) => task.status === TaskStatus.OPEN)
	}

	@action
	addTask(task: Task) {
		this.tasks.push(task)
	}

	@action
	removeTask(task: Task) {
		this.tasks.splice(this.tasks.indexOf(task), 1)
	}

	static fromJSON(json: TaskListJSON): TaskList {
		return new TaskList(
			json.tasks.map((taskJson) => Task.fromJSON(taskJson)),
		)
	}
}
