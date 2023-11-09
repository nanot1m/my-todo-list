import { action, observable, runInAction } from "mobx"
import { restoreFileHandle } from "../storage/file-system-storage"

const isFileSystemFileHandle = (
	file: FileSystemFileHandle | undefined,
): file is FileSystemFileHandle => file instanceof FileSystemFileHandle

export class FileList {
	@observable accessor files: FileSystemFileHandle[] = []

	@observable accessor status: "loading" | "loaded" | "error" = "loading"

	@action.bound
	async load() {
		this.status = "loading"
		try {
			const files = await Promise.all([restoreFileHandle()])
			runInAction(() => {
				this.files = files.filter(isFileSystemFileHandle)
				this.status = "loaded"
			})
		} catch (e) {
			this.files = []
			this.status = "error"
		}
	}
}
