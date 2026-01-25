import { calculateCompliance, getTaskStats } from '@/lib/analytics';

describe('Analytics Library', () => {
    describe('calculateCompliance', () => {
        it('should return 0 when total tasks is 0', () => {
            expect(calculateCompliance(0, 0)).toBe(0);
        });

        it('should calculate percentage correcltly', () => {
            expect(calculateCompliance(5, 10)).toBe(50);
            expect(calculateCompliance(1, 4)).toBe(25);
        });

        it('should round to nearest integer', () => {
            expect(calculateCompliance(1, 3)).toBe(33); // 33.33... -> 33
            expect(calculateCompliance(2, 3)).toBe(67); // 66.66... -> 67
        });
    });

    describe('getTaskStats', () => {
        const mockTasks = [
            { id: '1', status: 'completado', quantityUsed: 10 },
            { id: '2', status: 'completado', quantityUsed: 5 },
            { id: '3', status: 'pendiente' },
            { id: '4', status: 'omitido' },
            { id: '5', status: 'pendiente' },
        ];

        it('should categorize tasks correctly', () => {
            const stats = getTaskStats(mockTasks);

            expect(stats.counts.total).toBe(5);
            expect(stats.counts.completed).toBe(2);
            expect(stats.counts.pending).toBe(2);
            expect(stats.counts.skipped).toBe(1);
        });

        it('should calculate total lubricant used', () => {
            const stats = getTaskStats(mockTasks);
            expect(stats.totalLubricantUsed).toBe(15);
        });

        it('should return correct arrays', () => {
            const stats = getTaskStats(mockTasks);
            expect(stats.completed).toHaveLength(2);
            expect(stats.pending).toHaveLength(2);
            expect(stats.skipped).toHaveLength(1);
        });
    });
});
