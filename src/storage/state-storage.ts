import { AppState } from "../models/AppState"
import { observable, runInAction, action } from "mobx"
import { IStorageProvider, getInitialState } from "."
import {
	loadFromFile,
	restoreFileHandle,
	saveFileHandle,
	saveToFile,
} from "./file-system-storage"

export class StateStorage {
	@observable accessor state: AppState | undefined
	@observable accessor status: "loading" | "loaded" | "error" = "loading"
	@observable accessor fileHandle: FileSystemFileHandle | undefined =
		undefined

	constructor(private readonly storageProvider: IStorageProvider) {}

	@action
	async load() {
		this.status = "loading"
		const [state, fileHandle] = await Promise.all([
			this.storageProvider.getState(),
			restoreFileHandle(),
		])

		runInAction(() => {
			this.state = state
			this.fileHandle = fileHandle
			this.status = "loaded"
		})
		return state
	}

	@action.bound
	async openFile() {
		const fileHandle = await loadFromFile()
		runInAction(() => {
			this.fileHandle = fileHandle.handle
			this.state = fileHandle.state
		})
		if (fileHandle.handle) {
			await saveFileHandle(fileHandle.handle)
		}
	}

	@action.bound
	async saveFile() {
		if (!this.state) return

		if (
			this.fileHandle &&
			"requestPermission" in this.fileHandle &&
			typeof this.fileHandle.requestPermission === "function"
		) {
			await this.fileHandle.requestPermission({ mode: "readwrite" })
		}

		const result = await saveToFile(
			this.state,
			this.fileHandle?.name ?? "MyTodoList",
			this.fileHandle,
		)
		runInAction(() => {
			this.fileHandle = result.fileHandle ?? undefined
		})
	}

	@action.bound
	async createNewFile() {
		const result = await saveToFile(getInitialState())
		runInAction(() => {
			this.fileHandle = result.fileHandle ?? undefined
		})
		if (result.fileHandle) {
			await saveFileHandle(result.fileHandle)
		}
	}
}
