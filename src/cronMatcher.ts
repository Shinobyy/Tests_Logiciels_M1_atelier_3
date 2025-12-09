export class CronMatcher {
    static match(cronExpression: string, date: Date): boolean {
        const parts = cronExpression.split(' ');
        const [min, hour, dom, mon, dow] = parts;

        if (!this.checkPart(min, date.getMinutes())) return false;
        
        return true;
    }

    private static checkPart(cronPart: string, value: number): boolean {
        if (cronPart === '*') return true;
        return parseInt(cronPart) === value;
    }
}