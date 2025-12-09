import { Scheduler } from '../src/scheduler';
import { describe, it, expect, jest } from '@jest/globals';

describe('Scheduler - CRUD', () => {
    it('should add a task and retrieve it', () => {
        const scheduler = new Scheduler();
        scheduler.addTask('Backup', '* * * * *', () => {});
        expect(scheduler.getTasks()).toContain('Backup');
    });

    it('should overwrite a task if name already exists (Update)', () => {
        const scheduler = new Scheduler();
        const cb1 = jest.fn();
        const cb2 = jest.fn();

        scheduler.addTask('Job', '* * * * *', cb1);
        scheduler.addTask('Job', '0 0 * * *', cb2);

        const tasks = scheduler.getTasks();
        expect(tasks).toHaveLength(1);
        expect(tasks[0]).toBe('Job');
    });

    it('should remove a task and handle removal of non-existent task gracefully', () => {
        const scheduler = new Scheduler();
        scheduler.addTask('Job', '* * * * *', () => {});
        
        scheduler.removeTask('Job');
        expect(scheduler.getTasks()).toHaveLength(0);

        expect(() => scheduler.removeTask('Ghost')).not.toThrow();
    });

    it('should throw error if task name is empty', () => {
        const scheduler = new Scheduler();
        expect(() => scheduler.addTask('', '* *', () => {})).toThrow('Invalid name');
    });
});

describe('Scheduler - Execution', () => {
    it('should execute a task matching the time (* * * * *)', () => {
        const scheduler = new Scheduler();
        const spyCallback = jest.fn();

        scheduler.addTask('EveryMinute', '* * * * *', spyCallback);

        const fakeNow = new Date('2023-01-01T12:00:00');
        scheduler.tick(fakeNow);

        expect(spyCallback).toHaveBeenCalledTimes(1);
    });

    it('should only execute if the minute matches exactly', () => {
        const scheduler = new Scheduler();
        const spy = jest.fn();

        scheduler.addTask('HalfHour', '30 * * * *', spy);

        scheduler.tick(new Date('2023-01-01T10:15:00'));
        expect(spy).not.toHaveBeenCalled();

        scheduler.tick(new Date('2023-01-01T10:30:00'));
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should handle lists of values (comma separator)', () => {
        const scheduler = new Scheduler();
        const spy = jest.fn();

        scheduler.addTask('Quarter', '15,30 * * * *', spy);

        scheduler.tick(new Date('2026-01-01T10:15:00'));
        scheduler.tick(new Date('2026-01-01T10:20:00'));
        scheduler.tick(new Date('2026-01-01T10:30:00'));

        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should handle steps (intervals with /)', () => {
        const scheduler = new Scheduler();
        const spy = jest.fn();

        scheduler.addTask('Every5Min', '*/5 * * * *', spy);

        scheduler.tick(new Date('2026-01-01T10:05:00'));
        scheduler.tick(new Date('2026-01-01T10:06:00'));
        scheduler.tick(new Date('2026-01-01T10:10:00'));

        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should respect the hour field', () => {
        const scheduler = new Scheduler();
        const spy = jest.fn();

        scheduler.addTask('TeaTime', '0 14 * * *', spy);

        scheduler.tick(new Date('2026-01-01T13:00:00'));
        expect(spy).not.toHaveBeenCalled();

        scheduler.tick(new Date('2026-01-01T14:00:00'));
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should respect the day of month', () => {
        const scheduler = new Scheduler();
        const spy = jest.fn();

        scheduler.addTask('PayDay', '0 0 15 * *', spy);

        scheduler.tick(new Date('2026-01-14T00:00:00'));
        expect(spy).not.toHaveBeenCalled();

        scheduler.tick(new Date('2026-01-15T00:00:00'));
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should respect the month', () => {
        const scheduler = new Scheduler();
        const spy = jest.fn();
    
        scheduler.addTask('Summer', '0 0 1 6 *', spy);
    
        scheduler.tick(new Date('2026-05-01T00:00:00'));
        expect(spy).not.toHaveBeenCalled();
    
        scheduler.tick(new Date('2026-06-01T00:00:00'));
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should respect the day of week', () => {
        const scheduler = new Scheduler();
        const spy = jest.fn();

        scheduler.addTask('MondayMeeting', '0 9 * * 1', spy);

        scheduler.tick(new Date('2026-01-01T09:00:00')); 
        expect(spy).not.toHaveBeenCalled();

        scheduler.tick(new Date('2026-01-05T09:00:00'));
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should handle ranges (hyphen separator)', () => {
        const scheduler = new Scheduler();
        const spy = jest.fn();

        scheduler.addTask('RangeTask', '1-3 * * * *', spy);

        scheduler.tick(new Date('2026-01-01T10:00:00'));
        expect(spy).not.toHaveBeenCalled();

        scheduler.tick(new Date('2026-01-01T10:01:00'));
        expect(spy).toHaveBeenCalledTimes(1);

        scheduler.tick(new Date('2026-01-01T10:02:00'));
        expect(spy).toHaveBeenCalledTimes(2);

        scheduler.tick(new Date('2026-01-01T10:03:00'));
        expect(spy).toHaveBeenCalledTimes(3);

        scheduler.tick(new Date('2026-01-01T10:04:00'));
        expect(spy).toHaveBeenCalledTimes(3);
    });

});