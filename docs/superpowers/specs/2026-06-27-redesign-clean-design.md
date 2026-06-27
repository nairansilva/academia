# Design Spec: Redesign & Limpeza — App Academia (Professor)

**Data:** 2026-06-27
**Abordagem escolhida:** B — Redesign focado

## Contexto

App Ionic/Angular/Firebase usado exclusivamente pelo professor para gerenciar alunos e avaliações físicas. Módulos construídos mas não utilizados acumularam dívida técnica. Objetivo: remover o que não presta, aplicar visual consistente com identidade de academia, adicionar compartilhamento de avaliações.

## 1. Remoção de Módulos

Deletar completamente do projeto (arquivos, rotas, imports, declarations):

| Módulo | Caminho |
|--------|---------|
| Treinos | `src/app/pages/treinos/` |
| Treinos por Aluno | `src/app/pages/usuario-treinos/` |
| Pagamentos | `src/app/pages/pagamentos/` |
| Portal do Aluno | `src/app/pages/acesso-usuarios/` |

Serviços a remover junto: `TreinosService`, `UsuarioTreinoService`.

Serviços que ficam: `UsuariosService`, `UsuarioAvaliacaoService`, `StorageService`, `PhotoService`, `LoginService`, `AppUpdateService`.

Atualizar:
- `app-routing.module.ts` — remover rotas `/user/*`, `/treinos`, `/pagamentos`, `/usuariotreinos`
- `menu-routing.module.ts` — remover rotas filhas de treinos, pagamentos, usuariotreinos
- `menu.module.ts` — remover imports dos módulos deletados
- `app.module.ts` — verificar imports órfãos

## 2. Tema Dark Energia

### Variáveis globais (`src/theme/variables.scss`)

```scss
:root {
  --ion-background-color: #111111;
  --ion-card-background: #1a1a1a;
  --ion-color-primary: #ff6b35;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-danger: #eb445a;
  --ion-text-color: #ffffff;
  --ion-color-medium: #888888;
  --academia-accent: #ff6b35;
  --academia-accent-alt: #f53d3d;
  --academia-card-border: #ff6b35;
  --academia-card-bg: #1a1a1a;
}
```

### Login (`src/app/core/login/`)

- Fundo `#111111`
- Logo/título centralizado com gradiente `linear-gradient(135deg, #ff6b35, #f53d3d)`
- `ion-input` com `--highlight-color: #ff6b35`
- Botão "Entrar": background `#ff6b35`, texto branco, border-radius `8px`
- Botão "Esqueci a senha": outline laranja

### Menu / Tab Bar (`src/app/pages/menu/menu/`)

- Tab bar: remover tabs comentadas de treinos/pagamentos do HTML definitivamente
- Resultado: apenas aba "Alunos" (`admin/usuarios`) + botão "Sair"
- Header com texto "Academia" em `#ff6b35`

## 3. Card do Aluno — Reescrita Visual

**Componente:** `src/app/pages/usuarios/usuarios-card/`

Estrutura HTML mantida (avatar + nome + telefone + 3 botões). Mudanças visuais:

- `ion-card`: `background: #1a1a1a`, `border-left: 3px solid #ff6b35`, `border-radius: 12px`
- Avatar: exibe inicial do nome com `background: linear-gradient(135deg, #ff6b35, #f53d3d)` quando não há foto; cai para foto do Firebase quando disponível
- Email removido do card (reduz ruído — ainda salvo no cadastro)
- Botões reestilizados:
  - "Avaliação": background `#ff6b3522`, cor `#ff6b35`, border `1px solid #ff6b3544`, border-radius `20px`
  - "Editar": background `#ffffff11`, cor `#cccccc`, border `1px solid #333`
  - "Excluir": background `#eb445a22`, cor `#eb445a`, border `1px solid #eb445a44`

## 4. Telas de Avaliação

**Lista** (`usuario-avaliacao.component`):
- Header com nome do aluno em `#ff6b35`
- `usuario-avaliacao-card`: herda `border-left: 3px solid #ff6b35`, data formatada em pt-BR (`dd/MM/yyyy`)
- FAB "Nova Avaliação": cor primária (laranja)
- Modo comparação: 2 cards selecionados ganham `border-color: #ff6b35` + opacidade pulsante; botão "Comparar" aparece no bottom

**Formulário** (`usuario-avaliacao-form.component`):
- `ion-segment` com `--color-checked: #ff6b35`
- `ion-input`: `--highlight-color: #ff6b35`
- Botão "Salvar": laranja sólido
- Botão "Cancelar": outline vermelho

**Gráficos Chart.js** (`usuario-avaliacao-pollock`, `usuario-avaliacao-comparacao`):
- Dataset 1: `backgroundColor: 'rgba(255, 107, 53, 0.7)'` (laranja)
- Dataset 2: `backgroundColor: 'rgba(245, 61, 61, 0.7)'` (vermelho)
- Grid e labels: `color: '#888888'`

## 5. Fotos

Sem mudança funcional. Firebase Storage mantido no plano Spark (5GB gratuito — suficiente para academia pequena). `StorageService` e `PhotoService` intocados.

## 6. Compartilhamento de Avaliações

**Dependências novas:**
- `html2canvas` — captura DOM como imagem
- `@capacitor/share` — share sheet nativo (WhatsApp, email, etc.)

**Onde adicionar:**

| Tela | Botão | O que captura |
|------|-------|---------------|
| Resultado Pollock (`usuario-avaliacao-pollock`) | Ícone share no header | Gráfico + métricas calculadas |
| Comparação (`usuario-avaliacao-comparacao`) | Botão "Compartilhar" no rodapé do modal | Ambos os gráficos (composição + força) |

**Fluxo:**
1. Usuário toca "Compartilhar"
2. `html2canvas` captura o elemento alvo como PNG (base64)
3. PNG salvo temporariamente via `Capacitor.Filesystem` em `TEMPORARY`
4. `Share.share({ files: [tempPath] })` abre share sheet nativo
5. Arquivo temporário removido após share

## 7. Limpeza de Código

Junto às mudanças acima, remover:
- Todos os `console.log` e `console.error` de debug nos componentes de avaliação
- Comentários de código morto (blocos comentados no menu HTML, form HTML)
- `UsuarioTreinoService` import em qualquer componente que ainda o referencie

## Fora de Escopo

- Renomear coleção Firestore `usuariosavalicao` (evita migração de dados em produção)
- Animações de entrada / splash screen customizado (escopo C)
- Ícone do app nas lojas
- Configuração de nome da academia via tela de settings
