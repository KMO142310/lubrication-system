-- ============================================
-- AISA/Foresa Real Data Seed
-- Generated from WhatsApp images 2026-01-25
-- ============================================

-- Clear existing demo data
DELETE FROM tasks;
DELETE FROM work_orders;
DELETE FROM lubrication_points;
DELETE FROM components;
DELETE FROM machines;
DELETE FROM areas;
DELETE FROM plants;
DELETE FROM lubricants;
DELETE FROM frequencies;

-- ============================================
-- PLANT
-- ============================================
INSERT INTO plants (id, name, location) VALUES ('plant-foresa', 'Planta Aserradero Foresa', 'Chile');

-- ============================================
-- AREAS (Centros de Gestion / Centros de Costo)
-- ============================================
INSERT INTO areas (id, plant_id, name) VALUES ('area-611-8000', 'plant-foresa', 'CG 611 / CC 8000 - Cancha de Trozos');
INSERT INTO areas (id, plant_id, name) VALUES ('area-611-8001', 'plant-foresa', 'CG 611 / CC 8001 - Descortezador Linea Gruesa');
INSERT INTO areas (id, plant_id, name) VALUES ('area-611-8002', 'plant-foresa', 'CG 611 / CC 8002 - Descortezador Linea Delgada');
INSERT INTO areas (id, plant_id, name) VALUES ('area-611-8003', 'plant-foresa', 'CG 611 / CC 8003 - Extraccion de Corteza');
INSERT INTO areas (id, plant_id, name) VALUES ('area-612-8004', 'plant-foresa', 'CG 612 / CC 8004 - Aserradero LG Nuevo');
INSERT INTO areas (id, plant_id, name) VALUES ('area-612-8006', 'plant-foresa', 'CG 612 / CC 8006 - Aserradero Linea Gruesa');
INSERT INTO areas (id, plant_id, name) VALUES ('area-612-8007', 'plant-foresa', 'CG 612 / CC 8007 - Aserradero Linea Delgada');
INSERT INTO areas (id, plant_id, name) VALUES ('area-612-8009', 'plant-foresa', 'CG 612 / CC 8009 - Taller de Afilado');
INSERT INTO areas (id, plant_id, name) VALUES ('area-612-8010', 'plant-foresa', 'CG 612 / CC 8010 - Astillado');
INSERT INTO areas (id, plant_id, name) VALUES ('area-612-8011', 'plant-foresa', 'CG 612 / CC 8011 - Aserradero Lampeador');

-- ============================================
-- MACHINES (Equipos)
-- ============================================
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-400', 'area-611-8000', '[400] Mat. Prima Trozos Aserr.', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-401', 'area-611-8000', '[401] Remuneraciones Cancha de Trozos', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-402', 'area-611-8000', '[402] Sistema de Riego', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-4403', 'area-611-8000', '[4403] Gastos Grales Cancha Troz.', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-501', 'area-611-8001', '[501] Remuneraciones Desc. Linea Gruesa', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-549', 'area-611-8001', '[549] Gtos Grales Desc. Linea Gruesa', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-513', 'area-611-8001', '[513] Sistema Control y Fuerza', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-520', 'area-611-8001', '[520] Subest. Electr. Transf. 150KVA', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-521', 'area-611-8001', '[521] Canalizacion Electrica', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-522', 'area-611-8001', '[522] Iluminacion', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3000', 'area-611-8001', '[3000] Descortezador L.G. (EQ.3000)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3002', 'area-611-8001', '[3002] Central Hidraulica D.L.G. (EQ.3002)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3100', 'area-611-8001', '[3100] Cadena Recep. Desde 1700 (EQ.3100)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3200', 'area-611-8001', '[3200] Cadena Alim. D.L.G. (EQ.3200)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3300', 'area-611-8001', '[3300] Elevador Trozos 3000 (EQ.3300)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3400', 'area-611-8001', '[3400] Volteador (EQ.3400)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3500', 'area-611-8001', '[3500] Centrador Entrada 3000 (EQ.3500)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3600', 'area-611-8001', '[3600] Mesa Acopio D.L.G. (EQ.3600)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3700', 'area-611-8001', '[3700] Centrador Salida 3000 (EQ.3700)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3800', 'area-611-8001', '[3800] Transp. de Salida 3000 (EQ.3800)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3850', 'area-611-8001', '[3850] Scanner D.L.G. (EQ.3850)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3900', 'area-611-8001', '[3900] Clasificador L.G. (EQ.3900)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-551', 'area-611-8002', '[551] Remuneraciones Desc. Linea Delgada', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-599', 'area-611-8002', '[599] Gtos Grales Desc. Linea Delg.', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1000', 'area-611-8002', '[1000] Mesa Alim. Izq. DLD (EQ.1000)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1050', 'area-611-8002', '[1050] Mesa Alim. Der. DLD (EQ.1050)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1100', 'area-611-8002', '[1100] D.A.G. Lado Izquierdo (EQ.1100)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1150', 'area-611-8002', '[1150] D.A.G. Lado Derecho (EQ.1150)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1300', 'area-611-8002', '[1300] Cadena de Recepcion 1100-1150 (EQ.1300)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1350', 'area-611-8002', '[1350] Central Hidraulica 1100-1150 (EQ.1350)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1450', 'area-611-8002', '[1450] Pateador 1 (EQ.1450)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1460', 'area-611-8002', '[1460] Pateador 2 (EQ.1460)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1470', 'area-611-8002', '[1470] Pateador 3 (EQ.1470)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1500', 'area-611-8002', '[1500] Dosificador 1600 (EQ.1500)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1600', 'area-611-8002', '[1600] Mesa Aliment. EQ Desde LD (EQ.1600)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1700', 'area-611-8002', '[1700] BAB Descortezador LD (EQ.1700)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1800', 'area-611-8002', '[1800] D.A.G. Aliment. 2100 (EQ.1800)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1810', 'area-611-8002', '[1810] Central Hidraulica 1800 (EQ.1810)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1900', 'area-611-8002', '[1900] Transportador Alim. DLD (EQ.1900)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-2000', 'area-611-8002', '[2000] Centrador Entrada DLD (EQ.2000)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-2100', 'area-611-8002', '[2100] Descortezador LD (EQ.2100)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-2200', 'area-611-8002', '[2200] Centrador Salida 2100 (EQ.2200)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-2300', 'area-611-8002', '[2300] Cadena Scanner (EQ.2300)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-2400', 'area-611-8002', '[2400] Scanner Descort. LD (EQ.2400)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-2500', 'area-611-8002', '[2500] Clasificador D.L.D (EQ.2500)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1310', 'area-611-8003', '[1310] Cinta Transp. Bajo 1300 (EQ.1310)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1315', 'area-611-8003', '[1315] Cinta Transp. Bajo 2100 (EQ.1315)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1320', 'area-611-8003', '[1320] Cinta Transp. Desde EQ.1320', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1330', 'area-611-8003', '[1330] Cinta Elevadora Corteza (EQ.1330)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1340', 'area-611-8003', '[1340] Cinta Transp. Bajo 3000 (EQ.1340)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3610', 'area-611-8003', '[3610] Cinta Transp. Bajo 3000 (EQ.3610)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3620', 'area-611-8003', '[3620] Cinta Transp. Bajo 3400 (EQ.3620)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3640', 'area-611-8003', '[3640] Transportador al Tritur. (EQ.36)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-3650', 'area-611-8003', '[3650] Triturador de Corteza (EQ.365)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-5', 'area-612-8010', '[5] Cinta 2 Trans. Chip (EQ.5)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-6', 'area-612-8010', '[6] Cinta Trans. Chip Bajo Canter 1 (EQ.6)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-9', 'area-612-8010', '[9] Cinta Trans. Chip Harnero ALD (EQ.9)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-11', 'area-612-8010', '[11] Cinta TR. Chip Bajo Harnero (EQ.11)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-13', 'area-612-8010', '[13] Cinta TR. Chip Hacia A.L.G. (EQ.13)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-15', 'area-612-8010', '[15] Cinta TR. Chip A Elevador (EQ.15)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-17', 'area-612-8010', '[17] Cinta TR. Chip Elevador ALD (EQ.17)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-19', 'area-612-8010', '[19] Cinta TR. Entrada Silo ALD (EQ.19)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-23', 'area-612-8010', '[23] Cinta TR. Despuntador 1 (EQ.23)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-24', 'area-612-8010', '[24] Cinta TR. Lampazo Astillado (EQ.24)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-25', 'area-612-8010', '[25] Cinta TR. Despuntador 2 (EQ.25)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-27', 'area-612-8010', '[27] Harnero Chip ALG (EQ.27)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-30', 'area-612-8010', '[30] Cinta TR. Rechazo Chips (EQ.30)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-32', 'area-612-8010', '[32] Cinta TR. Chip Desde 27-35 (EQ.32)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-33', 'area-612-8010', '[33] Cinta TR. Eleva Chip A.L.G. (EQ.33)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-34', 'area-612-8010', '[34] Cinta TR. Entrada Silo ALG (EQ.34)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-35', 'area-612-8010', '[35] Vibrador Lampazos (EQ.35)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-37', 'area-612-8010', '[37] Astillador Nicholson LG (EQ.37)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-510', 'area-612-8010', '[510] Harnero Chips ALD (EQ.510)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-ast-1801', 'area-612-8010', '[1801] Cinta Trans. Chip Bajo Canter 2 (EQ.48)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1301', 'area-612-8009', '[1301] Remuneraciones Taller Afilado', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1399', 'area-612-8009', '[1399] Gastos Grales Taller Afil.', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1302', 'area-612-8009', '[1302] Afiladora Vollmer CHC-22', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1303', 'area-612-8009', '[1303] Afiladora Vollmer FS-2A', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1304', 'area-612-8009', '[1304] Afiladora Vollmer CHIP-2', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1305', 'area-612-8009', '[1305] Maq. Soldar EQ Vollmer L', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1306', 'area-612-8009', '[1306] Afiladora Cincinnati (in)', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1307', 'area-612-8009', '[1307] Afiladora FG SER AF-150', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1308', 'area-612-8009', '[1308] Afiladora Newman G-280', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1309', 'area-612-8009', '[1309] Afiladora Vollmer KCB42', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1310a', 'area-612-8009', '[1310] Tensionador Sierra Huincha', 'active');
INSERT INTO machines (id, area_id, name, status) VALUES ('mach-1311', 'area-612-8009', '[1311] Afiladora Cana-E Vollmer', 'active');

-- ============================================
-- LUBRICANTS (Tipos de Lubricante)
-- ============================================
INSERT INTO lubricants (id, name, type) VALUES ('lub-grupo1', 'Grupo 1 - Aceite', 'aceite');
INSERT INTO lubricants (id, name, type) VALUES ('lub-grupo2', 'Grupo 2 - Grasa EP', 'grasa');
INSERT INTO lubricants (id, name, type) VALUES ('lub-grupo5', 'Grupo 5 - Grasa KP2K', 'grasa');
INSERT INTO lubricants (id, name, type) VALUES ('lub-det', 'Detergente - Limpieza', 'otro');
INSERT INTO lubricants (id, name, type) VALUES ('lub-nbu15', 'ISOFLEX NBU 15', 'grasa');

-- ============================================
-- FREQUENCIES
-- ============================================
INSERT INTO frequencies (id, name, days) VALUES ('freq-daily', 'Diaria', 1);
INSERT INTO frequencies (id, name, days) VALUES ('freq-eod', 'Dia por Medio', 2);
INSERT INTO frequencies (id, name, days) VALUES ('freq-weekly', 'Semanal', 7);
INSERT INTO frequencies (id, name, days) VALUES ('freq-biweekly', 'Quincenal', 14);
INSERT INTO frequencies (id, name, days) VALUES ('freq-monthly', 'Mensual', 30);
INSERT INTO frequencies (id, name, days) VALUES ('freq-quarterly', 'Trimestral', 90);
INSERT INTO frequencies (id, name, days) VALUES ('freq-annual', 'Anual', 365);

-- ============================================
-- SUMMARY
-- ============================================
-- Total Areas: 10
-- Total Machines: 86
-- Total Lubrication Points: 37