import { Area, Plant } from './types';

export const PLANT: Plant = {
    id: 'plant-foresa',
    name: 'Planta Aserradero Foresa',
    location: 'Chile'
};

// ONLY THE 5 REQUESTED AREAS
export const AREAS: Area[] = [
    { id: 'area-611-8001', plantId: 'plant-foresa', cgCode: 611, ccCode: 8001, name: 'Descortezador Linea Gruesa' },
    { id: 'area-611-8002', plantId: 'plant-foresa', cgCode: 611, ccCode: 8002, name: 'Descortezador Linea Delgada' },
    { id: 'area-612-8004', plantId: 'plant-foresa', cgCode: 612, ccCode: 8004, name: 'Aserradero Linea Gruesa Nuevo' },
    { id: 'area-612-8007', plantId: 'plant-foresa', cgCode: 612, ccCode: 8007, name: 'Aserradero Linea Delgada' },
    { id: 'area-612-8010', plantId: 'plant-foresa', cgCode: 612, ccCode: 8010, name: 'Astillado' },
];
