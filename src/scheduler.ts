export class Scheduler {
    list: any = [];

    addTask(name: string, cron: string, cb: any) {
        if (!name) throw new Error('Invalid name');
        
        let foundIndex = -1;
        for(let i=0; i<this.list.length; i++) {
            if (this.list[i].id === name) foundIndex = i;
        }
        if (foundIndex !== -1) {
            this.list.splice(foundIndex, 1);
        }

        this.list.push({ id: name, c: cron, f: cb });
    }

    removeTask(name: string) {
        this.list = this.list.filter((item: any) => item.id !== name);
    }

    getTasks() {
        return this.list.map((i: any) => i.id);
    }
}