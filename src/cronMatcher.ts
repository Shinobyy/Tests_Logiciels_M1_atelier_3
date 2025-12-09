export class CronMatcher {
    static match(cronExpression: string, date: Date): boolean {
        const parts = cronExpression.split(' ');
        const [min, hour, dom, mon, dow] = parts;

        if (!this.checkPart(min, date.getMinutes())) return false;
        
        return true;
    }

    private static checkPart(cronPart: string, value: number): boolean {
        if (cronPart === '*') return true;
        
        if (cronPart.includes(',')) {
            const allowedValues = cronPart.split(',').map(v => Number.parseInt(v));
            return allowedValues.includes(value);
        }
        
        return Number.parseInt(cronPart) === value;
    }
}