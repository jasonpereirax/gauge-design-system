# Design System

Gerado automaticamente via [Design System Publisher Pro](https://github.com/) a partir do Figma.

## Componentes (2)

- `Card` — Card
- `Button` — Button

## Instalação

```bash
npm install
npm run dev
```

## Uso

```tsx
import { Card, Button } from "@/components"
```

## Estrutura

```
src/
  components/
    Card/
      Card.tsx         # React
      Card.tailwind.tsx # Tailwind
      Card.ai.tsx       # AI-generated (se disponível)
      Card.module.css   # CSS Module
    Button/
      Button.tsx         # React
      Button.tailwind.tsx # Tailwind
      Button.ai.tsx       # AI-generated (se disponível)
      Button.module.css   # CSS Module
  App.tsx     # Docs site
  main.tsx
```

---

*Gerado em: 2026-03-13T17:40:28.586Z*