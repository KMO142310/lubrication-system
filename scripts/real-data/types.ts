export interface Plant {
    id: string;
    name: string;
    location: string;
}

export interface Area {
    id: string;
    plantId: string;
    cgCode: number;
    ccCode: number;
    name: string;
}

export interface Machine {
    id: string;
    areaId: string;
    code: string;
    name: string;
}

export interface LubricationPoint {
    id: string;
    machineId: string;
    position: number;
    interval: string;
    description: string;
    item: number;
    numPoints: number;
    lubricantType: string;
}
