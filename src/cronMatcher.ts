export class CronMatcher {
    private static readonly MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    private static readonly DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    static match(cronExpression: string, date: Date): boolean {
        const parts = cronExpression.split(' ');
        const [min, hour, dom, mon, dow] = parts;

        if (!this.checkPart(min, date.getMinutes())) return false;
        if (!this.checkPart(hour, date.getHours())) return false;
        if (!this.checkPart(dom, date.getDate())) return false;
        
        const normalizedMon = this.replaceNames(mon, this.MONTHS, 1);
        if (!this.checkPart(normalizedMon, date.getMonth() + 1)) return false;

        const normalizedDow = this.replaceNames(dow, this.DAYS, 0);
        if (!this.checkPart(normalizedDow, date.getDay())) return false;
        
        return true;
    }

    private static replaceNames(part: string, names: string[], offset: number): string {
        let res = part.toUpperCase();
        for (const name of names) {
            res = res.replaceAll(new RegExp(name, 'g'), (names.indexOf(name) + offset).toString());
        }
        return res;
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