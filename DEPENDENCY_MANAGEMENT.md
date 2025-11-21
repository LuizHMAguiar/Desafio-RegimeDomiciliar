# 🛠️ Guia Prático de Gerenciamento de Dependências

## 1. Instalação Inicial

```bash
# Clone o projeto
git clone <repo>
cd Desafio-RegimeDomiciliar

# Instale as dependências
npm install
```

## 2. Entender a Estrutura

```
package.json
├── dependencies (Runtime - 13 pacotes)
│   └── Necessários para produção
└── devDependencies (Dev - 12 pacotes)
    └── Apenas para desenvolvimento

node_modules/ (161 pacotes total)
└── Contém todas as dependências + sub-dependências
```

## 3. Comandos Úteis

### Verificar Status

```bash
# Ver dependências diretas
npm list --depth=0

# Ver todas as dependências
npm list

# Verificar atualizações disponíveis
npm outdated

# Auditoria de segurança
npm audit
```

### Instalar/Atualizar

```bash
# Instalar nova dependência (runtime)
npm install nome-pacote

# Instalar nova dependência (dev)
npm install --save-dev nome-pacote

# Atualizar dependência específica
npm update nome-pacote

# Atualizar todas
npm update

# Forçar versão específica
npm install nome-pacote@1.2.3
```

### Remover

```bash
# Remover dependência
npm uninstall nome-pacote

# Remover múltiplas
npm uninstall pacote1 pacote2 pacote3
```

## 4. Tarefas Recomendadas HOJE

### ✅ Remover Redundâncias

```bash
npm uninstall react-tabs react-radio-group
```

**Por quê?**
- `@radix-ui/react-tabs` já fornece tabs
- `@radix-ui/react-radio-group` já fornece radio buttons
- Remover reduz bundle size
- Simplifica manutenção

### ✅ Adicionar Progress ao MaterialForm

```bash
# Já instalado ✅
npm list @radix-ui/react-progress
```

## 5. Dependências por Categoria

### 🎯 Core (Essencial)
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
}
```

### 🎨 UI Components
```json
{
  "@radix-ui/react-alert-dialog": "^1.1.15",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-label": "^2.1.8",
  "@radix-ui/react-progress": "^1.1.8",
  "@radix-ui/react-radio-group": "^1.3.8",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-tabs": "^1.1.13",
  "@radix-ui/react-slot": "^1.1.2"
}
```

### 🎨 Styling
```json
{
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0"
}
```

### 🔧 Utilities
```json
{
  "lucide-react": "^0.554.0",
  "sonner": "^2.0.7",
  "next-themes": "^0.4.6"
}
```

### 📚 Development
```json
{
  "typescript": "~5.9.3",
  "@types/react": "^19.2.2",
  "@types/react-dom": "^19.2.2",
  "@types/node": "^24.10.0",
  "vite": "^7.2.2",
  "@vitejs/plugin-react": "^5.1.0",
  "eslint": "^9.39.1",
  "@eslint/js": "^9.39.1",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "typescript-eslint": "^8.46.3",
  "globals": "^16.5.0"
}
```

## 6. Versionamento Semântico

### Entender as Versões

```
^1.2.3  → Compatível com 1.x.x (permite minor/patch)
~1.2.3  → Compatível com 1.2.x (permite apenas patch)
1.2.3   → Exato (sem flexibility)
```

### Exemplo
```json
{
  "typescript": "~5.9.3",
  "react": "^19.2.0"
}
```

- `typescript`: Permite 5.9.x (patch updates)
- `react`: Permite 19.x.x (minor/patch updates)

## 7. Segurança

### Verificar Vulnerabilidades

```bash
# Auditoria completa
npm audit

# Ver relatório detalhado
npm audit --json

# Tentar corrigir automaticamente
npm audit fix
```

### Monitorar Dependências

```bash
# Verificar o quão desatualizado está
npm outdated

# Exemplo de saída:
# Package              Current  Wanted  Latest
# @radix-ui/progress    1.1.8   1.1.8   1.1.8  ✅ Atualizado
```

## 8. Otimização de Bundle

### Analisar Tamanho

```bash
# Instalar visualizador (opcional)
npm install --save-dev vite-plugin-visualizer

# Usar no vite.config.ts
import { visualizer } from 'vite-plugin-visualizer';

export default defineConfig({
  plugins: [react(), visualizer()]
});

# Executar build
npm run build

# Abrir report
# dist/stats.html
```

### Remover Código Não Utilizado

```bash
# ESLint ajuda a identificar
npm run lint

# TypeScript strict mode ajuda
# Verificar tsconfig.json
```

## 9. Troubleshooting

### Erro: Módulo não encontrado

```bash
# Solução 1: Reinstalar node_modules
rm -rf node_modules package-lock.json
npm install

# Solução 2: Limpar cache
npm cache clean --force
npm install
```

### Erro: Conflito de dependências

```bash
# Ver árvore de dependências
npm list nome-pacote

# Forçar resolução
npm install --force
```

### Erro: Versão incompatível

```bash
# Ver qual versão você tem
npm list @radix-ui/react-progress

# Atualizar para última compatível
npm update @radix-ui/react-progress
```

## 10. Checklist de Manutenção

### Semanal
- [ ] Verificar se o projeto ainda compila
- [ ] Rodar `npm audit`

### Mensalmente
- [ ] Rodar `npm outdated`
- [ ] Atualizar dependências não-críticas
- [ ] Verificar security advisories

### Trimestralmente
- [ ] Revisar e remover dependências não utilizadas
- [ ] Analisar bundle size
- [ ] Atualizar para versões major se houver
- [ ] Revisar changelogs de dependências críticas

## 11. Adicionando Novas Dependências

### Antes de Instalar

```bash
# Verificar se já existe
npm list novo-pacote

# Verificar segurança/qualidade
# https://www.npmjs.com/package/novo-pacote
# https://snyk.io/advisor/npm-package/novo-pacote
```

### Instalação Segura

```bash
# 1. Instalar
npm install novo-pacote

# 2. Verificar que funciona
npm run build
npm run lint

# 3. Committar
git add package.json package-lock.json
git commit -m "feat: add novo-pacote"
```

## 12. Exemplo Prático: Adicionar Testes

```bash
# 1. Instalar dependências
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# 2. Criar vitest.config.ts
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
EOF

# 3. Adicionar script ao package.json
"test": "vitest"

# 4. Executar testes
npm test
```

## 13. Links Úteis

| Recurso | URL |
|---------|-----|
| npm Docs | https://docs.npmjs.com/ |
| Snyk Advisor | https://snyk.io/advisor/ |
| Radix UI | https://www.radix-ui.com/ |
| React | https://react.dev/ |
| TypeScript | https://www.typescriptlang.org/ |
| Vite | https://vitejs.dev/ |

## 14. Resumo Rápido

```bash
# Setup novo desenvolvedor
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint

# Verificar saúde
npm audit
npm outdated
npm list --depth=0
```

---

**Última Atualização**: 21 de novembro de 2025  
**Autor**: Sistema de Análise de Dependências
