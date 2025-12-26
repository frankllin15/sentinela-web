Aqui está o documento Markdown estruturado para servir de contexto ("Prompt System") para uma LLM. Ele contém o resumo arquitetural e a descrição funcional das telas prioritárias do MVP.

---

# 📱 Contexto do Projeto: Frontend Sentinela (MVP)

Este documento descreve o escopo, arquitetura e interfaces de usuário do sistema **Sentinela**. O objetivo é fornecer contexto para a geração de código Frontend utilizando **React**, **Vite**, **Tailwind CSS** e **shadcn/ui**.

## 1. Resumo do Sistema
O **Sentinela** é uma plataforma de inteligência policial unificada (Web + Mobile Web) para cadastro e consulta de indivíduos e ocorrências.
* **Objetivo:** Centralizar informações das forças policiais (PM, PC, PF, PRF, PP) com foco em agilidade operacional na rua e controle rígido de acesso na base.
* **Arquitetura:** Aplicação Web Responsiva.
    * **Desktop:** Painel Administrativo para gestão de usuários e auditoria.
    * **Mobile (Navegador):** Interface "App-like" para policiais em campo (coleta de dados, fotos e geolocalização).
* **Stack:** React, Zustand (Auth), Axios, React Hook Form + Zod, shadcn/ui.
* **Backend:** NestJS + PostgreSQL (Já implementado).

---

## 2. Descrição das Telas Principais (MVP)

Abaixo estão os requisitos de UI/UX para as telas críticas.

### 🔐 Tela 1: Login (`/login`)
A porta de entrada segura do sistema.
* **Layout:** Centralizado (`Card` do shadcn). Fundo com tom sóbrio (Azul Policial/Cinza).
* **Elementos:**
    * Título/Logo: "SENTINELA".
    * Input **E-mail**: `type="email"`.
    * Input **Senha**: `type="password"`.
        * *Regra de Negócio:* Deve aceitar **apenas números** (input mode numeric). [cite_start]Validação: 6 a 12 dígitos[cite: 12].
    * [cite_start]**Seletor de Perfil (Role):** Combobox/Select com as opções: `Administrador Geral`, `Ponto Focal`, `Gestor`, `Usuário`[cite: 13].
    * Botão "Entrar".
* **Comportamento:** Ao logar, salvar Token JWT e redirecionar conforme o papel (Admin → Dashboard; Usuário → Home Operacional).

### 👮 Tela 2: Home Operacional (`/app/home`) - Mobile First
Tela inicial para o policial na rua. Foco em ações rápidas.
* **Layout:** Mobile-first, botões grandes e acessíveis com o polegar.
* **Elementos:**
    * **Header:** Saudação, Força Policial do usuário e botão de Logout.
    * **Card de Ação Principal:** "Novo Cadastro" (Destaque).
    * **Barra de Busca Rápida:** Input para pesquisar por Nome/Vulgo/CPF.
    * **Lista de Recentes:** `Card` simples mostrando os últimos 3-5 registros inseridos pelo próprio usuário.

### 📝 Tela 3: Cadastro de Indivíduo (`/app/register`)
O fluxo mais complexo, dividido em etapas ou acordeão para facilitar no celular.
* **Seção A: Evidências (Mídia)**
    * Botões de Upload/Câmera para: `Foto de Rosto`, `Foto de Corpo Inteiro`.
    * **Módulo de Tatuagens:** Botão "Adicionar Tatuagem". Ao clicar, abre dialog/drawer para tirar a foto e preencher "Local do Corpo" e "Descrição". [cite_start]Deve permitir N tatuagens[cite: 74].
* **Seção B: Dados Pessoais**
    * Inputs: Nome Completo, Vulgo, CPF (com máscara), Nome da Mãe, Nome do Pai.
* **Seção C: Localização e Legal**
    * [cite_start]**Endereço:** Input de texto + Botão "Capturar GPS Atual" (usa API do navegador para preencher Lat/Long ocultos)[cite: 62].
    * **Status:** Checkbox/Switch para "Possui Mandado de Prisão?". [cite_start]Se sim, exibir Textarea para detalhes e Input file para PDF[cite: 66].
    * [cite_start]**Sigilo:** Switch "Registro Sigiloso" (`is_confidential`)[cite: 68].
* **Ação:** Botão "Salvar Cadastro". Deve validar duplicidade antes de enviar.

### 🔍 Tela 4: Busca e Listagem (`/app/search` ou `/admin/search`)
Interface de pesquisa avançada com suporte a filtros.
* **Filtros:**
    * Texto (Nome, Vulgo, CPF, Mãe) - *Server-side fuzzy search*.
    * Select de "Força Policial" (Filtrar só PM, só PC, etc).
* **Resultados (Lista/Grid):**
    * Renderizar Cards responsivos.
    * **Conteúdo do Card:** Foto principal (thumbnail), Nome, Vulgo, Ícone indicando se tem Mandado.
    * [cite_start]**Regra de Segurança:** Se o usuário for nível `usuario` e o registro for sigiloso, o card nem deve aparecer (filtrado no back)[cite: 91].

### 👤 Tela 5: Detalhes do Indivíduo (`/people/:id`)
Visualização completa do dossiê.
* **Header:** Foto de rosto grande, Nome e Badges (ex: "Mandado em Aberto", "Sigiloso").
* **Tabs (Abas):**
    1.  **Dados:** Todas as informações textuais e mapa (mini-mapa leaflet) com a localização.
    2.  **Galeria:** Grid com fotos de corpo e tatuagens. [cite_start]Ao clicar, abre modal com zoom[cite: 79].
    3.  [cite_start]**Auditoria (Meta):** Rodapé mostrando "Cadastrado por: [Nome/Força] em [Data]" e "Última edição por: [Nome]"[cite: 102].
* **Ações (Se permissão permitir):** Botão Flutuante (FAB) ou Menu para "Editar" ou "Excluir".

### 🖥️ Tela 6: Gestão de Usuários (`/admin/users`) - Desktop Only
Apenas para `Administrador Geral` e `Ponto Focal`.
* **Layout:** Tabela (`shadcn Table`) rica em dados.
* **Colunas:** Nome, Email, Perfil (Role), Força Policial, Status (Ativo/Inativo).
* **Ações:** Botão "Novo Usuário" (Modal).
    * [cite_start]**Formulário de Criação:** Nome, Email, Senha Numérica Inicial, Role, Força[cite: 47].
    * *Regra:* Admin Geral pode criar qualquer um. Ponto Focal não cria Admin Geral.

---

## 3. Diretrizes de UI (shadcn/ui + Tailwind)
* **Cores:**
    * `bg-slate-950` (Fundo escuro/profissional).
    * `text-slate-50` (Texto claro).
    * `primary`: Azul escuro institucional.
    * `destructive`: Vermelho para alertas de Mandado de Prisão.
* **Componentes Chave:**
    * `Form`, `FormControl`, `FormField` (para Zod).
    * `Card` (container padrão).
    * `Drawer` (para menus mobile).
    * `Toast` (para feedback de "Salvo com sucesso" ou "Erro de duplicidade").

## 4. Padrão de resposta da API
* **Paginado:** `{ data: T[], total: number, page: number, limit: number, totalPages: number }`


