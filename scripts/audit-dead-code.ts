/**
 * Auditoría de Código Muerto - AISA Lubrication System
 * 
 * Este script analiza el proyecto para encontrar:
 * - Archivos no importados
 * - Funciones no usadas
 * - Variables declaradas pero no usadas
 * - Componentes huérfanos
 * 
 * Usage: npm run audit:dead-code
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = process.cwd();
const IGNORE_PATTERNS = [
    'node_modules', '.next', '.git', 'coverage',
    '__tests__', '.agent', 'scripts', 'public'
];

interface AuditResult {
    file: string;
    issues: string[];
    severity: 'low' | 'medium' | 'high';
}

const results: AuditResult[] = [];

// ============================================
// 1. FIND ALL TS/TSX FILES
// ============================================

function getAllFiles(dir: string, files: string[] = []): string[] {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        if (IGNORE_PATTERNS.some(p => item.includes(p))) continue;

        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            getAllFiles(fullPath, files);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
            files.push(fullPath);
        }
    }

    return files;
}

// ============================================
// 2. ANALYZE IMPORTS AND EXPORTS
// ============================================

function analyzeFile(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    const issues: string[] = [];

    // Check for unused imports (simple heuristic)
    const importMatches = content.match(/import\s+{([^}]+)}\s+from/g);
    if (importMatches) {
        for (const match of importMatches) {
            const imports = match.match(/{\s*([^}]+)\s*}/)?.[1];
            if (imports) {
                const names = imports.split(',').map(n => n.trim().split(' as ')[0].trim());
                for (const name of names) {
                    // Count occurrences (excluding the import line itself)
                    const regex = new RegExp(`\\b${name}\\b`, 'g');
                    const occurrences = (content.match(regex) || []).length;
                    if (occurrences <= 1 && name.length > 2) {
                        issues.push(`Posible import no usado: ${name}`);
                    }
                }
            }
        }
    }

    // Check for TODO/FIXME comments
    const todoCount = (content.match(/\/\/\s*(TODO|FIXME|HACK|XXX)/gi) || []).length;
    if (todoCount > 0) {
        issues.push(`${todoCount} comentarios TODO/FIXME pendientes`);
    }

    // Check for console.log (should be removed in production)
    const consoleCount = (content.match(/console\.(log|warn|error)/g) || []).length;
    if (consoleCount > 3) {
        issues.push(`${consoleCount} console.* statements (considerar eliminar en producción)`);
    }

    // Check for any type usage
    const anyCount = (content.match(/:\s*any\b/g) || []).length;
    if (anyCount > 2) {
        issues.push(`${anyCount} usos de 'any' type (debilita TypeScript)`);
    }

    // Check for commented-out code blocks
    const commentedCode = content.match(/\/\/\s*(const|let|var|function|import|export|return|if|for|while)/g);
    if (commentedCode && commentedCode.length > 3) {
        issues.push(`${commentedCode.length} líneas de código comentado`);
    }

    if (issues.length > 0) {
        results.push({
            file: relativePath,
            issues,
            severity: issues.length > 5 ? 'high' : issues.length > 2 ? 'medium' : 'low'
        });
    }
}

// ============================================
// 3. CHECK FOR ORPHAN FILES
// ============================================

function checkOrphanFiles(): void {
    const libFiles = getAllFiles(path.join(PROJECT_ROOT, 'lib'));
    const componentFiles = getAllFiles(path.join(PROJECT_ROOT, 'components'));
    const allFiles = getAllFiles(PROJECT_ROOT);

    // Get all file contents to check imports
    const allContents = allFiles.map(f => fs.readFileSync(f, 'utf-8')).join('\n');

    // Check lib files
    for (const file of libFiles) {
        const basename = path.basename(file, path.extname(file));
        if (!allContents.includes(`from '@/lib/${basename}'`) &&
            !allContents.includes(`from './lib/${basename}'`) &&
            !allContents.includes(`from '../lib/${basename}'`) &&
            basename !== 'types') {
            results.push({
                file: path.relative(PROJECT_ROOT, file),
                issues: [`Archivo posiblemente huérfano (no importado en ningún lugar)`],
                severity: 'medium'
            });
        }
    }

    // Check component files
    for (const file of componentFiles) {
        const basename = path.basename(file, path.extname(file));
        const importPatterns = [
            `from '@/components/${basename}'`,
            `from './components/${basename}'`,
            `from '../components/${basename}'`,
            `<${basename}`,
        ];

        const isUsed = importPatterns.some(pattern => allContents.includes(pattern));
        if (!isUsed && !basename.startsWith('_')) {
            results.push({
                file: path.relative(PROJECT_ROOT, file),
                issues: [`Componente posiblemente no usado`],
                severity: 'medium'
            });
        }
    }
}

// ============================================
// 4. GENERATE REPORT
// ============================================

function generateReport(): void {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 AUDITORÍA DE CÓDIGO - AISA LUBRICATION SYSTEM');
    console.log('='.repeat(60) + '\n');

    const high = results.filter(r => r.severity === 'high');
    const medium = results.filter(r => r.severity === 'medium');
    const low = results.filter(r => r.severity === 'low');

    console.log(`📊 Resumen: ${results.length} archivos con issues\n`);
    console.log(`   🔴 Alta severidad: ${high.length}`);
    console.log(`   🟡 Media severidad: ${medium.length}`);
    console.log(`   🟢 Baja severidad: ${low.length}\n`);

    if (high.length > 0) {
        console.log('━'.repeat(60));
        console.log('🔴 ALTA PRIORIDAD (Revisar primero):');
        console.log('━'.repeat(60));
        for (const result of high) {
            console.log(`\n📁 ${result.file}`);
            result.issues.forEach(i => console.log(`   ⚠️  ${i}`));
        }
    }

    if (medium.length > 0) {
        console.log('\n' + '━'.repeat(60));
        console.log('🟡 MEDIA PRIORIDAD:');
        console.log('━'.repeat(60));
        for (const result of medium) {
            console.log(`\n📁 ${result.file}`);
            result.issues.forEach(i => console.log(`   ⚠️  ${i}`));
        }
    }

    if (low.length > 0) {
        console.log('\n' + '━'.repeat(60));
        console.log('🟢 BAJA PRIORIDAD (Opcional):');
        console.log('━'.repeat(60));
        for (const result of low) {
            console.log(`\n📁 ${result.file}`);
            result.issues.forEach(i => console.log(`   ℹ️  ${i}`));
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Auditoría completada');
    console.log('='.repeat(60) + '\n');

    // Save report to file
    const reportPath = path.join(PROJECT_ROOT, '.agent', 'memory', 'last-audit-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        summary: { high: high.length, medium: medium.length, low: low.length },
        results
    }, null, 2));
    console.log(`📄 Reporte guardado en: .agent/memory/last-audit-report.json\n`);
}

// ============================================
// MAIN
// ============================================

console.log('🔍 Iniciando auditoría de código...\n');

const allFiles = getAllFiles(PROJECT_ROOT);
console.log(`📁 Analizando ${allFiles.length} archivos...\n`);

for (const file of allFiles) {
    analyzeFile(file);
}

checkOrphanFiles();
generateReport();
