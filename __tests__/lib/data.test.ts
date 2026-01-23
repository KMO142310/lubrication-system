import { dataService } from '@/lib/data';

describe('dataService', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getPlants', () => {
    it('should return an array of plants', () => {
      const plants = dataService.getPlants();
      expect(Array.isArray(plants)).toBe(true);
      expect(plants.length).toBeGreaterThan(0);
    });

    it('should return plants with required properties', () => {
      const plants = dataService.getPlants();
      plants.forEach(plant => {
        expect(plant).toHaveProperty('id');
        expect(plant).toHaveProperty('name');
      });
    });
  });

  describe('getAreas', () => {
    it('should return an array of areas', () => {
      const areas = dataService.getAreas();
      expect(Array.isArray(areas)).toBe(true);
    });

    it('should filter areas by plantId', () => {
      const plants = dataService.getPlants();
      if (plants.length > 0) {
        const areas = dataService.getAreas(plants[0].id);
        areas.forEach(area => {
          expect(area.plantId).toBe(plants[0].id);
        });
      }
    });
  });

  describe('getMachines', () => {
    it('should return an array of machines', () => {
      const machines = dataService.getMachines();
      expect(Array.isArray(machines)).toBe(true);
      expect(machines.length).toBeGreaterThan(0);
    });

    it('should return machines with required properties', () => {
      const machines = dataService.getMachines();
      machines.forEach(machine => {
        expect(machine).toHaveProperty('id');
        expect(machine).toHaveProperty('name');
        expect(machine).toHaveProperty('areaId');
      });
    });
  });

  describe('getComponents', () => {
    it('should return an array of components', () => {
      const components = dataService.getComponents();
      expect(Array.isArray(components)).toBe(true);
    });
  });

  describe('getLubricants', () => {
    it('should return an array of lubricants', () => {
      const lubricants = dataService.getLubricants();
      expect(Array.isArray(lubricants)).toBe(true);
      expect(lubricants.length).toBeGreaterThan(0);
    });

    it('should return lubricants with type grasa or aceite', () => {
      const lubricants = dataService.getLubricants();
      lubricants.forEach(lub => {
        expect(['grasa', 'aceite']).toContain(lub.type);
      });
    });
  });

  describe('getFrequencies', () => {
    it('should return an array of frequencies', () => {
      const frequencies = dataService.getFrequencies();
      expect(Array.isArray(frequencies)).toBe(true);
      expect(frequencies.length).toBeGreaterThan(0);
    });

    it('should return frequencies with days property', () => {
      const frequencies = dataService.getFrequencies();
      frequencies.forEach(freq => {
        expect(freq).toHaveProperty('days');
        expect(typeof freq.days).toBe('number');
        expect(freq.days).toBeGreaterThan(0);
      });
    });
  });

  describe('getLubricationPoints', () => {
    it('should return an array of lubrication points', () => {
      const points = dataService.getLubricationPoints();
      expect(Array.isArray(points)).toBe(true);
      expect(points.length).toBeGreaterThan(0);
    });

    it('should return points with required properties', () => {
      const points = dataService.getLubricationPoints();
      points.forEach(point => {
        expect(point).toHaveProperty('id');
        expect(point).toHaveProperty('code');
        expect(point).toHaveProperty('componentId');
        expect(point).toHaveProperty('lubricantId');
        expect(point).toHaveProperty('frequencyId');
        expect(point).toHaveProperty('quantity');
      });
    });
  });

  describe('getWorkOrders', () => {
    it('should return an array of work orders', () => {
      const workOrders = dataService.getWorkOrders();
      expect(Array.isArray(workOrders)).toBe(true);
    });
  });

  describe('getTasks', () => {
    it('should return an array of tasks', () => {
      const tasks = dataService.getTasks();
      expect(Array.isArray(tasks)).toBe(true);
    });
  });

  describe('getAnomalies', () => {
    it('should return an array of anomalies', () => {
      const anomalies = dataService.getAnomalies();
      expect(Array.isArray(anomalies)).toBe(true);
    });
  });

  describe('getCounts', () => {
    it('should return counts object with all required properties', () => {
      const counts = dataService.getCounts();
      expect(counts).toHaveProperty('plants');
      expect(counts).toHaveProperty('areas');
      expect(counts).toHaveProperty('machines');
      expect(counts).toHaveProperty('components');
      expect(counts).toHaveProperty('lubricationPoints');
      expect(counts).toHaveProperty('lubricants');
    });

    it('should return positive counts', () => {
      const counts = dataService.getCounts();
      expect(counts.plants).toBeGreaterThanOrEqual(0);
      expect(counts.machines).toBeGreaterThanOrEqual(0);
      expect(counts.lubricationPoints).toBeGreaterThanOrEqual(0);
    });
  });
});
