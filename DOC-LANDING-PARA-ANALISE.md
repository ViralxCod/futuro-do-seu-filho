# Documentação da Landing Page — "Futuro do seu Filho" (para análise de anúncios)

> Documento gerado a partir do código-fonte da aplicação (fonte da verdade). Serve para um assistente que **não consegue abrir o link .vercel.app** analisar o funil.

---

## 1. Domínio

- **NÃO existe domínio próprio** (nenhum `.com.br` ou similar configurado).
- Único endereço, e **domínio canônico oficial**: **https://futuro-do-seu-filho.vercel.app**
- Toda a estrutura (og:url, og:image, URL de retorno de pagamento) aponta para esse domínio Vercel.
- É uma **SPA (Single Page Application)** em React — todas as "telas" vivem no mesmo endereço, mudando só a rota no navegador (`/`, `/quiz`, `/resultado`, etc.). Não são páginas separadas recarregadas do servidor.

---

## 2. Ordem das telas e texto completo

O fluxo do usuário é, na ordem exata:
`Landing (/)` → `Quiz (/quiz)` → `Analisando (/analisando)` → `Resultado (/resultado)` → `Oferta/Checkout (/desbloquear)` → `[Cakto pagamento]` → `Retorno (/obrigada)` → `Upsell (/manual)` → `Mapa (/mapa)`

### TELA 1 — Landing (`/`)

- **Chip de topo:** `ANÁLISE COMPORTAMENTAL • 2 A 12 ANOS`
- **Headline principal:**
  > Você jura toda manhã que hoje vai ser paciente. Aí dá 18h... e você vira **alguém que você mesma odeia.**
- **Texto de introdução:**
  > Quem você está criando hoje: o adulto que vai te agradecer — ou o que vai carregar os seus erros? Responda 12 perguntas rápidas sobre o seu dia a dia e **veja o futuro do seu filho** antes que seja tarde para mudá-lo.
- **Botão principal (CTA):** `🔓 DESCOBRIR O FUTURO DO MEU FILHO →`
- **Selos abaixo do botão:**
  - 🔒 Suas respostas são 100% anônimas e confidenciais
  - ✓ Gratuito para começar  ✓ 3 minutos  ✓ **+14.320 mães já descobriram**
- **3 bullets de benefício:**
  - 🧠 Descubra qual dos **4 Perfis de Futuro** seu filho está desenvolvendo agora — com base em como VOCÊ age, não no que você planeja
  - 👀 Veja o **ponto cego** que 8 em cada 10 mães não percebem na própria rotina (e que aparece nele aos 14 anos)
  - ⏱️ Leva menos de 3 minutos — e o resultado pode mudar a forma como você age hoje e evitar o erro no futuro do seu filho ou filha
- **Box de aviso (humor):**
  > ⚠️ Aviso: se depois do resultado você olhar para o seu filho de outro jeito hoje à noite... a gente aceita um obrigada.
- **Frase emocional (card claro):**
  > Se você já chorou baixinho olhando ele dormir, pedindo perdão em silêncio pelo grito de mais cedo... este teste foi feito para você.
- **Depoimento (rodapé):**
  > ⭐⭐⭐⭐⭐ "Eu li a primeira pergunta e pensei: 'meu Deus, sou eu'. Chorei no resultado." — Camila R., mãe do Theo (4 anos)
- Após 50% de rolagem, aparece um **CTA fixo** no rodapé, repetindo o botão principal.

### TELA 2 — Quiz (`/quiz`) — uma pergunta por tela

Antes das perguntas, 3 micro-telas de personalização (as respostas personalizam todo o texto seguinte com o nome/gênero da criança):
1. **É menino ou menina?** (botões 👦 Menino / 👧 Menina)
2. **Qual a idade?** (grade de 1 a 16)
3. **Qual o nome dele/dela?** (campo de texto) → botão `Começar a análise →`

Depois, **12 perguntas** (uma por tela, com barra de progresso dourada em %). O texto usa o nome da criança (abaixo mostrado com `{NOME}` = nome informado):

**BLOCO 1 — O caos do dia a dia**
- **P1:** Você manda o {NOME} guardar os brinquedos. Fala uma vez, duas, DEZ. O que acontece na sua casa?
  - A) Na primeira ele já sabe que é sério. Aqui tem ordem
  - B) Invento um joguinho pra ele topar (funciona... às vezes)
  - C) Eu grito. Aí ele chora, eu me sinto um lixo — e o brinquedo continua lá
  - D) Respiro, agacho e explico. Na maioria das vezes funciona
- **P2:** Se o {NOME} fizer birra no meio do mercado, todo mundo olhando... o que passa pela sua cabeça NA HORA?
  - A) "Pode chorar. O 'não' continua sendo não"
  - B) "Vou distrair ele e sair dessa o mais rápido possível"
  - C) "Que vergonha. Todo mundo pensando que eu não sei ser mãe"
  - D) "Ele não tá me desafiando, tá transbordando. Vou agachar e conversar"
  - E) ✍️ O {NOME} não faz birra (abre campo livre opcional: "como ele reage quando ouve um NÃO?")
- **P3:** O {NOME} te olha nos olhos... e faz EXATAMENTE o oposto do que você pediu. Qual sua reação honesta?
  - A) Consequência na hora. Combinado é combinado
  - B) Respiro fundo e viro brincadeira pra não virar guerra
  - C) GRITO. Falei com calma 10 vezes e fui ignorada — ninguém é de ferro
  - D) Pergunto o que tá acontecendo com ele antes de reagir

*(Tela de insight entre blocos):* 💡 **Você sabia?** Antes dos 7 anos, o cérebro do seu filho aprende mais observando você do que ouvindo qualquer instrução. Ele não grava o que você fala 10 vezes — grava o que você FAZ na 11ª...

**BLOCO 2 — Depois da explosão**
- **P4:** O dia foi pesado, você tá no limite... e o {NOME} apronta MAIS uma. O que sai de você?
  - A) Firmeza fria. Castigo dado, sem escândalo
  - B) Conto até dez e tento o humor (nem sempre sai)
  - C) Sai um grito que eu nem reconheço minha voz. Depois vem aquele aperto no peito
  - D) Saio de perto, me acalmo, e volto pra resolver
- **P5:** Depois de gritar com o {NOME}... o que você faz?
  - A) Sigo em frente. Culpa não educa ninguém
  - B) Faço uma graça pra quebrar o gelo e ver ele rir de novo
  - C) Espero ele dormir, fico olhando ele na cama e choro baixinho. Juro que amanhã vai ser diferente
  - D) Peço desculpa na hora e explico o que eu senti
- **P6:** Você salva aqueles posts de 'como educar sem gritar', promete que agora vai... e na hora do caos?
  - A) Aplico o que dá. Teoria é teoria, minha casa é real
  - B) Improviso uma mistura do que li com o que inventei
  - C) Prometo pra mim mesma que vou mudar... e nunca mudo. No fim grito igual minha mãe gritava comigo
  - D) Consigo aplicar na maioria das vezes, mesmo imperfeita

*(Insight):* ⚠️ **Isso precisa ser dito:** o grito não é o que define o futuro do seu filho. É o que acontece nos 10 minutos depois dele... + card "Descoberta 1 de 4 desbloqueada".

**BLOCO 3 — O peso que você carrega**
- **P7:** Seu marido (ou sua sogra) solta: 'você não faz NADA o dia todo'. O que você faz?
  - A) Corto na hora. Aqui ninguém fala assim comigo
  - B) Rio pra não brigar... e engulo seco
  - C) Exploto. E no final EU viro 'a descontrolada' da história
  - D) Já rendeu uma conversa séria que precisava acontecer
- **P8:** Lanche da escola, pediatra, tamanho do sapato, fantasia da festa junina... quem carrega TUDO isso na cabeça?
  - A) Eu — mas montei um esquema e deleguei o que deu
  - B) Eu — do meu jeito bagunçado que funciona
  - C) EU. TUDO. SEMPRE. E se der errado, a culpa ainda vai ser minha
  - D) Eu na frente, mas tenho quem divida comigo
- **P9:** Completa com sinceridade: 'A mulher que eu era antes do {NOME}...'
  - A) ...ainda existe. Eu me recuso a sumir
  - B) ...aparece nas raras horas só minhas
  - C) ...morreu. Hoje sou só 'a mãe do {NOME}'. Ninguém pergunta como EU tô
  - D) ...virou outra — e tô aprendendo a gostar dela

*(Insight):* 💛 Se algumas dessas respostas doeram, respira: você não está sendo julgada aqui. 73% das mães que chegam neste ponto respondem igual a você...

**BLOCO 4 — O medo do futuro**
- **P10:** Na hora de dar um castigo DE VERDADE no {NOME}, o que trava você?
  - A) Nada. Limite é amor e aqui funciona
  - B) Tento o meio-termo, sem drama
  - C) Medo. Se castigo, traumatizo. Se deixo, crio um sem-limites. Fico travada — e ele PERCEBE
  - D) Dou o limite, mas acolho o choro depois
- **P11:** Casa em silêncio, cabeça no travesseiro. Qual pensamento vem te assombrar? *(subtítulo: "92% das mães nunca contaram isso a ninguém.")*
  - A) 'Tô sendo dura demais... será que ele vai me achar fria?'
  - B) 'Tá faltando pulso firme aqui em casa e eu sei disso'
  - C) 'Eu tô estragando o meu filho. Ele vai crescer e me odiar — e vai ser culpa minha'
  - D) 'Será que eu dou conta de tudo o que ele sente?'
- **P12:** Daqui a 20 anos, o {NOME}, adulto, senta na sua frente e fala da infância dele. Qual frase você MAIS teme ouvir?
  - A) "Você era dura demais, mãe"
  - B) "Era divertido, mas faltou alguém no comando"
  - C) "Eu lembro dos seus gritos. Eu tinha medo de você"
  - D) "Você cuidava de todo mundo... menos de você"
  - E) "Você era uma péssima mãe"

**Tela de COMPROMISSO** (última do quiz):
- **Pergunta:** Se o Mapa revelar o ponto cego do seu padrão... **você quer saber?**
- **Botão principal:** `🔓 Quero a verdade completa`
- **Link secundário (cinza):** `Prefiro só o resumo`

### TELA 3 — Analisando (`/analisando`)

Tela teatral de processamento (~6 segundos, avança sozinha). Selo `✓ ETAPA 4 DESBLOQUEADA`, barra indo a 100%, anel dourado girando com 🧠, e frases em sequência:
- Cruzando suas 12 respostas...
- Padrão de rotina: identificado ✓
- Comparando com padrões de +14.000 perfis de mães...
- Resposta à frustração: mapeada ✓
- Identificando o que seu filho está 'gravando' de você...
- Nível de conexão: calculado ✓
- ✓ Perfil encontrado.

### TELA 4 — Resultado (`/resultado`)

Mostra o **Perfil de Futuro** (1 de 4, calculado pelas respostas). Tem um **contador regressivo real de 7 minutos** no topo (quando zera, as respostas são apagadas de verdade e o quiz precisa ser refeito).

- **Cabeçalho:** 🏆 Analisamos suas respostas. O Perfil de Futuro do/da [NOME] é:
- **Nome do perfil** (revelado com efeito de blur→nítido). Os 4 perfis possíveis:
  - **A —** O VISIONÁRIO DETERMINADO
  - **B —** O CRIATIVO RESILIENTE
  - **C —** O CORAÇÃO EM CONSTRUÇÃO
  - **D —** O COMUNICADOR EMPÁTICO
- **Validação/absolvição** (card claro), ex. (perfil C): "Primeiro, o mais importante: você não é um monstro. Mãe que grita e chora escondida depois não é mãe ruim — é mãe exausta..."
- **Revelação progressiva** (cada uma exige um clique — "Revelar minha 1ª descoberta →", depois a 2ª, depois a última):
  - Descoberta 1 de 3 — Insight #1 (o que você está acertando)
  - Descoberta 2 de 3 — Insight #2 (o que ele está gravando de verdade)
  - Descoberta 3 de 3 — Insight #3 (o "ponto cego" com uma **tarja preta censurando** parte do texto ▓▓▓▓)
- **Seção bloqueada** (blur + cadeado 🔒) com o título "🔒 O seu Mapa Completo de Projeção revela:" e bullets do que está travado. Botão `🔓 DESBLOQUEAR MEU MAPA COMPLETO →` leva à tela de oferta.

### TELA 5 — Oferta / pré-checkout (`/desbloquear`)

Página de venda do **"Mapa"** (produto 1). Contador de 7 min no topo.
- **Headline:** Seu Mapa está pronto. Falta só você ter **coragem de olhar.**
- Stack de valor (3 itens): 📍 O Ponto Cego Revelado (R$47), 📈 Projeção Ano a Ano (R$67), 💯 Seu Score de Conexão (R$47)
- **Ancoragem de preço:** ~~De R$ 161~~ por apenas: **R$ 19,99**
- Legenda: "Menos que um lanche no shopping..."
- **Botão de compra (principal):** `🔓 VER MEU RESULTADO COMPLETO AGORA — R$ 19,99 →`
- Garantia "Arrepio" (7 dias, devolução 100%), depoimentos em print de WhatsApp, aviso de expiração com contador, e um **segundo botão de compra** no fim: `🔓 DESBLOQUEAR O FUTURO DO/DA [NOME] — R$ 19,99 →`
- FAQ (4 perguntas).
- **Ambos os botões levam ao checkout do Cakto (produto Mapa).**

### TELA 6 — Retorno do pagamento (`/obrigada`)

Após pagar no Cakto e voltar. Mostra ✓ e: "✓ Pagamento confirmado. Criamos sua conta n'O Ninho com o e-mail da compra. Preparando seu Mapa..." — redireciona sozinho (2 s) para o upsell.

### TELA 7 — Upsell (`/manual`)

Oferta do **"Manual da Mãe Presente"** (produto 2), depois de já ter pago o Mapa.
- **Headline:** Espera. Seu Mapa mostra ONDE está o problema. Ele não mostra o que fazer **amanhã às 18h.**
- Stack (4 itens): 🕯️ Ritual dos 10 Minutos Depois (R$37), ⚖️ Critério Anti-Paralisia (R$47), 🗣️ Guia "As 12 Frases..." (R$29), 🎁 Bônus Plano de 30 Dias (R$27)
- **Preço:** ~~De R$ 140~~ por apenas: **+ R$ 27,99** ("✓ Em um clique — sem digitar o cartão de novo")
- **Botão SIM:** `✅ SIM — QUERO O MAPA + O MANUAL (adicionar por R$ 27,99) →`
- **Botão NÃO** (cinza, pequeno): "Não, obrigada. Quero apenas ver o diagnóstico..."

---

## 3. Preços exatos (resumo para o checkout)

| Produto | Preço no site / botão | Ancoragem | Link Cakto |
|---|---|---|---|
| **Mapa** (produto 1) | **R$ 19,99** | R$ 161 | `pay.cakto.com.br/322er8j_971607` |
| **Manual** (upsell) | **R$ 27,99** | R$ 140 | `pay.cakto.com.br/399isvc_971606` |

⚠️ **Atenção (inconsistência de preço):** um comentário no código indica que a copy em algum momento prometia "R$ 27,00", mas o valor real cobrado no Cakto e exibido no botão é **R$ 27,99**. Vale alinhar antes de rodar tráfego para não gerar reclamação.

---

## 4. Comportamento do checkout Cakto

- O clique no botão de compra faz **`window.location.href = <link Cakto>`** → ou seja, **abre na MESMA aba** (navegação direta, substituindo a página).
- **NÃO** abre nova aba, **NÃO** é pop-up.
- Após o pagamento, o Cakto deve redirecionar de volta para `https://futuro-do-seu-filho.vercel.app/obrigada?paid=1` (retorno configurado no painel do gateway).

---

## 5. Tempo de carregamento e redirecionamentos

- **Não há uma métrica medida de tempo de carregamento** (não há Lighthouse/monitor configurado no código). Observações estruturais:
  - É uma SPA React (Vite) leve, hospedada na Vercel (CDN). O carregamento inicial baixa um bundle JS único; a partir daí, **as trocas de tela são client-side e instantâneas** (não há recarga de página entre Landing → Quiz → Resultado etc.).
  - Pixels da Meta carregam de forma assíncrona no boot (não bloqueiam a renderização).
- **Redirecionamentos / esperas intencionais (não são falhas):**
  - Tela **"Analisando"**: espera teatral de ~**5,8 segundos** antes de ir ao Resultado.
  - Tela **"Obrigada"** (pós-pagamento): espera **2 segundos** e redireciona para o upsell.
  - **Checkout Cakto:** é uma navegação externa (sai do domínio Vercel e vai para `pay.cakto.com.br`) — o tempo aqui depende do próprio Cakto.
- **Ponto de possível quebra a monitorar:** o retorno do pagamento depende do Cakto redirecionar corretamente para `/obrigada?paid=1`. Se o gateway não enviar esse parâmetro, o usuário cai de volta na página de oferta em vez de avançar. A liberação do conteúdo hoje é por flag de URL + localStorage (ainda não há validação server-side por webhook).

---

## 6. Descrição visual

- **Formato:** mobile-first, coluna estreita centralizada (~480px máx). Pensada para celular.
- **Tema:** fundo escuro (azul-noite `#1a1a2e`), com destaque em **dourado** (`#f0c75e`), cards em **creme claro**, e acentos em **verde-menta** e **coral**.
- **Uma pergunta/elemento por tela** no quiz (não é tudo junto numa página só).
- **Sem vídeo.** Não há vídeo em nenhuma tela.
- **Imagens:** praticamente não usa fotos — o visual é construído com **emojis** (👦👧🧠🔒⚠️💛), ícones SVG (logo, selo de garantia), barras de progresso e uma logo "O Ninho". Os "depoimentos" são simulações de print de WhatsApp renderizadas em HTML.
- **Muita animação/gamificação:** barra de progresso dourada em %, selos de "etapa desbloqueada", confete, anel giratório de "cálculo", efeito de revelação blur→nítido, tarja preta censurando o ponto cego, cadeado balançando na seção travada. Há também **sons** (tique a cada clique, "chime" de conquista) e **vibração/háptico** no celular.
- **Tom da copy:** emocional, direto, focado na culpa materna e no medo do futuro do filho — linguagem coloquial de mãe.

---

## ⚠️ Observações importantes para quem roda os anúncios

1. **Depoimentos e números são FICTÍCIOS** (marcados como exemplos no código): "+14.320 mães", "73% das mães", "92% nunca contaram", os depoimentos da Camila/Juliana/Renata e os prints de WhatsApp. Publicar depoimento inventado ou contador falso é **propaganda enganosa (CDC art. 37)** e é uma das principais causas de **bloqueio de conta de anúncio** na Meta/TikTok. **Substituir por dados reais antes de escalar tráfego.**
2. **O contador de 7 minutos é REAL** — quando zera, o resultado é de fato apagado. A escassez não é falsa (isso é bom para compliance).
3. **Inconsistência de preço** do Manual (R$ 27,00 na copy antiga × R$ 27,99 cobrado) — ver seção 3.
4. **Pixel da Meta ativo:** ID `2255954778500790`. Eventos disparados no funil: `PageView`, `Lead` (início do quiz), `InitiateCheckout` (R$19,99), `Purchase` (com deduplicação Pixel + Conversions API server-side). TikTok Pixel **ainda não configurado** (ID vazio).
