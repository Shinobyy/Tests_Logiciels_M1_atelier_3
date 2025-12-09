export class CronMatcher {
    static match(cronExpression: string, date: Date): boolean {
        const parts = cronExpression.split(' ');
        const [min, hour, dom, mon, dow] = parts;

        if (!this.checkPart(min, date.getMinutes())) return false;
        
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

        return Number.parseInt(cronPart) === value;
    }
}