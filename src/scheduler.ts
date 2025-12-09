export type TaskCallback = () => void;

interface Task {
    cron: string;
    callback: TaskCallback;
}

interface IScheduler {
    addTask(name: string, cron: string, callback: TaskCallback): void;
    removeTask(name: string): void;
    getTasks(): string[];
    tick(currentTime: Date): void;
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

    tick(currentTime: Date): void {
        for (const task of this.tasks.values()) {
            if (this.isTimeMatching(task.cron, currentTime)) {
                task.callback();
            }
        }
    }

    private isTimeMatching(cron: string, date: Date): boolean {
        if (cron === '* * * * *') return true;
        return false;
    }
}