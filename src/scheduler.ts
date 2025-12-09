export type TaskCallback = () => void;

interface Task {
    cron: string;
    callback: TaskCallback;
}

interface IScheduler {
    addTask(name: string, cron: string, callback: TaskCallback): void;
    removeTask(name: string): void;
    getTasks(): string[];
}

export class Scheduler implements IScheduler {
    private readonly tasks: Map<string, Task> = new Map();

    addTask(name: string, cron: string, callback: TaskCallback): void {
        if (!name) throw new Error('Invalid name');
        this.tasks.set(name, { cron, callback });
    }

    removeTask(name: string): void {
        this.tasks.delete(name);
    }

    getTasks(): string[] {
        return Array.from(this.tasks.keys());
    }
}