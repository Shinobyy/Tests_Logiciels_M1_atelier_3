export class CronMatcher {
    static match(cronExpression: string, date: Date): boolean {
        const parts = cronExpression.split(' ');
        const [min, hour, dom, mon, dow] = parts;

        if (!this.checkPart(min, date.getMinutes())) return false;
        if (!this.checkPart(hour, date.getHours())) return false;
        if (!this.checkPart(dom, date.getDate())) return false;
        if (!this.checkPart(mon, date.getMonth() + 1)) return false;
        if (!this.checkPart(dow, date.getDay())) return false;
        
        return true;
    }

    private static checkPart(cronPart: string, value: number): boolean {
        if (cronPart === '*') return true;
        
        if (cronPart.includes('/')) {
            let parts = cronPart.split('/');
            let step = Number.parseInt(parts[1]);
            return (value % step) === 0;
        }

        if (cronPart.includes(',')) {
            const parts = cronPart.split(',');
            return parts.some(part => Number.parseInt(part) === value);
        }

        if (cronPart.includes('-')) {
            const parts = cronPart.split('-');
            const start = Number.parseInt(parts[0]);
            const end = Number.parseInt(parts[1]);
            return value >= start && value <= end;
        }

        return Number.parseInt(cronPart) === value;
    }
}