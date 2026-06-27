# Redesign & Limpeza — App Academia (Professor)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remover módulos não utilizados, aplicar tema Dark Energia com verde da academia (#52b788), e adicionar compartilhamento de avaliações como imagem.

**Architecture:** Limpeza cirúrgica de módulos + override de CSS variables do Ionic para tema global + html2canvas + @capacitor/share para compartilhamento. Sem mudanças em Firestore, sem reestruturação de módulos existentes.

**Tech Stack:** Angular 15, Ionic 7, Capacitor 4, Firebase, Chart.js 4, html2canvas (novo), @capacitor/share (novo)

> ⚠️ **SEM COMMITS** durante desenvolvimento. Professor testa via `ng serve` antes de subir pro Firebase.

---

## Mapa de Arquivos

| Arquivo | Ação |
|---------|------|
| `src/app/app-routing.module.ts` | Remover rota `/user` |
| `src/app/pages/menu/menu-routing.module.ts` | Remover rotas treinos, pagamentos, usuariotreinos |
| `src/app/pages/menu/menu.module.ts` | Remover imports dos módulos deletados |
| `src/app/pages/treinos/` (dir inteiro) | Deletar |
| `src/app/pages/usuario-treinos/` (dir inteiro) | Deletar |
| `src/app/pages/pagamentos/` (dir inteiro) | Deletar |
| `src/app/pages/acesso-usuarios/` (dir inteiro) | Deletar |
| `src/theme/variables.scss` | Substituir tema — dark + verde |
| `src/global.scss` | Adicionar overrides globais de card/toolbar |
| `src/app/core/login/login/login.component.scss` | Reescrever estilos de login |
| `src/app/core/login/login/login.component.html` | Remover "teste" e limpar comentários mortos |
| `src/app/pages/menu/menu/menu.component.html` | Limpar tabs comentadas, adicionar classe ao header |
| `src/app/pages/menu/menu/menu.component.ts` | Remover console.logs |
| `src/app/pages/usuarios/usuarios-card/usuarios-card.component.html` | Remover email, adicionar avatar-inicial |
| `src/app/pages/usuarios/usuarios-card/usuarios-card.component.ts` | Adicionar getter para inicial do nome |
| `src/app/pages/usuarios/usuarios-card/usuarios-card.component.scss` | Reescrever estilos do card |
| `src/app/pages/usuario-avaliacao/usuarios-avaliacao/usuario-avaliacao.component.html` | Header verde, seleção verde |
| `src/app/pages/usuario-avaliacao/usuarios-avaliacao/usuario-avaliacao.component.scss` | Estilos botões |
| `src/app/pages/usuario-avaliacao/usuario-avaliacao-card/usuario-avaliacao-card.component.html` | Data pt-BR, remover selecionavel não usado |
| `src/app/pages/usuario-avaliacao/usuario-avaliacao-card/usuario-avaliacao-card.component.scss` | Border verde selecionado |
| `src/app/pages/usuario-avaliacao/usuario-avaliacao-form/usuario-avaliacao-form.component.scss` | Segments e inputs verde |
| `src/app/pages/usuario-avaliacao/usuario-avaliacao-pollock/usuario-avaliacao-pollock.component.html` | Adicionar botão share no header |
| `src/app/pages/usuario-avaliacao/usuario-avaliacao-pollock/usuario-avaliacao-pollock.component.ts` | Atualizar cores Chart.js, implementar share |
| `src/app/pages/usuario-avaliacao/usuario-avaliacao-pollock/usuario-avaliacao-pollock.component.scss` | Criar (estava vazio) |
| `src/app/pages/usuario-avaliacao/usuario-avaliacao-comparacao/usuario-avaliacao-comparacao.component.html` | Adicionar botão Compartilhar, fechar modal |
| `src/app/pages/usuario-avaliacao/usuario-avaliacao-comparacao/usuario-avaliacao-comparacao.component.ts` | Atualizar cores Chart.js, implementar share |
| `src/app/pages/usuario-avaliacao/usuario-avaliacao-form/usuario-avaliacao-form.component.ts` | Remover console.logs |
| `package.json` | Adicionar html2canvas, @capacitor/share |

---

## Task 1: Remover Módulos Mortos

**Files:**
- Delete: `src/app/pages/treinos/`
- Delete: `src/app/pages/usuario-treinos/`
- Delete: `src/app/pages/pagamentos/`
- Delete: `src/app/pages/acesso-usuarios/`
- Modify: `src/app/app-routing.module.ts`
- Modify: `src/app/pages/menu/menu-routing.module.ts`
- Modify: `src/app/pages/menu/menu.module.ts`

- [ ] **Step 1: Deletar diretórios dos módulos mortos**

```bash
rm -rf src/app/pages/treinos
rm -rf src/app/pages/usuario-treinos
rm -rf src/app/pages/pagamentos
rm -rf src/app/pages/acesso-usuarios
```

- [ ] **Step 2: Remover rota `/user` de `src/app/app-routing.module.ts`**

Substituir o conteúdo do arquivo por:

```typescript
import { ResetPasswordComponent } from './core/login/reset-password/reset-password.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/login/login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/menu/menu.module').then((m) => m.MenuModule),
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

- [ ] **Step 3: Limpar rotas filhas em `src/app/pages/menu/menu-routing.module.ts`**

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { MenuComponent } from './menu/menu.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
    children: [
      {
        path: 'usuarios',
        loadChildren: () =>
          import('../usuarios/usuarios.module').then((m) => m.UsuariosModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'usuarioavaliacao',
        loadChildren: () =>
          import('../usuario-avaliacao/usuario-avaliacao.module').then((m) => m.UsuarioAvaliacaoModule),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuRoutingModule {}
```

- [ ] **Step 4: Remover import órfão de `UsuarioTreinosService` em `src/app/pages/usuario-avaliacao/usuario-avaliacao-form/usuario-avaliacao-form.component.ts`**

O serviço é importado mas não usado. Com `usuario-treinos/` deletado, esse import vai quebrar o build. Remover a linha:

```typescript
// REMOVER esta linha:
import { UsuarioTreinosService } from '../../usuario-treinos/shared/usuario-treino.service';
```

> Nota: `src/app/pages/menu/menu.module.ts` já está limpo — nenhuma ação necessária.

- [ ] **Step 5: Verificar compilação**

```bash
npx ng build --configuration development 2>&1 | head -50
```

Esperado: sem erros de módulo não encontrado. Se aparecer erro de import órfão, remover o import reportado.

---

## Task 2: Tema Dark Energia — CSS Global

**Files:**
- Modify: `src/theme/variables.scss`
- Modify: `src/global.scss`

- [ ] **Step 1: Substituir `src/theme/variables.scss`**

```scss
/** Ionic CSS Variables — Academia Dark Theme **/
:root {
  --ion-background-color: #111111;
  --ion-background-color-rgb: 17, 17, 17;
  --ion-text-color: #ffffff;
  --ion-text-color-rgb: 255, 255, 255;

  --ion-color-primary: #52b788;
  --ion-color-primary-rgb: 82, 183, 136;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: #48a178;
  --ion-color-primary-tint: #63be94;

  --ion-color-secondary: #40916c;
  --ion-color-secondary-rgb: 64, 145, 108;
  --ion-color-secondary-contrast: #ffffff;
  --ion-color-secondary-contrast-rgb: 255, 255, 255;
  --ion-color-secondary-shade: #387f5f;
  --ion-color-secondary-tint: #539c7b;

  --ion-color-tertiary: #2d6a4f;
  --ion-color-tertiary-rgb: 45, 106, 79;
  --ion-color-tertiary-contrast: #ffffff;
  --ion-color-tertiary-contrast-rgb: 255, 255, 255;
  --ion-color-tertiary-shade: #285e46;
  --ion-color-tertiary-tint: #427961;

  --ion-color-success: #52b788;
  --ion-color-success-rgb: 82, 183, 136;
  --ion-color-success-contrast: #ffffff;
  --ion-color-success-contrast-rgb: 255, 255, 255;
  --ion-color-success-shade: #48a178;
  --ion-color-success-tint: #63be94;

  --ion-color-warning: #ffc409;
  --ion-color-warning-rgb: 255, 196, 9;
  --ion-color-warning-contrast: #000000;
  --ion-color-warning-contrast-rgb: 0, 0, 0;
  --ion-color-warning-shade: #e0ac08;
  --ion-color-warning-tint: #ffca22;

  --ion-color-danger: #eb445a;
  --ion-color-danger-rgb: 235, 68, 90;
  --ion-color-danger-contrast: #ffffff;
  --ion-color-danger-contrast-rgb: 255, 255, 255;
  --ion-color-danger-shade: #cf3c4f;
  --ion-color-danger-tint: #ed576b;

  --ion-color-dark: #1a1a1a;
  --ion-color-dark-rgb: 26, 26, 26;
  --ion-color-dark-contrast: #ffffff;
  --ion-color-dark-contrast-rgb: 255, 255, 255;
  --ion-color-dark-shade: #111111;
  --ion-color-dark-tint: #252525;

  --ion-color-medium: #888888;
  --ion-color-medium-rgb: 136, 136, 136;
  --ion-color-medium-contrast: #ffffff;
  --ion-color-medium-contrast-rgb: 255, 255, 255;
  --ion-color-medium-shade: #787878;
  --ion-color-medium-tint: #949494;

  --ion-color-light: #2a2a2a;
  --ion-color-light-rgb: 42, 42, 42;
  --ion-color-light-contrast: #ffffff;
  --ion-color-light-contrast-rgb: 255, 255, 255;
  --ion-color-light-shade: #252525;
  --ion-color-light-tint: #333333;

  --ion-card-background: #1a1a1a;
  --ion-item-background: #111111;
  --ion-toolbar-background: #1a1a1a;
  --ion-tab-bar-background: #1a1a1a;
  --ion-tab-bar-color: #888888;
  --ion-tab-bar-color-selected: #52b788;

  /* Academia custom vars */
  --academia-accent: #52b788;
  --academia-accent-dark: #2d6a4f;
  --academia-card-bg: #1a1a1a;
  --academia-card-border: #52b788;
  --academia-text-muted: #888888;
}

.ios body, .md body {
  --ion-background-color: #111111;
  --ion-background-color-rgb: 17, 17, 17;
  --ion-text-color: #ffffff;
  --ion-text-color-rgb: 255, 255, 255;
  --ion-item-background: #111111;
  --ion-card-background: #1a1a1a;
  --ion-toolbar-background: #1a1a1a;
  --ion-tab-bar-background: #1a1a1a;
}
```

- [ ] **Step 2: Adicionar overrides globais em `src/global.scss`**

Appender ao final do arquivo existente (não substituir):

```scss
/* Academia — Dark Theme Global Overrides */
ion-card {
  --background: var(--academia-card-bg);
  border-left: 3px solid var(--academia-card-border);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  margin: 8px 12px;
}

ion-toolbar {
  --background: #1a1a1a;
  --color: #ffffff;
  --border-color: #2a2a2a;
}

ion-tab-bar {
  --background: #1a1a1a;
  --border: 1px solid #2a2a2a;
}

ion-item {
  --background: transparent;
  --border-color: #2a2a2a;
}

ion-content {
  --background: #111111;
}

ion-searchbar {
  --background: #1a1a1a;
  --color: #ffffff;
  --placeholder-color: #888888;
  --icon-color: #888888;
}
```

- [ ] **Step 3: Checar no browser**

```bash
npx ng serve --open
```

Navegar para `/login`. O fundo deve estar escuro (#111). Se o tema do sistema operacional for claro e o Ionic sobrescrever, continuar para a próxima task que aplica estilos por componente.

---

## Task 3: Login — Visual Dark Verde

**Files:**
- Modify: `src/app/core/login/login/login.component.html`
- Modify: `src/app/core/login/login/login.component.scss`

- [ ] **Step 1: Limpar HTML do login**

```html
<ion-content [fullscreen]="true" class="page">
  <div class="container">
    <img
      class="logo"
      src="../../../../assets/imgs/logo.jpeg"
      alt="Logo Academia"
    />

    <div [formGroup]="formData">
      <ion-item class="ion-item">
        <ion-icon name="person" slot="start"></ion-icon>
        <ion-input
          type="email"
          label="Usuário"
          label-placement="floating"
          formControlName="email"
          errorText="E-mail inválido"
        ></ion-input>
      </ion-item>

      <ion-item class="ion-item">
        <ion-icon name="lock-closed" slot="start"></ion-icon>
        <ion-input
          type="password"
          formControlName="password"
          label="Senha"
          label-placement="floating"
        ></ion-input>
      </ion-item>
    </div>

    <ion-button
      class="login-button"
      expand="block"
      (click)="login()"
      [disabled]="!formData.valid || desabilitaLogin"
    >Entrar</ion-button>

    <ion-label
      class="esqueci-senha"
      expand="block"
      color="primary"
      (click)="senha()"
    >Esqueci a Senha</ion-label>
  </div>

  <ion-toast
    [isOpen]="isToastOpen"
    message="Usuário não autenticado"
    [color]="colorHelp"
    [duration]="5000"
    (didDismiss)="setOpen(false)"
  ></ion-toast>
</ion-content>
```

- [ ] **Step 2: Reescrever SCSS do login**

```scss
ion-content {
  --background: #111111;
}

ion-icon {
  color: var(--academia-accent);
}

.container {
  display: flex;
  flex-direction: column;
  padding: 0 24px;
}

.logo {
  border-radius: 25%;
  align-self: center;
  margin-top: 60px;
  margin-bottom: 40px;
  width: 180px;
}

.ion-item {
  margin-top: 16px;
  --background: transparent;
  --border-color: #2a2a2a;
  --highlight-color-focused: var(--academia-accent);
}

.login-button {
  padding-left: 0;
  padding-right: 0;
  height: 50px;
  --border-radius: 8px;
  --background: var(--academia-accent);
  --background-activated: var(--academia-accent-dark);
  --color: #ffffff;
  --box-shadow: none;
  margin-top: 40px;
}

.esqueci-senha {
  margin-top: 16px;
  text-align: center;
  color: var(--academia-accent);
  cursor: pointer;
}
```

---

## Task 4: Menu — Limpar Tabs e Header

**Files:**
- Modify: `src/app/pages/menu/menu/menu.component.html`
- Modify: `src/app/pages/menu/menu/menu.component.ts`

- [ ] **Step 1: Reescrever HTML do menu — remover tabs mortas e dead code**

```html
<ion-router-outlet></ion-router-outlet>

<ion-tabs #tabs>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="usuarios" (click)="goTo('admin/usuarios')">
      <ion-icon name="person"></ion-icon>
      Alunos
    </ion-tab-button>
    <ion-tab-button (click)="logout()">
      <ion-icon name="log-out"></ion-icon>
      Sair
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>

<ion-alert
  trigger="present-alert"
  header="Atenção"
  message="Confirma o Logout?"
  [buttons]="alertButtons"
></ion-alert>
```

- [ ] **Step 2: Remover console.logs do `menu.component.ts`**

Substituir os dois métodos que têm console.log:

```typescript
async ionViewDidEnter() {
  this.loading = await this.loadingCtrl.create({ message: 'Carregando...' });
  await this.loading.present();
  this.isAdmin = this.loginService.isUserAdmin;
  this.isLoading = false;
  this.loading.dismiss();
  this.tabs.select('usuarios');
}

async ngOnInit() {}
```

Também remover o `console.log('cancelei')` em `alertButtons`:

```typescript
public alertButtons = [
  {
    text: 'Cancelar',
    role: 'cancel',
    handler: () => {},
  },
  {
    text: 'OK',
    role: 'confirm',
    handler: () => {
      this.loginService.logout();
      this.router.navigate(['/login']);
    },
  },
];
```

---

## Task 5: Card do Aluno — Visual Dark Verde

**Files:**
- Modify: `src/app/pages/usuarios/usuarios-card/usuarios-card.component.html`
- Modify: `src/app/pages/usuarios/usuarios-card/usuarios-card.component.ts`
- Modify: `src/app/pages/usuarios/usuarios-card/usuarios-card.component.scss`

- [ ] **Step 1: Adicionar getter de inicial em `usuarios-card.component.ts`**

Dentro da classe `UsuariosCardComponent`, adicionar:

```typescript
get inicialNome(): string {
  return this.usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
}
```

- [ ] **Step 2: Reescrever HTML do card**

```html
<ion-card class="aluno-card">
  <ion-card-header>
    <div class="avatar-wrapper">
      <img
        *ngIf="imagem !== './../../../../assets/imgs/avatar-do-usuario.png'"
        [src]="imagem"
        class="avatar-img"
        alt="foto do aluno"
      />
      <div
        *ngIf="imagem === './../../../../assets/imgs/avatar-do-usuario.png'"
        class="avatar-inicial"
      >{{ inicialNome }}</div>
    </div>
    <div class="header-info">
      <ion-card-title>{{ usuario.nome }}</ion-card-title>
      <ion-label class="telefone" (click)="openPhone()">
        <ion-icon name="call"></ion-icon> {{ usuario.telefone }}
      </ion-label>
    </div>
  </ion-card-header>

  <div class="acoes-botoes">
    <ion-button class="btn-avaliacao" fill="clear" (click)="abreAvaliacao()">
      <ion-icon slot="start" name="stats-chart"></ion-icon>
      Avaliação
    </ion-button>
    <ion-button class="btn-editar" fill="clear" (click)="editar()">
      <ion-icon slot="start" name="build"></ion-icon>
      Editar
    </ion-button>
    <ion-button class="btn-excluir" fill="clear" (click)="excluir()">
      <ion-icon slot="start" name="trash"></ion-icon>
      Excluir
    </ion-button>
  </div>
</ion-card>
```

- [ ] **Step 3: Reescrever SCSS do card**

```scss
.aluno-card {
  background: var(--academia-card-bg) !important;
  border-left: 3px solid var(--academia-accent) !important;
  border-radius: 12px !important;
  margin: 8px 12px;
}

ion-card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px 10px;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.avatar-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-inicial {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--academia-accent), var(--academia-accent-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 20px;
}

.header-info {
  flex: 1;
  overflow: hidden;
}

ion-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.telefone {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--academia-text-muted);
  margin-top: 2px;
  ion-icon { font-size: 12px; }
}

.acoes-botoes {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  padding: 4px 8px 10px;
}

.btn-avaliacao {
  --color: var(--academia-accent);
  --border-radius: 20px;
  border: 1px solid rgba(82, 183, 136, 0.3);
  background: rgba(82, 183, 136, 0.1);
  font-size: 0.8rem;
}

.btn-editar {
  --color: #cccccc;
  --border-radius: 20px;
  border: 1px solid #333333;
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.8rem;
}

.btn-excluir {
  --color: var(--ion-color-danger);
  --border-radius: 20px;
  border: 1px solid rgba(235, 68, 90, 0.3);
  background: rgba(235, 68, 90, 0.1);
  font-size: 0.8rem;
}
```

---

## Task 6: Telas de Avaliação — Visual

**Files:**
- Modify: `src/app/pages/usuario-avaliacao/usuarios-avaliacao/usuario-avaliacao.component.html`
- Modify: `src/app/pages/usuario-avaliacao/usuarios-avaliacao/usuario-avaliacao.component.scss`
- Modify: `src/app/pages/usuario-avaliacao/usuario-avaliacao-card/usuario-avaliacao-card.component.html`
- Modify: `src/app/pages/usuario-avaliacao/usuario-avaliacao-card/usuario-avaliacao-card.component.scss`
- Modify: `src/app/pages/usuario-avaliacao/usuario-avaliacao-form/usuario-avaliacao-form.component.scss`

- [ ] **Step 1: Atualizar header da lista de avaliações**

Em `usuario-avaliacao.component.html`, substituir o `ion-title`:

```html
<ion-header>
  <ion-toolbar>
    <ion-title slot="start" class="titulo-aluno">Avaliação — {{ usuario.nome }}</ion-title>
  </ion-toolbar>
</ion-header>
```

- [ ] **Step 2: Atualizar SCSS da lista**

```scss
.titulo-aluno {
  color: var(--academia-accent);
  font-weight: 600;
}

.cancel-button {
  padding-left: 20px;
  padding-right: 20px;
  height: 50px;
  --border-radius: 12px;
  --box-shadow: none;
}

.comp-button {
  padding-left: 20px;
  padding-right: 20px;
  height: 50px;
  --border-radius: 12px;
  margin-top: 24px;
  --box-shadow: none;
  --background: var(--academia-accent);
  --color: #ffffff;
}
```

- [ ] **Step 3: Atualizar card de avaliação com data pt-BR**

Em `usuario-avaliacao-card.component.html`:

```html
<ion-card [class.card-selecionado]="selecionado">
  <ion-card-header>
    <ion-card-title>{{ usuarioNome }}</ion-card-title>
  </ion-card-header>
  <ion-card-content>
    <ion-list>
      <ion-item>
        <ion-icon name="calendar" slot="start" color="primary"></ion-icon>
        <ion-label>
          <b>Data da Avaliação: </b>{{ avalicao.dataAvaliacao | date:'dd/MM/yyyy' }}
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-card-content>
  <div class="ion-text-end">
    <ion-button fill="clear" color="primary" (click)="editar()">
      <ion-icon slot="end" name="build"></ion-icon>
      Editar
    </ion-button>
    <ion-button fill="clear" color="danger" (click)="excluir()">
      <ion-icon slot="end" name="trash"></ion-icon>
      Excluir
    </ion-button>
  </div>
</ion-card>
```

- [ ] **Step 4: Atualizar SCSS do card de avaliação**

```scss
.card-selecionado {
  border: 2px solid var(--academia-accent) !important;
  box-shadow: 0 0 12px rgba(82, 183, 136, 0.4) !important;
  transform: scale(0.98);
}
```

- [ ] **Step 5: Adicionar estilos ao formulário de avaliação**

Em `usuario-avaliacao-form.component.scss`, adicionar ao final:

```scss
ion-segment {
  --background: #1a1a1a;
  margin: 8px 0;
}

ion-segment-button {
  --color: #888888;
  --color-checked: var(--academia-accent);
  --indicator-color: var(--academia-accent);
}

ion-input {
  --highlight-color-focused: var(--academia-accent);
}

.tabela-referencia {
  margin-top: 16px;
}

.tabela-estilizada {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: center;
  color: #cccccc;
}

.tabela-estilizada th,
.tabela-estilizada td {
  border: 1px solid #333;
  padding: 6px;
}

.tabela-estilizada thead {
  background-color: var(--academia-accent-dark);
  color: #ffffff;
}
```

---

## Task 7: Gráficos Chart.js — Paleta Verde

**Files:**
- Modify: `src/app/pages/usuario-avaliacao/usuario-avaliacao-pollock/usuario-avaliacao-pollock.component.ts`
- Modify: `src/app/pages/usuario-avaliacao/usuario-avaliacao-comparacao/usuario-avaliacao-comparacao.component.ts`

- [ ] **Step 1: Atualizar cores dos datasets em `usuario-avaliacao-pollock.component.ts`**

No método `renderizaGrafico()`, adicionar `backgroundColor` e cores em todos os datasets. Localizar o bloco `if (this.tipoGrafico === 'barras')` e substituir o array `datasets`:

```typescript
datasets: [
  { label: 'Peso Atual', data: [pesoAtual], backgroundColor: 'rgba(82, 183, 136, 0.7)', borderColor: '#52b788', borderWidth: 1 },
  { label: 'Peso Ideal', data: [pesoIdeal], backgroundColor: 'rgba(45, 106, 79, 0.7)', borderColor: '#2d6a4f', borderWidth: 1 },
  { label: 'Massa Gorda', data: [pesoGordo], backgroundColor: 'rgba(235, 68, 90, 0.7)', borderColor: '#eb445a', borderWidth: 1 },
  { label: 'Massa Magra', data: [pesoMagro], backgroundColor: 'rgba(64, 145, 108, 0.7)', borderColor: '#40916c', borderWidth: 1 },
],
```

No bloco `if (this.tipoGrafico === 'pizza')`, substituir o dataset:

```typescript
datasets: [{
  label: '%',
  data: [percentualGordura, percentualMuscular, 100 - percentualGordura - percentualMuscular],
  backgroundColor: ['rgba(235, 68, 90, 0.8)', 'rgba(82, 183, 136, 0.8)', 'rgba(136, 136, 136, 0.6)'],
  borderColor: ['#eb445a', '#52b788', '#888888'],
  borderWidth: 1,
}],
```

No bloco `if (this.tipoGrafico === 'comparativoPercentual')`, substituir os datasets:

```typescript
datasets: [
  { label: 'Atual (%)', data: [percentualGordura, percentualMuscular], backgroundColor: 'rgba(235, 68, 90, 0.7)', borderColor: '#eb445a', borderWidth: 1 },
  { label: 'Ideal (%)', data: [16.0, 60.0], backgroundColor: 'rgba(82, 183, 136, 0.7)', borderColor: '#52b788', borderWidth: 1 },
],
```

Adicionar `plugins.legend` com cor branca em todos os três charts (dentro de `options`):

```typescript
options: {
  plugins: {
    legend: { labels: { color: '#cccccc' } }
  },
  scales: {
    x: { ticks: { color: '#888888' }, grid: { color: '#2a2a2a' } },
    y: { ticks: { color: '#888888' }, grid: { color: '#2a2a2a' }, beginAtZero: true }
  }
}
```

- [ ] **Step 2: Atualizar cores em `usuario-avaliacao-comparacao.component.ts`**

Localizar os arrays `datasets` e `datasetsForca` e substituir `backgroundColor`:

```typescript
// datasets composição
{
  label: labelsDatas[0],
  data: indicadores.map((i) => d1[i]),
  backgroundColor: 'rgba(82, 183, 136, 0.7)',
  borderColor: '#52b788',
  borderWidth: 1,
},
{
  label: labelsDatas[1],
  data: indicadores.map((i) => d2[i]),
  backgroundColor: 'rgba(45, 106, 79, 0.7)',
  borderColor: '#2d6a4f',
  borderWidth: 1,
},

// datasetsForca
{
  label: labelsDatas[0],
  data: [a1.totalFlexoes ?? 0, a1.totalAbdominais ?? 0],
  backgroundColor: 'rgba(82, 183, 136, 0.7)',
  borderColor: '#52b788',
  borderWidth: 1,
},
{
  label: labelsDatas[1],
  data: [a2.totalFlexoes ?? 0, a2.totalAbdominais ?? 0],
  backgroundColor: 'rgba(45, 106, 79, 0.7)',
  borderColor: '#2d6a4f',
  borderWidth: 1,
},
```

Adicionar `options` com cores escuras em ambos os charts no `ngAfterViewInit`:

```typescript
options: {
  responsive: true,
  plugins: { legend: { position: 'top', labels: { color: '#cccccc' } } },
  scales: {
    x: { ticks: { color: '#888888' }, grid: { color: '#2a2a2a' } },
    y: { beginAtZero: true, ticks: { color: '#888888' }, grid: { color: '#2a2a2a' } },
  },
},
```

---

## Task 8: Compartilhamento — Instalar Dependências

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Instalar html2canvas e @capacitor/share**

```bash
npm install html2canvas @capacitor/share
```

Esperado: ambos adicionados em `dependencies` no `package.json`.

- [ ] **Step 2: Verificar instalação**

```bash
npx ng build --configuration development 2>&1 | grep -i "error" | head -20
```

Esperado: sem erros de módulo.

---

## Task 9: Compartilhamento — Pollock

**Files:**
- Modify: `src/app/pages/usuario-avaliacao/usuario-avaliacao-pollock/usuario-avaliacao-pollock.component.ts`
- Modify: `src/app/pages/usuario-avaliacao/usuario-avaliacao-pollock/usuario-avaliacao-pollock.component.html`
- Create: `src/app/pages/usuario-avaliacao/usuario-avaliacao-pollock/usuario-avaliacao-pollock.component.scss`

- [ ] **Step 1: Adicionar imports e método share em `usuario-avaliacao-pollock.component.ts`**

Adicionar imports no topo do arquivo:

```typescript
import html2canvas from 'html2canvas';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
```

Adicionar `@ViewChild` para o container a capturar (após os existentes):

```typescript
@ViewChild('pollockContainer') pollockContainer: ElementRef;
```

Adicionar método `compartilhar()` na classe:

```typescript
async compartilhar() {
  const canvas = await html2canvas(this.pollockContainer.nativeElement, {
    backgroundColor: '#1a1a1a',
    scale: 2,
  });
  const base64 = canvas.toDataURL('image/png').split(',')[1];
  const fileName = `avaliacao-${Date.now()}.png`;

  await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: Directory.Cache,
  });

  const { uri } = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });

  await Share.share({
    title: 'Avaliação Física',
    text: `Resultado da avaliação — ${this.aluno?.nome ?? ''}`,
    files: [uri],
  });

  await Filesystem.deleteFile({ path: fileName, directory: Directory.Cache });
}
```

- [ ] **Step 2: Substituir HTML completo do pollock (`usuario-avaliacao-pollock.component.html`)**

```html
<div #pollockContainer class="pollock-container">
  <div class="share-header">
    <ion-button fill="clear" class="btn-share" (click)="compartilhar()">
      <ion-icon slot="icon-only" name="share-social"></ion-icon>
    </ion-button>
  </div>

  <div [formGroup]="formData">
    <ion-item class="ion-item">
      <ion-input type="number" label="% De Gordura Ideal" label-placement="floating" formControlName="percentualGorduraIdeal" [disabled]="true"></ion-input>
    </ion-item>
    <ion-item class="ion-item">
      <ion-input type="number" label="Peso Ideal" label-placement="floating" formControlName="pesoIdeal" [disabled]="true"></ion-input>
    </ion-item>
    <ion-item class="ion-item">
      <ion-input type="number" label="Peso Muscular" label-placement="floating" formControlName="pesoMuscular" [disabled]="true"></ion-input>
    </ion-item>
    <ion-item class="ion-item">
      <ion-input type="number" label="% Peso Muscular" label-placement="floating" formControlName="percentualPesoMuscular" [disabled]="true"></ion-input>
    </ion-item>
    <ion-item class="ion-item">
      <ion-input type="number" label="% De Gordura Atual" label-placement="floating" formControlName="percentualGorduraAtual" [disabled]="true"></ion-input>
    </ion-item>
    <ion-item class="ion-item">
      <ion-input type="number" label="Massa Gorda" label-placement="floating" formControlName="pesoGordo" [disabled]="true"></ion-input>
    </ion-item>
    <ion-item class="ion-item">
      <ion-input type="number" label="Massa Magra" label-placement="floating" formControlName="pesoMagro" [disabled]="true"></ion-input>
    </ion-item>
    <ion-item class="ion-item">
      <ion-input type="number" label="Peso Residual" label-placement="floating" formControlName="pesoResidual" [disabled]="true"></ion-input>
    </ion-item>
  </div>

  <ion-item>
    <ion-label>Tipo de Gráfico</ion-label>
    <ion-select [(ngModel)]="tipoGrafico" [ngModelOptions]="{standalone: true}" (ionChange)="renderizaGrafico()">
      <ion-select-option value="barras">Composição Corporal</ion-select-option>
      <ion-select-option value="pizza">Distribuição Corporal (%)</ion-select-option>
      <ion-select-option value="comparativoPercentual">Comparativo (% Ideal vs Atual)</ion-select-option>
    </ion-select>
  </ion-item>

  <div class="ion-padding">
    <ion-card>
      <ion-card-header>{{ tituloGrafico }}</ion-card-header>
      <ion-card-content>
        <canvas #graficoCanvas style="max-height: 300px; width: 100%;"></canvas>
      </ion-card-content>
    </ion-card>
  </div>
</div>
```

- [ ] **Step 3: Criar SCSS do pollock**

```scss
.pollock-container {
  position: relative;
}

.share-header {
  display: flex;
  justify-content: flex-end;
  padding: 4px 8px 0;
}

.btn-share {
  --color: var(--academia-accent);
  font-size: 1.4rem;
}
```

---

## Task 10: Compartilhamento — Comparação

**Files:**
- Modify: `src/app/pages/usuario-avaliacao/usuario-avaliacao-comparacao/usuario-avaliacao-comparacao.component.ts`
- Modify: `src/app/pages/usuario-avaliacao/usuario-avaliacao-comparacao/usuario-avaliacao-comparacao.component.html`

- [ ] **Step 1: Adicionar imports e método share em `usuario-avaliacao-comparacao.component.ts`**

Adicionar imports:

```typescript
import html2canvas from 'html2canvas';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
```

Adicionar `@ViewChild` para o container:

```typescript
@ViewChild('comparacaoContainer') comparacaoContainer: ElementRef<HTMLDivElement>;
```

Adicionar import de `ElementRef` ao import do Angular (já deve existir, só verificar).

Adicionar método `compartilhar()`:

```typescript
async compartilhar() {
  const canvas = await html2canvas(this.comparacaoContainer.nativeElement, {
    backgroundColor: '#1a1a1a',
    scale: 2,
  });
  const base64 = canvas.toDataURL('image/png').split(',')[1];
  const fileName = `comparacao-${Date.now()}.png`;

  await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: Directory.Cache,
  });

  const { uri } = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });

  await Share.share({
    title: 'Comparativo de Avaliações',
    files: [uri],
  });

  await Filesystem.deleteFile({ path: fileName, directory: Directory.Cache });
}
```

- [ ] **Step 2: Atualizar HTML da comparação**

```html
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>Comparativo de Avaliações</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="fechar()">Fechar</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen>
  <div #comparacaoContainer class="comparacao-container">
    <ion-card>
      <ion-card-header>
        <ion-card-title>Composição Corporal</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <canvas #graficoCanvas style="max-height: 300px; width: 100%"></canvas>
      </ion-card-content>
    </ion-card>

    <ion-card>
      <ion-card-header>
        <ion-card-title>Força Muscular</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <canvas #graficoForcaCanvas style="max-height: 300px; width: 100%"></canvas>
      </ion-card-content>
    </ion-card>
  </div>

  <div class="rodape-modal">
    <ion-button expand="block" class="btn-compartilhar" (click)="compartilhar()">
      <ion-icon slot="start" name="share-social"></ion-icon>
      Compartilhar
    </ion-button>
  </div>
</ion-content>
```

- [ ] **Step 3: Adicionar SCSS da comparação**

Criar/atualizar `usuario-avaliacao-comparacao.component.scss`:

```scss
.comparacao-container {
  padding-bottom: 8px;
}

.rodape-modal {
  padding: 8px 16px 24px;
}

.btn-compartilhar {
  --background: var(--academia-accent);
  --color: #ffffff;
  --border-radius: 8px;
  --box-shadow: none;
}
```

---

## Task 11: Limpeza de Código

**Files:**
- Modify: `src/app/pages/usuario-avaliacao/usuario-avaliacao-pollock/usuario-avaliacao-pollock.component.ts`
- Modify: `src/app/pages/usuario-avaliacao/usuario-avaliacao-form/usuario-avaliacao-form.component.ts`

- [ ] **Step 1: Remover console.logs do pollock**

No `usuario-avaliacao-pollock.component.ts`, remover todas as linhas que começam com `console.log(` (o bloco "DEBUG INÍCIO" e "DEBUG FIM" e todas as linhas entre eles).

- [ ] **Step 2: Remover console.log do form de avaliação**

Em `usuario-avaliacao-form.component.ts`, remover:
- `console.log(ev);` em `trocaSegmento`
- A função `formatarDecimal` inteira (está comentada internamente e não é chamada em lugar nenhum)
- O import de `DecimalPipe` e `UsuarioTreinosService` se ainda estiverem presentes

- [ ] **Step 3: Checar build final limpo**

```bash
npx ng build --configuration development 2>&1 | tail -20
```

Esperado: `Build at: ... - Hash: ... - Time: ...ms` sem erros.

- [ ] **Step 4: Testar no browser**

```bash
npx ng serve
```

Testar o fluxo completo:
1. Tela de login — fundo escuro, botão verde
2. Lista de alunos — cards com borda verde, avatar com inicial
3. Clicar "Avaliação" em um aluno — lista de avaliações com header verde
4. Criar nova avaliação — segments com active verde
5. Aba "Avaliação" — gráfico com cores verde/vermelho, botão share
6. Selecionar 2 avaliações e comparar — modal com gráficos verdes, botão Compartilhar no rodapé
