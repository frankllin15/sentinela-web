

### 1. Identidade Visual e Paleta de Cores

O esquema de cores utiliza a paleta **Slate (Cinza-Azulado)** do Tailwind CSS, escolhida por transmitir sobriedade, modernidade e reduzir o cansaço visual em ambientes com pouca luz (comum em viaturas ou plantões noturnos).

* **Fundo Principal (Header):** `Slate-900` (Quase preto, tom carvão profundo). Cria uma base sólida e separa claramente a navegação do conteúdo da página.
* **Acentos e Destaques:** `Blue-700` a `Blue-500`. Usado no ícone do logo e nos estados de "Ativo/Selecionado". O azul remete institucionalmente às forças de segurança.
* **Tipografia Primária:** `White` (Branco puro). Para nomes, títulos e ícones ativos.
* **Tipografia Secundária:** `Slate-400` (Cinza médio). Para rótulos, cargos, forças e ícones inativos. Isso cria uma hierarquia visual onde o que importa "brilha" e o resto fica contextual.
* **Alertas:** `Red-500` (Vermelho). Exclusivo para notificações e logout, garantindo atenção imediata.

### 2. Disposição dos Elementos (Desktop - `lg` e `xl`)

O layout utiliza um container `flex` horizontal com espaçamento `justify-between` e altura fixa de `64px` (h-16).

#### A. Zona de Marca (Esquerda)

* **Ícone:** Escudo (`Shield`) branco sobre um fundo quadrado `Blue-700` com bordas arredondadas. Possui uma leve sombra (`shadow-blue-900/50`) para dar profundidade.
* **Texto:**
* Título "SENTINELA" em caixa alta, `font-bold`.
* Subtítulo "Sistema Integrado" em tamanho reduzido (`text-[10px]`) e espaçamento entre letras (`tracking-widest`), conferindo um ar técnico/militar.



#### B. Navegação Principal (Centro-Esquerda)

* Posicionada logo após a marca.
* **Links:** Dispostos horizontalmente.
* **Estado Ativo:** Fundo `Slate-800`, texto branco e uma borda sutil `Slate-700`.
* **Estado Inativo:** Texto cinza, mudando para branco ao passar o mouse (`hover`).
* **Ícones:** Acompanham cada label para reconhecimento visual rápido.

#### C. Zona de Ações e Perfil (Direita)

Esta área é crítica para a regra de negócio de **auditoria visual**.

1. **Busca Rápida:** Um input compacto que se expande suavemente (`w-48` para `w-64`) quando focado. Fundo escuro para não ofuscar.
2. **Notificações:** Botão de sino (`Bell`). Se houver alertas, exibe um "dot" vermelho pulsante (`animate-pulse`) no canto superior direito do ícone.
3. **Divisor Vertical:** Uma linha fina `Slate-700` separa as ações globais do perfil do usuário.
4. **Widget de Perfil (Obrigatório):**
* Exibe **Nome do Usuário** em destaque.
* Exibe **Cargo e Força Policial** (ex: "Gestor • Polícia Militar") logo abaixo, em azul claro. Isso garante que o operador saiba exatamente com qual "chapéu" está logado.
* Avatar genérico ou foto, seguido de uma seta (`Chevron`) indicando menu.



### 3. Comportamento Mobile (Responsivo - `< md`)

Ao reduzir a tela (tablets verticais e celulares), o layout sofre uma adaptação agressiva para manter a usabilidade com o polegar.

#### Barra Superior Simplificada

* A navegação central, a barra de busca e os dados detalhados do usuário **desaparecem** da barra fixa.
* Mantém-se apenas: Logo (Esquerda), Notificações e Menu Hambúrguer (Direita).

#### O Menu "Gaveta" (Drawer)

Ao clicar no ícone de menu, um painel desliza do topo (`animate-in slide-in-from-top`), sobrepondo o conteúdo:

1. **Cabeçalho do Usuário:** A informação de Nome, Cargo e Força é movida para o topo deste menu aberto. É vital que o usuário mobile veja quem ele é assim que abre o menu.
2. **Links Verticais:** Os botões de navegação tornam-se grandes blocos clicáveis (altura maior para toque), ocupando toda a largura. O item ativo ganha uma borda esquerda azul (`border-l-4`) para destaque.
3. **Área de Saída:** O botão "Sair" é isolado na parte inferior com uma linha divisória, prevenindo toques acidentais, e usa texto vermelho.

### 4. Interações e Micro-interações

* **Dropdown de Perfil:** Ao clicar no usuário (Desktop), um menu flutuante aparece com sombra `shadow-lg` e borda fina. Ele fecha automaticamente se o usuário clicar fora dele.
* **Transições:** Todas as mudanças de cor (hover) e tamanho (input de busca) possuem `transition-all duration-200`, tornando a interface fluida e não "seca".
* **Acessibilidade:** Elementos focáveis (inputs, botões) possuem `ring-blue-500` quando selecionados via teclado.

### Resumo Técnico para Implementação

* **Framework CSS:** Tailwind CSS.
* **Ícones:** Lucide-React (linhas finas, consistentes).
* **Z-Index:** O Header possui `z-50` e `sticky top-0` para garantir que sempre esteja visível ao rolar listas longas de ocorrências.