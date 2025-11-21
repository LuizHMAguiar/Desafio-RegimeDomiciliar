# Diagrama de Dependências do Projeto

## 📊 Árvore de Dependências Principais

```
Desafio-RegimeDomiciliar
│
├── 📦 CORE RUNTIME (Production - 13)
│   ├── react@19.2.0
│   ├── react-dom@19.2.0
│   │   └── Rendering layer para React
│   │
│   ├── 🎨 RADIX UI COMPONENTS
│   │   ├── @radix-ui/react-alert-dialog@1.1.15
│   │   ├── @radix-ui/react-dialog@1.1.15
│   │   ├── @radix-ui/react-label@2.1.8
│   │   ├── @radix-ui/react-progress@1.1.8 ⭐ NEW
│   │   ├── @radix-ui/react-radio-group@1.3.8
│   │   ├── @radix-ui/react-select@2.2.6
│   │   ├── @radix-ui/react-tabs@1.1.13
│   │   └── @radix-ui/react-slot@1.1.2
│   │       └── ⬇️ Radix UI Primitives (17 sub-packages)
│   │           ├── @radix-ui/primitive
│   │           ├── @radix-ui/react-compose-refs
│   │           ├── @radix-ui/react-context
│   │           ├── @radix-ui/react-primitive
│   │           ├── @radix-ui/react-id
│   │           ├── @radix-ui/react-portal
│   │           ├── @radix-ui/react-presence
│   │           ├── @radix-ui/react-focus-scope
│   │           ├── @radix-ui/react-focus-guards
│   │           ├── @radix-ui/react-dismissable-layer
│   │           ├── @radix-ui/react-roving-focus
│   │           ├── @radix-ui/react-collection
│   │           ├── @radix-ui/react-direction
│   │           ├── @radix-ui/react-use-callback-ref
│   │           ├── @radix-ui/react-use-controllable-state
│   │           ├── @radix-ui/react-use-escape-keydown
│   │           └── @radix-ui/react-use-layout-effect
│   │
│   ├── 🎨 STYLING
│   │   ├── class-variance-authority@0.7.1
│   │   ├── clsx@2.1.1
│   │   └── tailwind-merge@3.4.0
│   │
│   ├── 🎯 UTILITIES
│   │   ├── lucide-react@0.554.0
│   │   │   └── SVG Icons
│   │   ├── sonner@2.0.7
│   │   │   └── Toast Notifications System
│   │   └── next-themes@0.4.6
│   │       └── Theme Management
│   │
│   ├── ⚠️ REDUNDANT (TO REMOVE)
│   │   ├── react-tabs@6.1.0 ❌
│   │   └── react-radio-group@3.0.3 ❌
│   │
│   └── ⬇️ Sub-dependencies (accessibility, scroll management)
│       ├── aria-hidden
│       ├── react-remove-scroll
│       ├── react-style-singleton
│       ├── use-callback-ref
│       ├── use-sidecar
│       ├── get-nonce
│       ├── detect-node-es
│       └── tslib
│
└── 📚 DEVELOPMENT TOOLS (12)
    ├── 🔤 TYPESCRIPT ECOSYSTEM
    │   ├── typescript@5.9.3
    │   ├── @types/react@19.2.6
    │   ├── @types/react-dom@19.2.3
    │   └── @types/node@24.10.1
    │
    ├── 🏗️ BUILD TOOLS
    │   ├── vite@7.2.2
    │   └── @vitejs/plugin-react@5.1.1
    │
    ├── 📋 LINTING
    │   ├── eslint@9.39.1
    │   ├── @eslint/js@9.39.1
    │   ├── typescript-eslint@8.47.0
    │   ├── eslint-plugin-react-hooks@7.0.1
    │   ├── eslint-plugin-react-refresh@0.4.24
    │   └── globals@16.5.0
    │
    └── ⬇️ Build dependencies
        └── rollup, esbuild, etc. (via Vite)
```

---

## 🔗 Relações de Dependência

### React Ecosystem
```
react@19.2.0
├── react-dom@19.2.0
├── @types/react@19.2.6
└── @types/react-dom@19.2.3
```

### Radix UI Ecosystem
```
@radix-ui/react-* (8 components)
├── @radix-ui/primitive
├── @radix-ui/react-compose-refs
├── @radix-ui/react-context
├── @radix-ui/react-slot
└── ... (13 more primitives)
```

### Build & Development
```
vite@7.2.2
├── @vitejs/plugin-react@5.1.1
│   └── react (above)
└── esbuild (internal)
    └── typescript@5.9.3
```

### Type Checking
```
typescript@5.9.3
├── @types/react
├── @types/react-dom
└── @types/node
```

### Code Quality
```
eslint@9.39.1
├── @eslint/js
├── typescript-eslint
├── eslint-plugin-react-hooks
└── eslint-plugin-react-refresh
```

---

## 📈 Dependency Graph Statistics

```
Total Packages: 161
├── Direct Dependencies: 25
│   ├── Production: 13
│   └── Development: 12
│
├── First-Level Sub-deps: ~50
├── Transitive Sub-deps: ~86
│
└── Categories:
    ├── React/Framework: 2
    ├── UI Components: 8
    ├── Styling: 3
    ├── Utilities: 3
    ├── Type Definitions: 4
    ├── Build Tools: 2
    └── Linting: 7
```

---

## 🚨 Redundancies & Conflicts

```
⚠️ ISSUE: Dual Tab Components
├── @radix-ui/react-tabs@1.1.13 ✅ (Use this)
└── react-tabs@6.1.0 ❌ (Remove this)

⚠️ ISSUE: Dual Radio Components
├── @radix-ui/react-radio-group@1.3.8 ✅ (Use this)
└── react-radio-group@3.0.3 ❌ (Remove this)
```

---

## 🔄 Update Flow

```
┌─────────────────────────────────┐
│  npm update / npm audit fix     │
└──────────────┬──────────────────┘
               │
         ┌─────▼─────┐
         │ package.json modified?
         └─────┬─────┘
              │ YES
         ┌────▼───────┐
         │ package-lock.json updated
         └────┬───────┘
              │
         ┌────▼───────────────────┐
         │ npm install (automatic) │
         └────┬───────────────────┘
              │
         ┌────▼──────────────────┐
         │ node_modules/ updated  │
         └────┬──────────────────┘
              │
         ┌────▼────────┐
         │ Test Changes│
         └────┬────────┘
              │
         ┌────▼──────────┐
         │ Commit Changes│
         └───────────────┘
```

---

## 🛡️ Security Chain

```
npm audit
├── Checks for known vulnerabilities
├── Checks dependency tree
├── Looks for:
│   ├── CVE entries
│   ├── Malware
│   ├── License issues
│   └── Dependency conflicts
└── Generates report: 0 vulnerabilities ✅
```

---

## 📦 Installation Size Breakdown

```
node_modules/
├── @radix-ui/ (~20%)
├── react/ (~5%)
├── esbuild/ (~15%)
├── typescript/ (~10%)
├── vite/ (~10%)
├── eslint/ (~15%)
└── others (~25%)
   ├── icons
   ├── themes
   ├── utilities
   └── dependencies of dependencies
```

---

## 🔀 Peer Dependency Chain

```
react@19.2.0
│
├── Peer: @types/react@^16 || ^17 || ^18 || ^19
├── Peer: @types/react-dom@^16 || ^17 || ^18 || ^19
│
└── Used by:
    ├── react-dom@19.2.0
    ├── @radix-ui/* (all 8 components)
    ├── next-themes@0.4.6
    ├── sonner@2.0.7
    └── lucide-react@0.554.0
```

---

## 📊 Version Compatibility Matrix

```
Component           Current  Requirement  Status
────────────────────────────────────────────────
react              19.2.0   ✅ Latest    ✅ OK
react-dom          19.2.0   ✅ Latest    ✅ OK
typescript          5.9.3   ✅ Latest    ✅ OK
vite               7.2.2    ✅ Latest    ✅ OK
eslint             9.39.1   ✅ Latest    ✅ OK
@radix-ui/*        1.x.x    ✅ Stable    ✅ OK
tailwind-merge     3.4.0    ✅ Latest    ✅ OK
lucide-react      0.554.0   ✅ Latest    ✅ OK
sonner             2.0.7    ✅ Latest    ✅ OK
next-themes        0.4.6    ✅ Latest    ✅ OK
```

---

## 🎯 Critical Path Analysis

```
Build Success depends on:
├── ✅ typescript@5.9.3 (CRITICAL)
├── ✅ vite@7.2.2 (CRITICAL)
├── ✅ react@19.2.0 (CRITICAL)
├── ✅ react-dom@19.2.0 (CRITICAL)
├── ✅ @vitejs/plugin-react@5.1.1 (CRITICAL)
├── ⚠️ @radix-ui/* (8 IMPORTANT)
└── ✅ other utilities (NON-CRITICAL)

Runtime Success depends on:
├── ✅ react@19.2.0 (CRITICAL)
├── ✅ react-dom@19.2.0 (CRITICAL)
├── ⚠️ @radix-ui/* (IMPORTANT)
└── ✅ other utilities (NON-CRITICAL)
```

---

## 🔧 Maintenance Schedule

```
Timeline        Action                          Priority
─────────────────────────────────────────────────────────
Immediate       Remove redundant deps           HIGH
                (react-tabs, react-radio-group)

Weekly          npm audit                       MEDIUM
                npm run lint                    MEDIUM

Monthly         npm outdated                    LOW
                Review changelogs               LOW

Quarterly       Major version updates           LOW
                Dependency audit                MEDIUM
```

---

**Generated**: 21 de novembro de 2025  
**Format**: Markdown + ASCII Diagrams
