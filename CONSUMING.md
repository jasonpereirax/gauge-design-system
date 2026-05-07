# Como consumir este Design System

Este pacote é publicado no GitHub Packages a cada push na `main`.

## 1. Configurar autenticação (uma vez por máquina)

Crie um Personal Access Token no GitHub com escopo `read:packages`:
https://github.com/settings/tokens/new

Crie um arquivo `.npmrc` na raiz do seu projeto consumidor:

```
@your-username:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=SEU_TOKEN_AQUI
```

**Não commite o `.npmrc` com token.** Adicione ao `.gitignore`.

## 2. Instalar

```bash
npm install @your-username/gauge-design-system
```

## 3. Usar

```tsx
import { Button } from '@your-username/gauge-design-system'

export default function App() {
  return <Button />
}
```

## 4. Atualizações

Cada deploy do plugin Figma → push na `main` → GitHub Action publica nova versão.
Para atualizar no projeto consumidor:

```bash
npm update @your-username/gauge-design-system
```
