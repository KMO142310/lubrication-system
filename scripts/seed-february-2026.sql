-- ============================================
-- AISA Lubrication System
-- February 2026 Schedule Seed
-- Generated: 2026-01-25T15:38:03.899Z
-- ============================================

-- Clear existing February 2026 data
DELETE FROM tasks WHERE work_order_id IN (SELECT id FROM work_orders WHERE scheduled_date LIKE '2026-02-%');
DELETE FROM work_orders WHERE scheduled_date LIKE '2026-02-%';

-- ============================================
-- WORK ORDERS
-- ============================================

-- 2026-02-02 (Lunes) - Turno A - Semana 1
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '2026-02-02', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f0b10854-add6-4b5a-aa2c-f2282a606c85', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b814ab18-41ac-4f49-9f15-fb05ea07fb35', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9e7eb052-6503-426b-9406-90fe4fc9512e', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8637f5ea-8ada-4728-bc32-bfc4da1054ed', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('12002313-906e-4b03-b4ff-63b9988ad7cf', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8935b079-6bb7-4a3f-8281-b9f8387820d1', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7e2bb40a-f211-4696-970f-95cac60993ac', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8e9de134-3f34-4195-bbc8-10a1a6640293', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7d321dbb-23be-4e31-b24f-fae6155cd668', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('3ad2b039-225f-4515-b480-e7cf1fc7e6b0', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6d7db363-ab8e-4d90-8ce6-472aa3cf105b', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7d2f999d-1918-4a96-98f7-2c472d8ce646', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b5491954-e09a-4ef1-bb59-227d1633f40a', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0bfc137f-cdde-4c05-ba34-ec961c8ee0a6', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e624d532-7f5d-4ff7-8240-531a68adda86', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('1cea6dbc-be40-4b3c-9fb3-679d763e4987', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7cd7ceff-d813-443d-b63a-58c6042313e6', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('87ff73a0-a6db-445b-92ae-b994d376fd05', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e27b9cee-39c7-447c-a295-4ecdfa0d9aff', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('27c203a3-e1c9-47b1-bc88-3e991948af46', 'b7ae3d2e-da6e-4199-96d4-3e3cf96d1db8', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));

-- 2026-02-03 (Martes) - Turno A - Semana 1
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('285e7ea1-d24b-43ad-aaec-488232e902d3', '2026-02-03', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('31762265-e7f2-41fb-b17a-9c759d9d272f', '285e7ea1-d24b-43ad-aaec-488232e902d3', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('cf73c38c-36b0-4e62-b5dc-e234b593219f', '285e7ea1-d24b-43ad-aaec-488232e902d3', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b1ea4348-4693-454a-a461-58f7e5607fff', '285e7ea1-d24b-43ad-aaec-488232e902d3', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a0abbdfc-58a5-4a67-b470-75aa6a5ae574', '285e7ea1-d24b-43ad-aaec-488232e902d3', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8f4f78af-ee1b-4a54-92e9-2343ef2c9a84', '285e7ea1-d24b-43ad-aaec-488232e902d3', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('54aa0bec-5085-4428-93f1-7dc1909200c1', '285e7ea1-d24b-43ad-aaec-488232e902d3', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ee611b91-c10e-4ae2-8457-2bcebb8775b0', '285e7ea1-d24b-43ad-aaec-488232e902d3', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('13696812-19af-4524-a40a-a89bfb67b9fc', '285e7ea1-d24b-43ad-aaec-488232e902d3', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('fd24b028-c20f-41da-bd9e-fe8aab3f8011', '285e7ea1-d24b-43ad-aaec-488232e902d3', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('3a88c41a-fedf-45cb-8049-a61c13b96916', '285e7ea1-d24b-43ad-aaec-488232e902d3', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0fae1ac9-627a-4109-8752-7d0c58fdc98e', '285e7ea1-d24b-43ad-aaec-488232e902d3', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ca2f5be4-7993-4e58-87a7-3f578c02854e', '285e7ea1-d24b-43ad-aaec-488232e902d3', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7044df17-bfba-45c5-8cc2-084e63b6f13b', '285e7ea1-d24b-43ad-aaec-488232e902d3', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ac8a8e10-a8bb-4e3b-a754-a69738ad8701', '285e7ea1-d24b-43ad-aaec-488232e902d3', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f6722baa-3941-41b9-902b-f2f73731ceb2', '285e7ea1-d24b-43ad-aaec-488232e902d3', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('66f6990b-ef4b-4e64-8b13-979190d657f5', '285e7ea1-d24b-43ad-aaec-488232e902d3', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('126d98c0-2a2a-42b3-91d8-811d4f6f82a8', '285e7ea1-d24b-43ad-aaec-488232e902d3', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('89ccc376-251f-45be-a1d0-e37a8336fe27', '285e7ea1-d24b-43ad-aaec-488232e902d3', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6ea72dd4-829b-4323-b7f6-11efe4c1b936', '285e7ea1-d24b-43ad-aaec-488232e902d3', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ec0cbacc-4ec0-439a-a83f-4db089472381', '285e7ea1-d24b-43ad-aaec-488232e902d3', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f1c6ed9c-df01-457c-90e7-3e958a8cd856', '285e7ea1-d24b-43ad-aaec-488232e902d3', '3000', 'pendiente', 'Cuchillos Descortezador LG - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0ff771e7-3f83-409d-88b9-a2ac6ba0f089', '285e7ea1-d24b-43ad-aaec-488232e902d3', '4200', 'pendiente', 'VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c0c3b1b4-6e2e-4981-b1c6-5fb104a8271e', '285e7ea1-d24b-43ad-aaec-488232e902d3', '4210', 'pendiente', 'Carro VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('533dc2ac-e86b-4327-af48-ce8b2d7b3329', '285e7ea1-d24b-43ad-aaec-488232e902d3', '4250', 'pendiente', 'VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0c13316e-376b-44e1-a35c-d783c649e4e3', '285e7ea1-d24b-43ad-aaec-488232e902d3', '4260', 'pendiente', 'Carro VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6da83dba-2a44-4f74-ba1b-8656a5b0e710', '285e7ea1-d24b-43ad-aaec-488232e902d3', '300', 'pendiente', 'FR-10 (sistema bijur) - Relleno bijur WD (DTE-24)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('3b04d8a8-7b0f-443b-b297-a0ad46bf93a1', '285e7ea1-d24b-43ad-aaec-488232e902d3', '-', 'pendiente', 'Cadenas ALG planta baja - Aceitado (Aceite)', datetime('now'));

-- 2026-02-04 (Miércoles) - Turno A - Semana 1
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('36243f6e-2bb2-43ec-a270-c90555defb49', '2026-02-04', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('d70d37e9-75af-495d-ad69-218b38321e14', '36243f6e-2bb2-43ec-a270-c90555defb49', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f2b94b8f-bb6e-420b-9aea-8b411f02cedf', '36243f6e-2bb2-43ec-a270-c90555defb49', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f2992e12-5c7b-4ed5-a5c6-765c4da7d166', '36243f6e-2bb2-43ec-a270-c90555defb49', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a15e6ab0-08a9-4448-a416-bfe98ffc42eb', '36243f6e-2bb2-43ec-a270-c90555defb49', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c4a86734-9cb4-4e41-a4b9-7a71a7bd1522', '36243f6e-2bb2-43ec-a270-c90555defb49', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('d20b924e-032a-41ec-ab1e-5397a30c9c4b', '36243f6e-2bb2-43ec-a270-c90555defb49', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('651ef250-8165-4397-a955-bd4adf766d9d', '36243f6e-2bb2-43ec-a270-c90555defb49', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a7f82851-6140-43f5-a6d7-e0858ba76706', '36243f6e-2bb2-43ec-a270-c90555defb49', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('91fc9bee-70ec-4b95-bcd1-15f477839174', '36243f6e-2bb2-43ec-a270-c90555defb49', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ab79fcfe-c983-4dfa-82f1-ca0f654734e8', '36243f6e-2bb2-43ec-a270-c90555defb49', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('165c0489-87e9-4ed2-b5fe-230d0c6ef48d', '36243f6e-2bb2-43ec-a270-c90555defb49', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e4055249-c5f1-4c0a-80d3-ea84c911e5fd', '36243f6e-2bb2-43ec-a270-c90555defb49', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a0a9f5dc-f6fe-4a68-9844-c0b87c89f59f', '36243f6e-2bb2-43ec-a270-c90555defb49', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b11ad826-aaa1-42af-8843-5fb3df39cc43', '36243f6e-2bb2-43ec-a270-c90555defb49', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7edc5421-4392-40e2-a60c-7bff0feb3d1e', '36243f6e-2bb2-43ec-a270-c90555defb49', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a5cd4e20-3629-421a-8c68-299ea5671ed8', '36243f6e-2bb2-43ec-a270-c90555defb49', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e36af0f3-71ca-468b-b211-678fc15c716f', '36243f6e-2bb2-43ec-a270-c90555defb49', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('70966b0b-b6b3-44a4-8985-842bf1616d09', '36243f6e-2bb2-43ec-a270-c90555defb49', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('523d3d38-a59a-471d-a8fa-f5c31816acbd', '36243f6e-2bb2-43ec-a270-c90555defb49', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7f32e7d9-4d84-44ee-969a-db26b309fc29', '36243f6e-2bb2-43ec-a270-c90555defb49', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('70765b91-cb69-4731-8ce3-10b7d1a30976', '36243f6e-2bb2-43ec-a270-c90555defb49', '260', 'pendiente', 'Perfiladora LINCK - Engrasado (KP2K)', datetime('now'));

-- 2026-02-05 (Jueves) - Turno A - Semana 1
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('555adb6b-2234-4f36-b22c-fdd631e48af0', '2026-02-05', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('590d33d9-fcd9-4a34-a46e-68d01ae7e153', '555adb6b-2234-4f36-b22c-fdd631e48af0', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('53339015-5b8a-4c0f-ae12-5ca517f172eb', '555adb6b-2234-4f36-b22c-fdd631e48af0', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9dd96240-3cf3-4e2c-b89a-563a554de621', '555adb6b-2234-4f36-b22c-fdd631e48af0', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a7aa6715-d68e-499b-ba69-78df9a0e833f', '555adb6b-2234-4f36-b22c-fdd631e48af0', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7583bd7f-3383-4e11-a163-db57f300a228', '555adb6b-2234-4f36-b22c-fdd631e48af0', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('1643a1ae-67e9-4aee-8818-79cab62b41da', '555adb6b-2234-4f36-b22c-fdd631e48af0', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0a8264cc-bb7f-4b14-9af8-9c078b07937f', '555adb6b-2234-4f36-b22c-fdd631e48af0', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('af562710-84f4-40a7-958a-7d56337a4b74', '555adb6b-2234-4f36-b22c-fdd631e48af0', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ebd8e19d-5ad1-474a-8f3b-590c68c6dc66', '555adb6b-2234-4f36-b22c-fdd631e48af0', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ae79548d-f399-4c8b-9eb3-4a58c10d8b9d', '555adb6b-2234-4f36-b22c-fdd631e48af0', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f3fd1177-4b84-4de9-88a4-2728a6e41dc7', '555adb6b-2234-4f36-b22c-fdd631e48af0', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a8979102-9309-43a2-9a0c-670c9a404296', '555adb6b-2234-4f36-b22c-fdd631e48af0', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('42a2276e-9fed-4950-b058-9fbc9dadf544', '555adb6b-2234-4f36-b22c-fdd631e48af0', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('be605a3f-d39e-4ef5-9136-01702ce1f7c3', '555adb6b-2234-4f36-b22c-fdd631e48af0', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6a49b883-78dc-48ec-baf4-3447a1f2b93b', '555adb6b-2234-4f36-b22c-fdd631e48af0', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9446f788-1549-4bc2-b457-656e2d962480', '555adb6b-2234-4f36-b22c-fdd631e48af0', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b5139480-b34a-41f3-bfd6-0cd43683f4d5', '555adb6b-2234-4f36-b22c-fdd631e48af0', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b21e25c9-0e96-4e1a-b9f4-2083f7306c31', '555adb6b-2234-4f36-b22c-fdd631e48af0', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('862bdac5-1d9c-4e90-96d4-0414ea8dc71b', '555adb6b-2234-4f36-b22c-fdd631e48af0', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6042e0cd-5b92-4179-985d-228dc066455e', '555adb6b-2234-4f36-b22c-fdd631e48af0', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('655e3577-7d67-4cec-8f17-d1df90c17e8c', '555adb6b-2234-4f36-b22c-fdd631e48af0', '3000', 'pendiente', 'Cuchillos Descortezador LG - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a95f21a6-99f1-4c8c-a5e3-81c520328dc6', '555adb6b-2234-4f36-b22c-fdd631e48af0', '4200', 'pendiente', 'VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5ff4172b-7d75-4207-83b9-c33ceface41b', '555adb6b-2234-4f36-b22c-fdd631e48af0', '4210', 'pendiente', 'Carro VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a6479e26-e02a-46a3-9ac6-f8d8bcce690f', '555adb6b-2234-4f36-b22c-fdd631e48af0', '4250', 'pendiente', 'VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f8f2c9d5-c2f5-4e75-a800-04dc5d553893', '555adb6b-2234-4f36-b22c-fdd631e48af0', '4260', 'pendiente', 'Carro VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('cf665efc-e786-4723-94cb-0ac708175d5b', '555adb6b-2234-4f36-b22c-fdd631e48af0', '300', 'pendiente', 'FR-10 (sistema bijur) - Relleno bijur WD (DTE-24)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('da005877-e42b-4466-9b2e-b32c20fb668e', '555adb6b-2234-4f36-b22c-fdd631e48af0', '300', 'pendiente', 'FR-10 (WD) - Lubricación (Lubricación)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6df8b42a-d8f5-4aa9-9a38-7af6b20b391a', '555adb6b-2234-4f36-b22c-fdd631e48af0', '-', 'pendiente', 'Cadenas ALG planta baja - Aceitado (Aceite)', datetime('now'));

-- 2026-02-06 (Viernes) - Turno A - Semana 1
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '2026-02-06', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('324d6b53-190d-4340-8dbd-94cf443367a6', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('120229a0-907d-40ef-89b7-e6ace020b5b8', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a4e11eab-1116-42aa-92da-21982aaf6faf', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('61324b4d-fe4d-4927-beab-bc39e40f11aa', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5722fdaa-198b-4e6e-a608-e50ffee26d13', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('38cbb6a9-2945-4851-a5ed-e676eb4dbe22', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('57892a49-2978-42a3-acc1-2e5274bfbeca', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0c81d023-835c-4026-891f-cebeaaf0ab93', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('db6d8283-1abc-4a2c-a49d-fbdc08118295', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('81d7ad3a-5a78-47a2-88ae-04f857b82846', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('af4fdeec-bd46-448a-b074-20d49e6ba779', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('70270015-e416-43d1-a310-600a6d899c49', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('76bdc762-dc54-4d97-a247-b271a2b1048f', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('884d5787-e43c-49b3-9261-d26a3eb6461f', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('73d35c90-a06a-4c1c-b38c-13af68977581', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7d2d8334-a8be-464c-8490-ed3f41e5f4d7', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6297a364-58d6-4f24-8c7c-3f5d0eacd7d3', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c3916796-da5b-4350-9a36-c61d964f5d76', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('03d8a79c-8bef-4909-99ac-c85896b5a384', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('aaf2afd4-12f6-4263-9c21-7c85dcb49c14', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('36f92d30-0a54-4d94-b2bc-c8eb47be0a5c', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '4200', 'pendiente', 'Espárragos VQT-1 - Engrasado QUINCENAL (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ee860e61-720e-47d2-a666-5462e26aa769', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '4250', 'pendiente', 'Espárragos VQT-2 - Engrasado QUINCENAL (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('84bd2b88-9fc7-4a6f-a8b3-2b7e1ee70543', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '-', 'pendiente', 'Harneros - Engrasado QUINCENAL (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9f2747b8-4d7a-40c3-b916-b1502b2517f9', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '5500', 'pendiente', 'Máquina GRIMME - Engrasado QUINCENAL (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8fb84a97-d9eb-49cc-b604-27f665707c2c', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '3000', 'pendiente', 'Reductor Descortezador LG - Revisión nivel aceite MENSUAL (EP-150)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0063fe7c-b86b-42d7-989e-47f762ef1f0a', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '3000', 'pendiente', 'Motor reductor Descortezador LG - Revisión general MENSUAL (-)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('dad78179-cb76-4e19-91cb-bfbb4a9c06e4', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '3000', 'pendiente', 'Rodamientos y soportes LG - Engrasado completo MENSUAL (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8b3b880f-81bc-49a4-959f-cc9bdcbc861b', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '2100', 'pendiente', 'Reductor Descortezador LD - Revisión nivel aceite MENSUAL (EP-150)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('3d6fc024-f79b-418d-9e6a-d5927059842b', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '2100', 'pendiente', 'Motor reductor Descortezador LD - Revisión general MENSUAL (-)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('dbd406af-5619-4d20-af74-9357ddce148a', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '2100', 'pendiente', 'Rodamientos y soportes LD - Engrasado completo MENSUAL (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('47526114-e70e-46d7-a204-ad9cb2db7ee2', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '-', 'pendiente', 'Reductores ALG - Cambio aceite MENSUAL (EP-150)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e5597dd3-6979-428e-aba1-06ff80f673a3', 'cb5a86e1-2e91-47f0-87dc-aa95d9e60629', '-', 'pendiente', 'Soportes y rótulas - Revisión estado MENSUAL (-)', datetime('now'));

-- 2026-02-10 (Martes) - Turno B - Semana 2
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('832467a8-6220-4380-bd60-3c34e6f638d6', '2026-02-10', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('95ff5430-7e78-49c7-b831-506e3fea3df2', '832467a8-6220-4380-bd60-3c34e6f638d6', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('92987097-ee19-43f8-8499-a762543b3376', '832467a8-6220-4380-bd60-3c34e6f638d6', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('71f6e5d7-1c29-4486-97ae-89a3c6e32283', '832467a8-6220-4380-bd60-3c34e6f638d6', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('32edc98b-d097-4b2f-a9c1-aaa1f29063be', '832467a8-6220-4380-bd60-3c34e6f638d6', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b22719b0-609d-4e63-b48b-969306de9aad', '832467a8-6220-4380-bd60-3c34e6f638d6', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ba0fcd2e-28f1-4a8f-b27b-860daf987feb', '832467a8-6220-4380-bd60-3c34e6f638d6', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('23d84aa7-3041-4e14-b7e4-8df4817dc551', '832467a8-6220-4380-bd60-3c34e6f638d6', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('47ff6201-7a56-4858-854f-69465d41c0c6', '832467a8-6220-4380-bd60-3c34e6f638d6', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b85b3c21-9234-4960-b1f2-b1536281f005', '832467a8-6220-4380-bd60-3c34e6f638d6', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('866616b2-42b1-40db-b742-b42028c8ef82', '832467a8-6220-4380-bd60-3c34e6f638d6', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('eb726e33-6102-4409-9ab7-42bc26c39f3e', '832467a8-6220-4380-bd60-3c34e6f638d6', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2bf6fb96-b088-45d8-ad22-f7327e905282', '832467a8-6220-4380-bd60-3c34e6f638d6', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('93e55829-90eb-40f9-9ddf-8912f4fa2690', '832467a8-6220-4380-bd60-3c34e6f638d6', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8c36a370-3842-4acc-8ed3-23097f2137bc', '832467a8-6220-4380-bd60-3c34e6f638d6', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2d0d1b39-8ff6-446e-9e60-058ae39493be', '832467a8-6220-4380-bd60-3c34e6f638d6', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('65002962-81af-4409-a83d-31d3b5c1c66d', '832467a8-6220-4380-bd60-3c34e6f638d6', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('71a8e872-b9d1-460b-b8d8-a14c78f9f7ae', '832467a8-6220-4380-bd60-3c34e6f638d6', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('83991d40-f8ab-418c-b59a-20dd10a0c855', '832467a8-6220-4380-bd60-3c34e6f638d6', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9e607b34-3c92-4b75-996f-f50d27647b3d', '832467a8-6220-4380-bd60-3c34e6f638d6', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5cd20d62-60f5-4ba8-ad6d-af1aaafda295', '832467a8-6220-4380-bd60-3c34e6f638d6', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('cb5a6a76-7f43-4d8f-8cf1-c3b79de26998', '832467a8-6220-4380-bd60-3c34e6f638d6', '-', 'pendiente', 'Cadenas ALG planta baja - Aceitado (Aceite)', datetime('now'));

-- 2026-02-11 (Miércoles) - Turno B - Semana 2
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('ad7dd46b-730f-4fd5-9b09-35267736b406', '2026-02-11', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5170415b-45c3-4350-acfb-02a0f861f28d', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('1f9275db-e2ae-49fa-91f1-43529ea96081', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f9a3f7c5-208a-403c-ba48-dd32ffd73cef', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('fca3cb3f-1d15-4155-97b5-d619f64cbc01', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f0c851ed-26d0-46f2-bece-6c6e29490a6c', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('11a34149-589d-4fa2-bf3f-51d28aa951e6', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8f024e6c-ef8c-4759-a862-09db798f9161', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('95be5e06-a4bb-486e-8ba4-009b03adcc0e', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a5485bc8-ecb9-403a-9138-57e04d554ae9', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('d0f8d28f-6eec-42df-a8a4-aef654f798ef', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('cb925f0c-df8c-469a-be40-e0fe9093098a', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9e7ff72d-140e-4de7-a88f-a7bceb431bf0', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0579e04f-debd-43db-a3ef-37989e4d7cdc', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('dcd09054-a435-4518-bf53-9a3ea6e7cb0f', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('28068674-bcdc-4919-b5ff-bc5b9eac37c0', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b459422b-fed7-4c9e-935f-1daea0adbd78', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9fd0ed7f-dd82-4883-a964-5d0fa10d6ef9', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b6eae58b-2cf6-4885-bc87-668b4021eae2', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('dd230bab-ea01-4371-b898-3e071e959f51', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('fc3452e8-e697-45d0-9c91-4c4aceeee9fc', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a3df0c74-1e31-4521-a8f5-52d6a35902c6', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '3000', 'pendiente', 'Cuchillos Descortezador LG - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a67b00a2-976c-427e-97d3-a19894d4f038', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '4200', 'pendiente', 'VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e2fabed1-06b1-41c9-ac43-4d4e858de9c3', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '4210', 'pendiente', 'Carro VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('91b65d08-f994-4042-b72f-910f1fd64332', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '4250', 'pendiente', 'VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('53fcdf21-fa7d-4862-90d5-afd118331782', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '4260', 'pendiente', 'Carro VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5daccf38-1861-43b7-bed4-3797e0369050', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '300', 'pendiente', 'FR-10 (sistema bijur) - Relleno bijur WD (DTE-24)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('73682cec-2f6d-43c9-b8a2-aaa75401bf4a', 'ad7dd46b-730f-4fd5-9b09-35267736b406', '260', 'pendiente', 'Perfiladora LINCK - Engrasado (KP2K)', datetime('now'));

-- 2026-02-12 (Jueves) - Turno B - Semana 2
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('803b4055-e3df-4145-a63a-fb6f5196d614', '2026-02-12', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2e76d015-cafa-4157-a3de-0ebebcf8d016', '803b4055-e3df-4145-a63a-fb6f5196d614', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9fc521fe-764c-49f7-b983-91bfea6757ba', '803b4055-e3df-4145-a63a-fb6f5196d614', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('cdf88e05-5530-4b55-a1a0-5f62e3c32e46', '803b4055-e3df-4145-a63a-fb6f5196d614', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('3e0fbd1a-9df2-479b-b6c6-db64a03be9a2', '803b4055-e3df-4145-a63a-fb6f5196d614', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f5c6b765-d486-47fd-88c0-475e45edfc60', '803b4055-e3df-4145-a63a-fb6f5196d614', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('bcfcb893-9fb4-4987-938c-5bba6bde0a02', '803b4055-e3df-4145-a63a-fb6f5196d614', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5f9b0e05-65c5-4005-acf1-11d1c9eebc15', '803b4055-e3df-4145-a63a-fb6f5196d614', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0d18d670-f7b3-4315-93db-976bc9d1980f', '803b4055-e3df-4145-a63a-fb6f5196d614', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('dfab38d6-2a9a-4121-bc46-312643149ad0', '803b4055-e3df-4145-a63a-fb6f5196d614', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0e54838d-e7f7-4d48-8cb4-60b765f712dc', '803b4055-e3df-4145-a63a-fb6f5196d614', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0c70d7c9-8e96-41ba-aada-ca586467aed6', '803b4055-e3df-4145-a63a-fb6f5196d614', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b13cec46-d46f-4edf-8adc-327d2ee9c8ca', '803b4055-e3df-4145-a63a-fb6f5196d614', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9e8a29b0-edac-47be-a2b6-561c9de19c5c', '803b4055-e3df-4145-a63a-fb6f5196d614', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('1a81dbb0-bc02-45f1-bebc-5272553fd019', '803b4055-e3df-4145-a63a-fb6f5196d614', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5c5badd9-86fb-4030-ac23-060cf0aa5df1', '803b4055-e3df-4145-a63a-fb6f5196d614', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6dc9dffd-10b7-4f56-a8ff-df73a6d6f26f', '803b4055-e3df-4145-a63a-fb6f5196d614', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b4e1e940-c8e4-433e-96b3-a4bd6427b6b9', '803b4055-e3df-4145-a63a-fb6f5196d614', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('93c1f812-1d39-425e-9b9a-be9bb2a09a46', '803b4055-e3df-4145-a63a-fb6f5196d614', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('cc7a115f-f5a0-499a-9315-59cac3f88423', '803b4055-e3df-4145-a63a-fb6f5196d614', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('593e0cd6-14b1-4c11-811e-1a9670258a4b', '803b4055-e3df-4145-a63a-fb6f5196d614', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('cb3331fb-c67f-4ae6-ae22-3793d3c86941', '803b4055-e3df-4145-a63a-fb6f5196d614', '300', 'pendiente', 'FR-10 (WD) - Lubricación (Lubricación)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('377c1756-b7f8-428e-8a8d-97e33753f281', '803b4055-e3df-4145-a63a-fb6f5196d614', '-', 'pendiente', 'Cadenas ALG planta baja - Aceitado (Aceite)', datetime('now'));

-- 2026-02-13 (Viernes) - Turno B - Semana 2
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '2026-02-13', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('60c7ac80-f515-4a6f-b9b8-0f3cb1977143', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6535b737-d115-48db-b0e1-52e58b668b75', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('712b8a04-0532-4737-b241-7c97490b2f57', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c3bb59f8-ca04-4364-96c1-42337469297b', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c4376dac-2966-4541-aa4c-999ab2fee0cc', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2b0d9ad2-6afc-4b98-aa9a-500d4deb0214', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9ba65fd7-7e8e-451d-aed2-dff013e22981', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('999f818e-6a09-482a-8ed4-b5017645e630', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ae19ab98-2c8f-456c-a010-9c2ca2e52260', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c9340743-2ac3-457e-af71-2042f22c37db', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9c6622ec-1d79-4646-b58d-2da9fe503e1c', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('4449e77a-03f5-4ba3-a68d-e7d50deedd87', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7c1bd15f-a3c0-406b-8494-ab259db77c1b', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('57e1ecb1-6e52-486f-8448-bc8d4adf2a6c', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('be6ead20-0926-49aa-8431-2ec4d2e30688', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5ae03bf2-8099-4b42-957b-2214332527b5', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e0570056-7606-4c54-ba07-28e97438ccd3', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e6695be1-8a90-4d54-94a4-f2c91af6fe6a', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c5f0fe85-021c-4ad7-810d-1ff0cc5072b5', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7ec1d031-ad55-417d-9431-335c4049be68', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e600871a-033a-4f4b-9b2e-53408a6c6db7', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '3000', 'pendiente', 'Cuchillos Descortezador LG - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b6d93ac5-32b5-4993-9219-602498232124', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '4200', 'pendiente', 'VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8c5358be-1622-466b-ace9-ed134d9d6e45', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '4210', 'pendiente', 'Carro VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('d874a9d6-0917-4d65-a764-4da82d167ad2', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '4250', 'pendiente', 'VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('4b8e1b3e-e2d9-43e1-a2dd-49dd784a4dc4', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '4260', 'pendiente', 'Carro VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('fac98ed3-d02f-47ae-9325-ea65e97a841b', '07aa0f43-6a96-4fcb-b5be-9f7f60f07859', '300', 'pendiente', 'FR-10 (sistema bijur) - Relleno bijur WD (DTE-24)', datetime('now'));

-- 2026-02-14 (Sábado) - Turno B - Semana 2
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '2026-02-14', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('eeaff54e-38ab-4c76-9840-ef508c0f9fab', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9522eae8-8d8a-4d05-85a8-85750cdf0ca2', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6054fd1f-9a1e-4455-9421-33033f898bf7', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9d6b7b67-63c7-473e-bfab-5f0d9571f028', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('571d9ed0-3172-4a57-a75d-30f9ec6fe17b', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c1eb6a21-3a4b-4f78-b5dc-1c9f40a88c23', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('65874884-eff4-4e4c-be2b-fa6e8c266979', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('eeb1de02-3032-470e-b6e7-b6f2199b0f1b', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('db27ff15-3fca-49e8-ac11-0dd36d3b8e13', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('84eabcc7-5e59-4226-bfc8-c833a3bb68e7', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ec8ebaf5-994c-4fcf-ab94-b8bb145b2df6', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('fdf42141-0dc9-4301-955c-3bcd9b6b7e8a', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e3192f0f-1d1e-409e-86c2-0ad10d60431a', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b7426903-48f3-4424-869f-684f295f7c8e', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('bac30dc6-2f55-486b-a51f-05eaefbf9a38', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('298d118c-3a95-49b5-8079-5e8efbe88413', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8e94af6e-1a08-4e5f-9121-9b162fc8a0a1', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('897a63ed-32f3-4daf-8520-9041329dcf52', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('29946c2c-e2b7-4530-8e34-5e2affe4a0c2', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2a4de532-a455-4288-99ad-b2288b7c2a34', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('edd2d70e-c899-4656-b188-63cf9c29b8a6', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '3000', 'pendiente', 'Rotor Descortezador LG - Lavado + cambio aceite SABADO QUINCENAL (80W-90)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('187d690a-f658-4e63-99b2-3c6b8088988e', '5fc6a9d7-08c9-4bbd-a923-85767d5205f0', '2100', 'pendiente', 'Rotor Descortezador LD - Lavado + cambio aceite SABADO QUINCENAL (80W-90)', datetime('now'));

-- 2026-02-16 (Lunes) - Turno A - Semana 3
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('1e250ace-c585-4d41-b677-52f7242f552f', '2026-02-16', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('eda1e898-24a9-46a9-b787-2f3db6aa91a9', '1e250ace-c585-4d41-b677-52f7242f552f', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('35dd59cf-f55b-4d75-a374-238ec26439f6', '1e250ace-c585-4d41-b677-52f7242f552f', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('725a160d-4564-4c9c-ba08-b59527685af8', '1e250ace-c585-4d41-b677-52f7242f552f', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('60fa6870-701c-4d96-899d-1acfa36d557f', '1e250ace-c585-4d41-b677-52f7242f552f', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('91893260-1aad-448b-a6ec-7b64c8ba62d1', '1e250ace-c585-4d41-b677-52f7242f552f', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('930ca2e8-08f7-4651-9681-fdf443aa1b26', '1e250ace-c585-4d41-b677-52f7242f552f', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('3c18f79d-4c03-4b13-b137-8dc2a0859f60', '1e250ace-c585-4d41-b677-52f7242f552f', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0a89075e-34cc-4de5-a05e-869419e2efb2', '1e250ace-c585-4d41-b677-52f7242f552f', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('814ed5ef-0660-4b8f-8e8f-288715b773ae', '1e250ace-c585-4d41-b677-52f7242f552f', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0de00ac9-0f50-4599-9127-47c23f4293b4', '1e250ace-c585-4d41-b677-52f7242f552f', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e1a66462-b0b9-466c-95c5-4b12f69d54c5', '1e250ace-c585-4d41-b677-52f7242f552f', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ee8817fb-ffd6-434b-a6b7-faf1d7604516', '1e250ace-c585-4d41-b677-52f7242f552f', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('eeb76e90-36ff-47a1-b348-5b98ea422a4c', '1e250ace-c585-4d41-b677-52f7242f552f', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8e4ffdce-0133-41db-801e-6ac93478af89', '1e250ace-c585-4d41-b677-52f7242f552f', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c1b7df94-faa8-450e-b78c-416160c88d24', '1e250ace-c585-4d41-b677-52f7242f552f', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c9afcd03-e0ee-4238-8db4-9d302a337bbe', '1e250ace-c585-4d41-b677-52f7242f552f', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2218c042-9e6b-45cb-9846-66bd9f32ffc2', '1e250ace-c585-4d41-b677-52f7242f552f', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('681dc536-d31e-4fa3-b5e5-d224625bff87', '1e250ace-c585-4d41-b677-52f7242f552f', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6f06c14d-ef0a-4e85-b32e-39edd814bf62', '1e250ace-c585-4d41-b677-52f7242f552f', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e759dd31-91f5-4310-af5b-a74d7393e04e', '1e250ace-c585-4d41-b677-52f7242f552f', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));

-- 2026-02-17 (Martes) - Turno A - Semana 3
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '2026-02-17', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c498ce11-9519-4462-9c6a-6a6de94856f2', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2e08aca8-ddf2-4177-85bd-5a3eca70f251', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('284581e9-00b4-4991-80e6-e112f46a793a', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a9816c73-d872-4667-baad-0e78fdb96f0b', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('815beeaf-1863-4b36-bca9-a001a4436766', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b18a3673-bd21-44a9-a30b-3221df6b8d8e', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f17bffdd-34d2-4014-a368-fc058f4f7eef', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('96db2f8a-1e4c-47d4-a450-8d8197586697', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f7469e41-6d9b-4c8c-b2b0-83ede31f7469', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('18ad13b2-ebe3-434b-a55e-765ad4a13429', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9cd7ee8f-8005-4b33-ab5d-7e146233fd51', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ddb1d502-736e-4f6a-9c9c-805ca297d839', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5f5c50e0-e20d-4d6f-8f12-59b4b2631c19', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2b5349a6-297b-424a-a6ab-f8ad4b619fb0', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('def01a65-7753-48ed-907a-c84aa96229dd', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a2eaf434-837f-4d2b-9fbc-f15c587b3dae', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('93301715-be50-4e82-893e-b845c8671a02', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('df710abc-d65b-4492-8144-82c177d16a95', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b6bb6055-54a2-4d54-a9d4-3ecfec4509d4', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2a293279-1d59-45eb-9671-ccc9de613e4c', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('129d1df8-6ed4-4313-b1bb-87acc205f53e', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '3000', 'pendiente', 'Cuchillos Descortezador LG - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a625db8b-471c-4c36-98c0-4b9d663e7856', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '4200', 'pendiente', 'VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('df8a291a-3eed-4c5f-a716-c03d9c453ccb', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '4210', 'pendiente', 'Carro VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('d2892584-ac29-496c-ba5f-307fc6b7c080', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '4250', 'pendiente', 'VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8d09bc87-1206-4709-9056-06110a77fc14', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '4260', 'pendiente', 'Carro VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a96d6ee2-14c2-4848-a67a-f1cf54923fc2', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '300', 'pendiente', 'FR-10 (sistema bijur) - Relleno bijur WD (DTE-24)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('296cd3b3-e73f-48fb-8ebb-933cc8e22fe4', 'a0993e0a-c2d7-4060-b81d-8d51c538bbe0', '-', 'pendiente', 'Cadenas ALG planta baja - Aceitado (Aceite)', datetime('now'));

-- 2026-02-18 (Miércoles) - Turno A - Semana 3
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('b22bb088-8148-4f78-b56c-3c5f01052384', '2026-02-18', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('95cd1da8-3ed5-4dc3-bdd1-034348e05662', 'b22bb088-8148-4f78-b56c-3c5f01052384', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f33e5b59-cec9-424f-8914-94d5aef343f8', 'b22bb088-8148-4f78-b56c-3c5f01052384', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('3214927b-33eb-43f7-84c0-1b0e3c6983a8', 'b22bb088-8148-4f78-b56c-3c5f01052384', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('3e4f46ae-f392-448b-b2d3-7bb2ed251379', 'b22bb088-8148-4f78-b56c-3c5f01052384', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b4189eb2-e3dd-41d2-a6e6-4e3aea1bb764', 'b22bb088-8148-4f78-b56c-3c5f01052384', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('31e921d3-f277-4547-b955-aaade3197c82', 'b22bb088-8148-4f78-b56c-3c5f01052384', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('98eb461a-9198-401b-8a55-e1edc17d8012', 'b22bb088-8148-4f78-b56c-3c5f01052384', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9b17c768-4994-435d-9d68-3e9751c433cc', 'b22bb088-8148-4f78-b56c-3c5f01052384', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('53262507-0581-4f5b-8bee-a324fd44c6bf', 'b22bb088-8148-4f78-b56c-3c5f01052384', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('338fdde3-eab6-433b-a7f8-c852325d527b', 'b22bb088-8148-4f78-b56c-3c5f01052384', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('be686c43-8c67-403b-a019-62ed7a6ccbb1', 'b22bb088-8148-4f78-b56c-3c5f01052384', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b19ccafa-fcd9-4937-93b6-3305901085c1', 'b22bb088-8148-4f78-b56c-3c5f01052384', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e4100273-e540-4b12-9e71-6d0ee3e09611', 'b22bb088-8148-4f78-b56c-3c5f01052384', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0120afa8-8589-4b16-b1fe-84fc3736c90f', 'b22bb088-8148-4f78-b56c-3c5f01052384', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('3e3501aa-3c21-4fcd-8bfa-4cebc70f97ee', 'b22bb088-8148-4f78-b56c-3c5f01052384', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9ba2555b-fa74-45fd-a085-dca90dd75efa', 'b22bb088-8148-4f78-b56c-3c5f01052384', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('08b12cde-f765-438a-93a9-e26c765090e5', 'b22bb088-8148-4f78-b56c-3c5f01052384', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2204126b-5f21-4e5f-8906-f8bb67274719', 'b22bb088-8148-4f78-b56c-3c5f01052384', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2bd916fa-c6bb-4f5c-8c37-d39ce2f85cdf', 'b22bb088-8148-4f78-b56c-3c5f01052384', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7953855e-c119-42a8-9902-9a5a2447c5f3', 'b22bb088-8148-4f78-b56c-3c5f01052384', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7f29239e-dd68-4278-8187-647f5a8f5361', 'b22bb088-8148-4f78-b56c-3c5f01052384', '260', 'pendiente', 'Perfiladora LINCK - Engrasado (KP2K)', datetime('now'));

-- 2026-02-19 (Jueves) - Turno A - Semana 3
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('56824325-34b2-422a-b701-74edfedb946c', '2026-02-19', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('07424aeb-4c92-4c48-8471-805283e26822', '56824325-34b2-422a-b701-74edfedb946c', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2cdff9bd-6924-432c-a10e-0538920ed325', '56824325-34b2-422a-b701-74edfedb946c', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a517daef-e875-4af5-80d1-29a96aa6ed82', '56824325-34b2-422a-b701-74edfedb946c', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0defb072-eb0c-4b4d-924e-cd09e47b9f36', '56824325-34b2-422a-b701-74edfedb946c', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('1a3bc7c1-7a1f-4bd4-864e-e74964a5a3d0', '56824325-34b2-422a-b701-74edfedb946c', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('07d060c9-66f0-4f61-8639-fbcbef5c1697', '56824325-34b2-422a-b701-74edfedb946c', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('d0c7fb01-5d05-462a-9b93-e9a686956180', '56824325-34b2-422a-b701-74edfedb946c', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('698e04a0-165f-4e6e-ba4d-3de56647b98c', '56824325-34b2-422a-b701-74edfedb946c', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('103de0e5-10a2-4018-a9fa-066b0bede813', '56824325-34b2-422a-b701-74edfedb946c', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a5044e6c-2023-4726-8304-6ea5b8baf91c', '56824325-34b2-422a-b701-74edfedb946c', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('373c46e3-b505-4571-b484-3bd0cddffed5', '56824325-34b2-422a-b701-74edfedb946c', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('96d8ab5f-7d32-49da-82b6-db0ef59c07bc', '56824325-34b2-422a-b701-74edfedb946c', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0bc54b92-39a5-438f-9983-151f29122c93', '56824325-34b2-422a-b701-74edfedb946c', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('61427b09-8684-4560-8db1-985bffc4d241', '56824325-34b2-422a-b701-74edfedb946c', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e1347db9-e681-4e6b-8aca-4d0f2f1222e4', '56824325-34b2-422a-b701-74edfedb946c', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0d1503f9-0ea5-4470-aa6f-f8ab8dfea436', '56824325-34b2-422a-b701-74edfedb946c', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('61553b08-23e9-42b3-98a2-9e2f566eead5', '56824325-34b2-422a-b701-74edfedb946c', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a69273b9-1999-4501-8b27-2a86700d2503', '56824325-34b2-422a-b701-74edfedb946c', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('41fa0ddf-d870-4056-88e1-f4792c2b825e', '56824325-34b2-422a-b701-74edfedb946c', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b205184f-053d-4fe0-98f5-4fb99a764316', '56824325-34b2-422a-b701-74edfedb946c', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f89922ed-bbf8-4457-878c-1ab4331780a6', '56824325-34b2-422a-b701-74edfedb946c', '3000', 'pendiente', 'Cuchillos Descortezador LG - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0da8234c-6664-434d-9a87-7a3b119c9231', '56824325-34b2-422a-b701-74edfedb946c', '4200', 'pendiente', 'VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5fdb893b-d24b-4c00-824f-554bcfe583cd', '56824325-34b2-422a-b701-74edfedb946c', '4210', 'pendiente', 'Carro VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0270929e-012c-4a07-bbc5-1946e9189fb1', '56824325-34b2-422a-b701-74edfedb946c', '4250', 'pendiente', 'VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('730cb856-f0b7-46a8-962b-335dd719812e', '56824325-34b2-422a-b701-74edfedb946c', '4260', 'pendiente', 'Carro VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('17f1a6a9-fc6e-4757-a25e-c01e0772be53', '56824325-34b2-422a-b701-74edfedb946c', '300', 'pendiente', 'FR-10 (sistema bijur) - Relleno bijur WD (DTE-24)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('66d7aed3-86ee-4014-ac3a-925d80412881', '56824325-34b2-422a-b701-74edfedb946c', '300', 'pendiente', 'FR-10 (WD) - Lubricación (Lubricación)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('3e8caece-09c6-4345-b458-ae69d282f175', '56824325-34b2-422a-b701-74edfedb946c', '-', 'pendiente', 'Cadenas ALG planta baja - Aceitado (Aceite)', datetime('now'));

-- 2026-02-20 (Viernes) - Turno A - Semana 3
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '2026-02-20', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2341fc46-18dd-4d1f-83dc-a0d2fcf1e539', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('d0ca64a9-ce6f-49c3-8ab1-b6963a9ccff5', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5e066cfa-bf39-4cf5-bbf2-da6082a6e86f', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7d92c265-8149-4111-8932-e0b6290a5e15', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('cd2d55ef-6708-4f1c-973b-f54f843f71cb', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('37fb38f6-5f9e-4a64-a41d-429b4cf20b79', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f23b3c0e-035c-491e-bff2-8c4d052e8957', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('defa4ec5-11be-4fed-90a2-951b6108fdc5', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0cd561ed-9aa0-44de-9d13-93fed97ce970', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('bc0ebcdb-19df-4a03-8fd9-91a8df5eaa42', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('342cdab4-e575-489d-9b15-eec19f89dc30', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('eadaddab-8681-4f8f-b60b-fd31ba484d59', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c5a03411-90f6-4c8a-9a03-104733edddc1', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('cfd7b03b-6a6b-43e9-9edb-51f448f8f5ec', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('d0fd179f-4690-4391-9ef8-3e2d0ff2bdf1', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8f9cb47e-580c-4571-a25d-0366299a0fb9', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('4989be6f-3608-4792-a82d-0494c37660f6', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9c9779b4-0074-41f8-a142-a101332e7537', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e522a45b-d9c6-432c-b1a3-967bed353b6f', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('706afa1e-f181-4ab0-91ad-8f7247fb8885', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5edadd9f-67b9-41f7-95ab-81acc740d573', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '4200', 'pendiente', 'Espárragos VQT-1 - Engrasado QUINCENAL (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('89180481-feba-4c59-b2f0-0a292dc1fdcc', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '4250', 'pendiente', 'Espárragos VQT-2 - Engrasado QUINCENAL (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9a1afd6a-a619-4d98-800c-17ba7f2188ce', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '-', 'pendiente', 'Harneros - Engrasado QUINCENAL (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('fd193501-9807-4731-ac62-bd77e57d2fce', 'bb9f226e-b2e4-4c96-8d4b-f66e0b12f06e', '5500', 'pendiente', 'Máquina GRIMME - Engrasado QUINCENAL (Grasa Azul)', datetime('now'));

-- 2026-02-24 (Martes) - Turno B - Semana 4
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '2026-02-24', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('89ca4be5-b4ef-498b-ad1d-e563e128bc2a', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('dd684abf-d3b7-4154-9933-3c2bb3103385', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2a3f40a8-64cf-439c-9960-2b3b3ff31267', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ebb6956d-02b2-4221-91a1-ca1f576eeb66', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('92ed5c76-3246-4cc6-8228-0afd6387c87c', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e36b0c4e-8ff6-4bf7-b006-edafba8272fa', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('1622901e-ea41-4de7-adbe-459ae4088b7a', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('dcf1217c-dd2e-47b7-8e09-5333f3139daa', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f8ec745b-0fc8-4001-856e-cbbdc707e19a', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b8f0b22b-b6cf-4816-9553-7603bdb7083f', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c5df59dc-5200-4dec-95f3-ba032a527290', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('945ed2e5-11aa-4cbd-bfa6-899db4892267', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b971d2ec-82d0-41fa-967d-d0200ef554a3', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('67dfc51d-f2e2-4c73-ae41-022d92a9f3c9', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('840bc8f9-1ebe-4a2c-8946-02ac16217673', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ea6436f9-f9e7-427f-97c5-d52a1d14267b', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('27c6921f-8dde-4d28-859b-ee0712db0670', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c9f63bc1-1bd8-48c5-bf82-0c7dd0a6144f', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a69d3fb3-495a-4a95-87bb-759d5ff8c24f', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('eb9e615b-2985-4799-8674-23efea1ce19e', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('403e4255-5277-4121-836e-dd251b878aa6', 'b65bc3cc-2ffb-4fc2-8385-f709f8a78145', '-', 'pendiente', 'Cadenas ALG planta baja - Aceitado (Aceite)', datetime('now'));

-- 2026-02-25 (Miércoles) - Turno B - Semana 4
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('89382741-d65b-4c10-a730-e6d8908ea182', '2026-02-25', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7d977e4d-f94a-461a-8fe9-22e6a61338a0', '89382741-d65b-4c10-a730-e6d8908ea182', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('236782e0-b209-43b7-a5d7-f96a8ebc1245', '89382741-d65b-4c10-a730-e6d8908ea182', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('56c2f4ef-07a5-446d-99d8-20be0616c3fa', '89382741-d65b-4c10-a730-e6d8908ea182', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('d87fcdb6-6678-4fb1-a471-1b8e4cb6cb0b', '89382741-d65b-4c10-a730-e6d8908ea182', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ccd39ab4-6de1-4d2a-904f-383e40ba559b', '89382741-d65b-4c10-a730-e6d8908ea182', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('cd7f3a1a-f0a2-4d4f-b442-6280bc459e98', '89382741-d65b-4c10-a730-e6d8908ea182', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('069f7187-0373-4d67-a0a7-d205076be2ef', '89382741-d65b-4c10-a730-e6d8908ea182', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5670eca5-a6ed-49d8-bda5-cd026011316f', '89382741-d65b-4c10-a730-e6d8908ea182', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('09ae64ff-3f64-4520-8e3f-11c773c4cc6f', '89382741-d65b-4c10-a730-e6d8908ea182', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ef851546-843f-4c14-a420-fd0a8a824e6d', '89382741-d65b-4c10-a730-e6d8908ea182', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6beb7f9d-0a97-40c6-99e2-85b140b30ca0', '89382741-d65b-4c10-a730-e6d8908ea182', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2bcb1cbc-c3e0-4a61-8057-62f5cf25fa15', '89382741-d65b-4c10-a730-e6d8908ea182', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b234bcff-b705-4262-b24b-3ef4d702805e', '89382741-d65b-4c10-a730-e6d8908ea182', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7f83b0da-2385-4f50-9325-b242dfe30e85', '89382741-d65b-4c10-a730-e6d8908ea182', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0513488a-040c-4891-9c27-4473379c458d', '89382741-d65b-4c10-a730-e6d8908ea182', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7263de33-7eac-4d91-9f73-48f5c7f8bbcb', '89382741-d65b-4c10-a730-e6d8908ea182', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f17dc244-70f7-4d1d-88c4-4523c1488447', '89382741-d65b-4c10-a730-e6d8908ea182', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c5302034-3013-47b6-8d2d-bde9afafc092', '89382741-d65b-4c10-a730-e6d8908ea182', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0b190413-9a30-447f-8e94-78110c201757', '89382741-d65b-4c10-a730-e6d8908ea182', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8a65dcc6-05e0-4f02-8c08-db027dec6adc', '89382741-d65b-4c10-a730-e6d8908ea182', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a85ff3a4-722a-4144-87f0-35b541317f60', '89382741-d65b-4c10-a730-e6d8908ea182', '3000', 'pendiente', 'Cuchillos Descortezador LG - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('6caef035-ac9a-4ce0-ad2b-ca60cf191680', '89382741-d65b-4c10-a730-e6d8908ea182', '4200', 'pendiente', 'VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('3ef13005-a0e3-4e84-8126-82f7dfab481e', '89382741-d65b-4c10-a730-e6d8908ea182', '4210', 'pendiente', 'Carro VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('af26e92d-6c37-464b-bee5-f25a018946f1', '89382741-d65b-4c10-a730-e6d8908ea182', '4250', 'pendiente', 'VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('901b397c-558f-4ea7-acb5-2af2e4a6ad64', '89382741-d65b-4c10-a730-e6d8908ea182', '4260', 'pendiente', 'Carro VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0b8cbb98-abc5-4478-9314-1809c45ee435', '89382741-d65b-4c10-a730-e6d8908ea182', '300', 'pendiente', 'FR-10 (sistema bijur) - Relleno bijur WD (DTE-24)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('881079ac-3fea-4710-90f3-b207f71bd2bd', '89382741-d65b-4c10-a730-e6d8908ea182', '260', 'pendiente', 'Perfiladora LINCK - Engrasado (KP2K)', datetime('now'));

-- 2026-02-26 (Jueves) - Turno B - Semana 4
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('cdecf0ac-9c36-4c79-ba1e-30fba814af66', '2026-02-26', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a4b45790-44ce-426c-848c-9454e09239a5', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('4787bd9e-fd51-4255-86a1-b26e8c825465', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('447aa1f4-c265-4ed1-8fc5-7446330b9e65', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a36df33c-25a9-4cec-880a-6f2d56b3e745', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('80eba659-2ddb-44c4-812a-78cef0b44cd8', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('09dc6f5b-cbcc-4849-ba99-f8d3d876f9af', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('facfed4d-c089-420c-9011-abf3836bece7', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('20c247c3-0d72-4c89-b4d6-5ec501f20e9d', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('bafe0488-8678-446a-a332-714b0d7e95dc', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7a8f7218-89f4-44e8-9d90-daaccc900804', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('e37fba0f-bbbe-4f04-a4e5-0b84f8c930e9', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('d7d9baf5-db15-4a3d-8127-7062eff7acf4', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('0d1b98db-42df-473a-91df-81add5d1580d', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ed15315f-81e1-4b32-bf36-9ab381601aee', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2948031f-3f44-4ea7-9b67-e22b9ba7a49a', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('70d80205-a533-46ea-9684-26980af0d92c', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('315500cd-641c-48bb-b8d4-9f7c5f6d2269', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('eb1f6b4e-61b3-47b5-abfc-a2b359d13b5f', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('f49babe5-3676-4e88-ac05-3a76aae5bdee', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5d7f36a8-1c67-43cd-92c8-96906182491a', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2e9b0e6d-cbd4-4948-9012-b64ca503da1e', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '300', 'pendiente', 'FR-10 (WD) - Lubricación (Lubricación)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('43c4ebf4-783f-4723-a01e-0c59705d33ff', 'cdecf0ac-9c36-4c79-ba1e-30fba814af66', '-', 'pendiente', 'Cadenas ALG planta baja - Aceitado (Aceite)', datetime('now'));

-- 2026-02-27 (Viernes) - Turno B - Semana 4
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '2026-02-27', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('23d592ec-18a2-48ef-a1af-1dd7ea2cafa1', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('45606233-f704-4c51-a793-95dc5a913aea', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('a42d2b8d-8760-4541-aced-808af374698b', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('2727fdb9-92b4-4ad9-afe0-ae01351e67fb', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b17690b4-5f85-43ac-a1c2-ed02ce6437b8', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('fb7dd67c-5ff0-46e3-9117-359545c65cfd', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('beee12cb-2081-4d3a-8b7c-5c3351ba5ee8', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('23d043ac-c0a7-49ee-bbeb-e6b6ddf1cabd', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('bd0edff2-31af-4de7-8f0d-603d03ac0c43', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('73c834cf-a33f-4e00-bd24-66ab18b59552', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ef6e18a4-0d23-496d-8f16-6777aa6978b6', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('710f2dcb-da93-4118-9607-cadf26ebc136', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7b540ab0-b37d-4fc2-a7c7-d24eba116a04', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('93753aea-6b51-42de-9c34-0c886051c229', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8d15fe70-afe0-4f17-a101-5a54f4d67f97', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('143e7d9f-486b-4b11-b8c1-cee6f594e57e', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('fd582392-8dd5-4a87-8f03-db121b6535f5', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('97f751e9-e887-4b1b-9559-4d0cdd73ddd8', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('c622e5f4-33c6-415c-aa87-98a5c4634060', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('870a1aa3-d5fb-4d3d-a1ef-f988397c3600', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('44c2f2a2-29cf-43bb-9108-fc6247fdb391', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '3000', 'pendiente', 'Cuchillos Descortezador LG - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('75c0e97e-456b-4de0-95cf-d4099151d97a', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '4200', 'pendiente', 'VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7aa27220-957b-4eb7-be6b-94a9aa1c7407', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '4210', 'pendiente', 'Carro VQT-1 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('481d4091-be2a-4c4b-86ee-c5da8e80336e', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '4250', 'pendiente', 'VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('92e4c5fa-e87c-4473-b8b0-82c68190cf5a', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '4260', 'pendiente', 'Carro VQT-2 - Aceitado sistema (Aceite sist.)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('4ee2f117-58c2-449b-b4f2-68f3e4a2f0d3', '1b44cc51-98d1-4ee8-8d3d-f51fc7d87163', '300', 'pendiente', 'FR-10 (sistema bijur) - Relleno bijur WD (DTE-24)', datetime('now'));

-- 2026-02-28 (Sábado) - Turno B - Semana 4
INSERT INTO work_orders (id, scheduled_date, status, created_at) VALUES
  ('b3a5ce7f-3e83-44ad-8875-1682b19e083c', '2026-02-28', 'pendiente', datetime('now'));

INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('02c9782e-9234-4797-b61a-2118dc4cad83', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '3100', 'pendiente', 'Cadenas Descortezador LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('ce6c5db8-8c9b-476f-8718-f406e9252240', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '3200', 'pendiente', 'Cadenas alimentación LG - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('45321b64-129c-4bb0-8f5e-00161a794db1', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '3002', 'pendiente', 'Central hidráulica LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('082d4577-ccbe-4e65-b1f0-9d4d9a4f95b7', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '2100', 'pendiente', 'Cuchillos Descortezador LD - Engrasado (Grasa Roja)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('8c9bbb41-08a9-4f21-a176-621d49e36a87', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '2100', 'pendiente', 'Cadenas Descortezador LD - Aceitado (Aceite)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('b163f662-3dbf-446b-b275-3183f29d783c', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '1350', 'pendiente', 'Central hidráulica DAG izq. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('dc4e7b31-7bf8-4af8-b873-977f4ef8ef76', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '1810', 'pendiente', 'Central hidráulica DAG der. - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9fe69ef0-ae80-42c2-9dc6-5192e75abb0d', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '150', 'pendiente', 'Shipper Canter 1 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5a7e6081-0f65-470f-b190-608b80474282', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '220', 'pendiente', 'Shipper Canter 2 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5d4f726e-b363-4562-a68c-174e9aa30651', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '42', 'pendiente', 'Central hidráulica Canter 1 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('edf155a2-16bd-48bf-9bae-bb59ca25a8a8', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '40', 'pendiente', 'Central hidráulica Canter 2 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('498cb005-38ce-47e2-8049-dfcb6548b341', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '43', 'pendiente', 'Central hidráulica WD - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('879aae58-5065-479b-a704-e7031599305e', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '41', 'pendiente', 'Central hidráulica 2900 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('7183424e-1915-44b2-a230-076190546f05', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '4800', 'pendiente', 'HMK20 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('9a7a3f12-8351-45da-a723-3dc8ebc3d6ff', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '5050', 'pendiente', 'Canteadora LINCK - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('d1e5f883-93c8-40eb-ac10-3be6ae4d3718', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '5750', 'pendiente', 'Canteadora ESTERER - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('4917243c-47ce-44a5-9324-0c08b7fb6d36', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '5300', 'pendiente', 'Canteadora CM500 - Engrasado (Grasa Azul)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('5a228315-5634-4802-a931-8ca199e84417', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '4810', 'pendiente', 'Central hidráulica HMK20 - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('844e428b-00fc-4733-b8a8-4d9849bec607', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '5060', 'pendiente', 'Central hidráulica LINCK - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('38a8aa98-5951-495a-9da2-65103fd7e313', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '37', 'pendiente', 'Astillador Nicholson LG - Verificar nivel (DTE-26)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('54095950-4387-421f-8c65-9c87d7fa43e5', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '3000', 'pendiente', 'Rotor Descortezador LG - Lavado + cambio aceite SABADO QUINCENAL (80W-90)', datetime('now'));
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status, observations, created_at) VALUES
  ('000d3832-6c92-407d-a04d-b8df1ff37236', 'b3a5ce7f-3e83-44ad-8875-1682b19e083c', '2100', 'pendiente', 'Rotor Descortezador LD - Lavado + cambio aceite SABADO QUINCENAL (80W-90)', datetime('now'));

-- ============================================
-- SUMMARY
-- ============================================
-- Work Days: 20
-- Turno A Days: 10
-- Turno B Days: 10
-- Daily Tasks per day: 20
-- Total estimated tasks: ~460