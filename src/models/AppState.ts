import { z } from "zod"

import { TaskList, TaskListJSON } from "./TaskList"

export type AppStateJSON = z.infer<typeof AppStateJSON>
export const AppStateJSON = z.object({
	version: z.string(),
	taskList: TaskListJSON,
})

export class AppState {
	readonly version: string

	readonly taskList: TaskList

	constructor(version: string, taskList: TaskList) {
		this.version = version
		this.taskList = taskList
	}

	toJSON() {
		return {
			version: this.version,
			taskList: this.taskList.toJSON(),
		}
	}

	static fromJSON(json: AppStateJSON): AppState {
		return new AppState(json.version, TaskList.fromJSON(json.taskList))
	}
}
