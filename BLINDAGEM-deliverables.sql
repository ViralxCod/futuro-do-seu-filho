-- ============================================================
-- BLINDAGEM DO CONTEÚDO — tabela deliverables + RLS por entitlement
-- Rode isto no Supabase → SQL Editor. Reexecutável (limpa e recarrega).
-- O conteúdo só é devolvido pela API para quem tem o produto liberado.
-- ============================================================

create table if not exists public.deliverables (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  ord int not null default 0,
  title text not null,
  body_md text not null
);
create index if not exists deliverables_slug_idx on public.deliverables(product_slug);

alter table public.deliverables enable row level security;

drop policy if exists "read own deliverables" on public.deliverables;
create policy "read own deliverables" on public.deliverables
  for select to authenticated
  using (
    exists (
      select 1 from public.entitlements e
      join public.products p on p.id = e.product_id
      where e.user_id = auth.uid() and p.slug = public.deliverables.product_slug
    )
  );

grant select on public.deliverables to authenticated;

-- recarga idempotente
delete from public.deliverables;

insert into public.deliverables (product_slug, ord, title, body_md) values
('mapa', 1, $t$O Mapa do Seu Filho$t$, $md$# O Mapa do Seu Filho

### O que o seu filho realmente grava de você — e por que ainda dá tempo de reescrever

---

Antes de qualquer coisa, respira.

Se você fez o teste das 12 perguntas e chegou até aqui, já fez algo que muita mãe não faz: parou pra olhar de verdade. Não pra se julgar. Pra entender.

Então leia este mapa com carinho. Ele não é um veredito sobre que mãe você é. É uma lanterna acendendo num canto que quase ninguém te ensinou a enxergar.

---

## A criança aprende com os olhos, não com os ouvidos

A gente cresceu ouvindo que educar é falar. Explicar. Repetir. "Quantas vezes eu já te disse?"

Mas tem uma verdade simples que muda tudo: **seu filho aprende muito mais te observando do que te ouvindo.**

Ele te olha o dia inteiro. Vê como você reage quando o leite entorna. Vê seu rosto quando o celular toca no pior momento. Vê o que você faz com a raiva, com o cansaço, com a frustração.

E é isso que ele grava. Não o que você diz sobre calma — mas o que você faz quando perde a calma.

Não é culpa. É como o cérebro pequenininho dele funciona. Ele aprende a viver observando quem ele mais ama viver.

---

## Ele não grava o grito. Ele grava o ciclo.

Aqui está a parte que alivia — e que quase ninguém te conta.

Seu filho não guarda cada grito isolado como uma cicatriz. O que ele grava é o **ciclo inteiro**. A história completa. E ela tem três partes:

**1. A tensão que sobe.** O clima que pesa antes. Seu ombro que enrijece, sua voz que muda de tom, o ar que fica denso. Ele sente isso chegando antes de você mesma perceber.

**2. A explosão.** O grito, a frase dura, a porta batendo.

**3. O que vem depois.** E é aqui que mora o mais importante. O que acontece depois do grito? Você some pro quarto em silêncio? Ou você volta, se abaixa na altura dele, e diz "a mamãe se estressou, me desculpa"?

**É o depois que educa.** Porque é no depois que seu filho aprende o que fazer com os próprios erros. Se ele vê você reparar, ele aprende que errar não é o fim — é o começo do conserto.

Então não é sobre nunca mais gritar. É sobre o que você ensina a fazer com a tempestade.

---

## Os 4 Perfis de Futuro

O teste desenhou um retrato do que seu filho está gravando agora. Não um destino fechado — uma tendência. Uma direção que dá pra ajustar a qualquer momento.

Leia o seu com o coração aberto. Nenhum deles é "errado". Todos são pontos de partida.

---

### Coração em Construção

Esse é o filho que sente tudo muito fundo. Que chora fácil, se afeta com o clima da casa, guarda as coisas por dentro.

Se esse é o retrato de agora, saiba: **isso não é fragilidade.** É sensibilidade — e sensibilidade bem acolhida vira a maior força que um ser humano pode ter. Empatia, cuidado, profundidade.

Ele só precisa de um porto seguro pra aprender que sentir muito não é perigoso. E esse porto é você, mesmo nos seus dias difíceis.

---

### Visionário Determinado

Esse é o filho teimoso. O que questiona, resiste, testa cada limite como se fosse um contrato.

Cansa, eu sei. Mas olha de novo: essa criança tem **vontade própria**. Firmeza. Ela não vai ser fácil de manipular na vida, não vai seguir a manada.

O que hoje parece birra amanhã vira liderança. Ele só precisa aprender que pode ser forte sem virar contra você — e isso ele aprende vendo você ser firme sem ser dura.

---

### Criativo Resiliente

Esse é o filho do mundo dele. O que inventa, imagina, se distrai, transforma uma caixa de papelão em nave espacial.

Ele levanta rápido depois de um tombo. Se adapta. Encontra saída onde os outros veem parede.

Se esse é o retrato, você tem em casa alguém que vai saber **recomeçar a vida inteira**. Ele só precisa que você proteja essa imaginação em vez de apressá-la. O mundo já vai cobrar pressa demais dele lá fora.

---

### Comunicador Empático

Esse é o filho que fala. Que pergunta, que negocia, que percebe quando você está triste antes de você dizer.

Ele lê as pessoas. Se conecta. Puxa conversa com a fila inteira do mercado.

Essa criança carrega um dom raro: **fazer os outros se sentirem vistos.** Ele só precisa aprender que também pode receber, não só cuidar dos outros. E aprende isso quando você cuida dele em voz alta.

---

## E se eu vi coisas que doeram no resultado?

Então você é uma mãe honesta. Só isso.

O teste não mede o quanto você ama — isso ninguém precisa medir, é gigante. Ele só mostra o padrão que está rodando na casa agora, no automático, no cansaço.

E padrão que a gente enxerga, a gente muda.

---

## A esperança é real: o padrão dá pra reescrever

Aqui está a verdade mais importante de todo este mapa:

**Nada disso está gravado em pedra.**

O cérebro do seu filho é uma história ainda sendo escrita — e você é a autora principal. Cada vez que você repara depois de um erro, cada vez que você respira antes de explodir, cada abraço depois da tempestade, você reescreve uma página.

Não precisa ser perfeita. Precisa ser presente. Seu filho não precisa de uma mãe que nunca erra. Precisa de uma mãe que volta.

E você já voltou. Você está aqui.

Esse é o primeiro passo do novo mapa.

---

*Guarde este documento. Releia daqui a um mês. Você vai se surpreender com o quanto já mudou.*
$md$),
('mapa', 2, $t$Guia dos 5 Gatilhos das 18h$t$, $md$# Os 5 Gatilhos das 18h

### Por que o fim de tarde é o campo minado — e como desarmar cada explosão antes dela acontecer

---

Existe uma hora do dia em que tudo desanda.

Não é coincidência. Por volta das 18h, a criança está no fundo do tanque, você está no fundo do tanque, e a casa inteira pede coisas ao mesmo tempo. É o encontro perfeito de todo o cansaço do dia.

Esse guia não vai te pedir pra ser uma mãe zen. Vai te mostrar os **5 gatilhos** que fazem a bomba explodir — e como cortar o pavio de cada um.

Você não precisa desarmar todos. Comece por um.

---

## Gatilho 1: A criança com fome e cansaço

### Como se manifesta

Aquela criança que era um anjo às 15h vira outra pessoa. Chora por nada. Se joga no chão porque o biscoito quebrou. Não aceita "não", não aceita "sim", não aceita nada.

### Por que dispara

O corpo pequeno dela está literalmente sem combustível. Açúcar no sangue baixo, sono acumulado, energia zerada. Ela **não está te desafiando** — ela está desregulada e não sabe pedir ajuda com palavras. O único idioma que sobra é o choro e a birra.

E aí você, também esgotada, lê aquilo como "provocação". Não é.

### Como desarmar

- **Antecipe o combustível.** Um lanchinho às 17h, antes da crise. Fruta, pão, o que for. Muita birra das 18h é só fome disfarçada.
- **Abaixe as exigências dessa janela.** Não é hora de ensinar boas maneiras nem de dar bronca educativa. É hora de atravessar. Ensine em outro momento.
- **Nomeie por ela:** "Você está com fome e cansada, né? Tá difícil." Só de sentir que você entendeu, o corpo dela já começa a acalmar.

---

## Gatilho 2: O seu tanque emocional zerado

### Como se manifesta

Você percebe que está com o pavio curtíssimo. Qualquer coisinha te tira do sério. Você grita por um copo derrubado e depois pensa: "meu Deus, foi só um copo".

### Por que dispara

Não foi o copo. Foi o copo **em cima de** dez horas de trabalho, mais o boleto, mais a louça, mais a sua mãe que ligou cobrando, mais a noite mal dormida. O copo foi só a última gota de um tanque que já estava transbordando.

A gente não explode pelo que está na frente. Explode pelo peso que carregou o dia todo em silêncio.

### Como desarmar

- **Reconheça o nível do tanque.** Antes de chegar em casa, pergunte a si mesma: "de 0 a 10, quanto eu aguento hoje?" Se for baixo, você já sabe que precisa de mais margem — e menos autocobrança.
- **Roube 2 minutos só seus.** Antes de entrar na maratona, um copo d'água em pé na cozinha, três respirações, um áudio. Parece pouco. Não é.
- **Abaixe a régua do dia.** Num dia de tanque vazio, jantar é o que der, banho pode ser rápido, e "casa bagunçada" não é fracasso. Sobreviver bem é vencer.

---

## Gatilho 3: O "não ouvir da primeira vez"

### Como se manifesta

Você pede uma vez. Duas. Três. Na quinta, você já está gritando. E odeia ter chegado ali, porque você jurou que não ia gritar de novo.

### Por que dispara

Cada pedido ignorado parece uma pequena falta de respeito. A tensão vai acumulando em silêncio até estourar. Só que, do lado da criança, quase nunca é desrespeito — o cérebro dela ainda não faz a troca rápida de uma tarefa pra outra, ainda mais quando está imersa em algo (a TV, o brinquedo, a imaginação).

Ela não te ignorou de propósito. Ela ainda não chegou de verdade.

### Como desarmar

- **Chegue perto antes de pedir.** Grito da cozinha pro quarto quase nunca funciona. Chegue perto, toque no ombro, olhe nos olhos. Aí sim peça.
- **Um pedido, uma ação.** Em vez de "arruma tudo isso", diga "pega esse carrinho e põe na caixa". Concreto, pequeno, possível.
- **Dê o aviso de transição.** "Em 5 minutinhos vamos desligar." A criança que sabe que a mudança vem resiste muito menos do que a que é pega de surpresa.

---

## Gatilho 4: Barulho e estímulo demais

### Como se manifesta

A TV ligada, a criança falando, o celular apitando, a panela no fogo, o cachorro latindo — e de repente você sente que vai explodir sem nem saber exatamente por quê.

### Por que dispara

Seu cérebro tem um limite de coisas que consegue processar ao mesmo tempo. Quando o ambiente satura de som e movimento, seu sistema entra em alerta, como se houvesse perigo. A raiva sobe porque seu corpo está pedindo socorro: **"é demais, preciso que pare".**

Não é frescura. É seu sistema nervoso pedindo silêncio.

### Como desarmar

- **Corte uma fonte de barulho.** Desligue a TV que ninguém está vendo. Tire o som das notificações. Menos estímulo, menos pavio aceso.
- **Baixe a luz.** No fim da tarde, luz mais amena acalma a casa inteira — você e a criança. É quase mágica o efeito de trocar a luz branca forte por uma mais quentinha.
- **Dê um comando pro corpo:** ao sentir a saturação, uma respiração longa com a expiração mais demorada que a inspiração. Isso avisa o cérebro que não há perigo real.

---

## Gatilho 5: A pressa de tudo ao mesmo tempo

### Como se manifesta

Jantar, banho, dever de casa, escovar os dentes, guardar brinquedo, dormir — tudo empilhado na mesma hora, e você correndo pra dar conta. Cada minuto que a criança "enrola" parece te empurrar mais pro abismo.

### Por que dispara

A pressa liga o alarme interno de "não vou conseguir". E criança **sente a pressa da mãe e trava** — anda mais devagar justamente quando você mais precisa que ela ande rápido. Vira um cabo de guerra onde os dois perdem.

O relógio vira o inimigo, e a criança acaba levando a culpa por uma corrida que não é dela.

### Como desarmar

- **Antecipe 15 minutos.** Começar a rotina da noite um pouco mais cedo tira o veneno da pressa. O tempo extra é o melhor calmante que existe.
- **Uma coisa de cada vez.** Não tente vencer a lista inteira de uma vez na cabeça. Só o próximo passo. Agora é o jantar. Só o jantar.
- **Transforme em jogo, não em corrida.** "Quem chega primeiro no banho?" rende muito mais que "anda logo!". A criança coopera brincando o que resiste sob pressão.

---

## Antes de fechar

Você não vai desarmar os cinco de uma vez. Nem precisa.

Escolha **o gatilho que mais pesa na sua casa** e cuide só dele essa semana. Um pavio cortado já muda o clima de muitas noites.

E nos dias em que nada der certo e você explodir mesmo assim — respira. Volta. Repara. Isso também faz parte. Você está aprendendo, e seu filho está aprendendo com você que a gente sempre pode recomeçar.

---

*Cole este guia na geladeira. Na hora do aperto, você vai lembrar: tem nome, tem motivo, e tem saída.*
$md$),
('mapa', 3, $t$Áudios de Primeiro Socorro no Grito$t$, $md$# Áudios de Primeiro Socorro no Grito

### Três vozes de amiga pra você ouvir nos segundos antes de explodir

---

Estes são os roteiros dos três áudios de 60 segundos.

Cada um foi escrito pra ser ouvido **naquele instante** — quando você sente que vai perder. Escolha pelo momento, aperte o play, e deixe outra voz segurar a sua mão por um minuto.

A locução é calma, baixa, sem pressa. Como uma amiga bem pertinho do seu ouvido.

---

## Áudio 1 — "Segura aí, você não é a vilã"

**Quando ouvir:** no segundo em que a raiva sobe e você sente que vai gritar. Aperte o play antes de abrir a boca.

---

*[voz baixa, calma, quase sussurrando no começo]*

Ei. [pausa] Segura aí comigo um segundinho.

Eu sei o que você tá sentindo agora. [pausa] Esse aperto, essa vontade de explodir, esse "eu não aguento mais". [pausa] Eu já senti isso. Muita mãe já sentiu.

E eu preciso que você ouça uma coisa: [pausa] você **não** é a vilã dessa história. [pausa longa]

Você é uma mãe cansada. Só isso. Uma mãe que ama muito e que tá no fim das forças. Isso não te faz ruim. Isso te faz gente.

*[um tom mais firme, acolhedor]*

O que você sente não é o que você é. A raiva vem, sobe, e vai embora — se você deixar ela passar sem virar grito. [pausa]

Então respira comigo. [pausa] Só mais três segundos aqui, do meu lado. [pausa]

Você consegue segurar isso. Não porque é forte o tempo todo. [pausa] Mas porque, bem agora, você escolheu me ouvir em vez de gritar.

E isso já mudou tudo. [pausa]

Tá tudo bem. Você tá indo bem.

---

## Áudio 2 — "Respira comigo agora"

**Quando ouvir:** quando o corpo já disparou — coração acelerado, peito apertado — e você precisa baixar a fervura antes de agir.

---

*[voz mansa, ritmo lento]*

Oi. [pausa] Vamos respirar juntas agora. Só isso. Nada mais.

Não precisa resolver nada nesse minuto. O problema pode esperar sessenta segundos. Ele espera. [pausa]

Vamos lá. Solta os ombros. [pausa] Desce eles, longe da orelha. [pausa]

Agora inspira devagarinho pelo nariz comigo. [pausa] Um… dois… três… quatro… [pausa]

Segura só um instante. [pausa]

E agora solta bem devagar pela boca, mais devagar do que entrou. [pausa longa] Isso… solta tudo. [pausa]

*[ainda mais calma]*

De novo. Inspira… [pausa] dois… três… quatro… [pausa] e solta. [pausa longa]

Sente o ar saindo? É o seu corpo entendendo que não tem perigo aqui. [pausa] Que você tá segura. Que dá tempo.

Mais uma. Inspira a calma… [pausa] e solta o aperto. [pausa longa]

Pronto. [pausa] Seu coração já tá mais devagar. Você voltou pra dentro de você.

Agora, do seu jeitinho, no seu tempo… segue. Você já está mais inteira.

---

## Áudio 3 — "Você já foi criança também"

**Quando ouvir:** depois de um dia pesado, ou quando a culpa aperta e você precisa de colo — não de cobrança.

---

*[voz doce, próxima, sem pressa]*

Vem cá. [pausa] Deixa eu te lembrar de uma coisa que você esqueceu no meio do cansaço.

Você também já foi criança. [pausa]

Já teve seus dias de birra, de choro sem motivo, de fazer manha porque o mundo tava grande demais. [pausa] E você também precisou de alguém que tivesse paciência com você.

*[mais suave]*

Então olha com carinho pra essa mãe que você é hoje. [pausa] Ela acorda cedo, dá conta de mil coisas, ama com uma intensidade que ninguém vê. [pausa] E ainda cobra de si mesma ser perfeita.

Chega. [pausa] Você não precisa ser perfeita. Nunca precisou.

Seu filho não precisa de uma mãe sem falhas. [pausa] Ele precisa de você — de verdade, cansada, real, que erra e que volta pra pedir desculpa. [pausa]

*[com ternura]*

Se você gritou hoje, isso não apaga todo o amor que você dá. [pausa] Um dia difícil não define você.

Então respira, e se perdoa. [pausa] Do mesmo jeito que você perdoaria aquela menininha que você já foi.

Amanhã é uma página nova. E você é uma boa mãe. [pausa] Sempre foi.

---

*Salve estes três áudios no seu celular, numa pasta fácil de achar. Na hora do aperto, você não vai querer procurar. Vai querer só apertar o play.*
$md$),
('mapa', 4, $t$Termômetro do Corpo$t$, $md$# O Termômetro do Corpo

### Seu corpo avisa antes do grito. Aprenda a escutar o alarme.

---

O grito nunca vem do nada.

Parece que vem — parece que você estava bem e do nada explodiu. Mas não é verdade. Antes de qualquer grito, seu corpo tocou um alarme. Vários, na verdade. Você só não foi ensinada a escutar.

Este guia é sobre isso: **transformar seu corpo no seu melhor aliado.** Ele avisa com antecedência. Quando você aprende a ler os sinais, ganha alguns segundos preciosos — e são nesses segundos que mora a escolha.

---

## Seu corpo fala antes da sua boca

Quando a raiva começa a subir, seu corpo se prepara pra "lutar". É automático, vem de milhares de anos de evolução, e acontece sem você pedir. O coração acelera, os músculos tensionam, o sangue sobe pro rosto.

Isso tudo tem uma função: te deixar pronta pra reagir a um perigo. O problema é que, dentro de casa, o "perigo" é uma criança de 4 anos derrubando suco — e a reação de luta vira grito.

A boa notícia? **Esses sinais chegam antes da explosão.** Se você aprende a senti-los, consegue agir enquanto ainda dá tempo.

Não é sobre controlar a raiva com força de vontade. É sobre perceber ela cedo, quando ela ainda é pequena e fácil de segurar.

---

## O Termômetro: três níveis

Pense na sua raiva como um termômetro que sobe aos poucos. Ela quase nunca pula direto pro topo. Ela sobe degrau por degrau — e cada degrau tem sinais no corpo que você pode aprender a reconhecer.

---

### 🟢 Nível Verde — Tudo calmo (mas fique atenta)

**Como o corpo está:** respiração tranquila, ombros soltos, voz normal. Você está cansada, talvez, mas ainda inteira.

**O que já pode estar acontecendo por baixo:** um leve incômodo, uma impaciência que começa a cutucar. É sutil. Fácil de ignorar.

**O que fazer aqui:**
- Este é o melhor momento pra se cuidar, porque é fácil. Beba água, coma algo, sente um minuto.
- Faça um check-in rápido: "como eu estou de verdade agora?" Só a pergunta já te mantém consciente.
- No verde, você tem todas as escolhas do mundo. Aproveite.

---

### 🟡 Nível Amarelo — O alarme começou

**Como o corpo está — preste muita atenção nesses sinais:**
- O **peito aperta**, fica um peso ali no meio.
- O **coração acelera** um pouco, você sente o ritmo mudar.
- A **mandíbula trava**, os dentes se cerram sem você mandar.
- As **mãos ficam tensas**, às vezes fecham em punho.
- Sua **voz muda** — fica mais alta, mais rápida, mais cortante.

**O que isso significa:** este é o aviso de ouro. Seu corpo está gritando "estou subindo!" antes da sua boca gritar de verdade. Se você agir agora, no amarelo, você não explode.

**O que fazer aqui:**
- **Nomeie em voz baixa:** "estou no amarelo". Só reconhecer já tira força do automático.
- **Respire soltando o ar mais devagar do que puxou.** Isso desliga o alarme do corpo. Três respirações assim mudam sua química.
- **Solte o corpo de propósito:** abra as mãos, desça os ombros, afrouxe a mandíbula. O corpo relaxado avisa o cérebro que não há perigo.
- **Se der, saia de perto por 30 segundos.** Um copo d'água na cozinha. Não é fugir — é ganhar tempo pra não estourar.

---

### 🔴 Nível Vermelho — A explosão bateu na porta

**Como o corpo está:**
- **Calor subindo pro rosto**, orelhas quentes.
- Coração disparado, respiração curta e ofegante.
- Aquela sensação de "vou explodir AGORA", visão como que estreitando.
- A vontade quase incontrolável de gritar, de descontar.

**O que isso significa:** você chegou no topo. Aqui, a parte pensante do cérebro fica meio "desligada" — por isso é tão difícil ser racional no vermelho. Não se cobre clareza neste ponto; cobre-se apenas **não piorar.**

**O que fazer aqui:**
- **Regra de ouro do vermelho: não decida nada, não eduque nada.** Só atravesse. Bronca no vermelho sempre sai maior do que você queria.
- **Se afaste fisicamente**, se for seguro. "Preciso de um minutinho." Ir pro banheiro, pra varanda, pra qualquer canto. Um minuto sozinha baixa a onda.
- **Coloque água fria no rosto ou nos pulsos.** O choque de temperatura ajuda o corpo a resetar de verdade.
- **Diga pra você mesma:** "isso vai passar em segundos". Porque vai. O pico do vermelho não dura muito — se você não jogar lenha com um grito.

---

## O treino é simples (e gentil)

Você não precisa acertar de primeira. Ninguém acerta.

Comece só **percebendo**. Durante uns dias, sem cobrar mudança nenhuma, só repare: "opa, meu peito apertou — isso é o amarelo". Só notar já é metade do caminho.

Com o tempo, seu corpo vira um radar. Você começa a sentir o amarelo cada vez mais cedo. E quanto mais cedo você percebe, mais fácil é não deixar virar vermelho.

---

## Uma última coisa, com carinho

Você vai chegar no vermelho de novo. Vai gritar de novo em algum dia difícil. Faz parte, e não apaga nada do que você é.

Escutar o corpo não é sobre nunca mais errar. É sobre se conhecer um pouquinho mais a cada dia, e ganhar, aos poucos, mais segundos de escolha.

E cada segundo de escolha que você ganha é um presente — pra você e pro seu filho, que aprende, te vendo, que a gente pode sentir a tempestade inteira e ainda assim escolher como responder.

---

*Imprima este termômetro e deixe num lugar visível. Com o tempo, você nem vai precisar dele: seu corpo vai virar o seu próprio alarme.*
$md$),
('mapa', 5, $t$Roteiro da Reparação$t$, $md$# O Roteiro da Reparação
### As palavras exatas pra dizer ao seu filho depois de gritar

---

Respira. Antes de qualquer coisa: se você está aqui, é porque você se importa.

Mãe que não liga não sente culpa. Mãe que não liga não vai atrás de aprender a consertar. Então esse aperto no peito que te trouxe até aqui? Ele é a prova do seu amor, não do seu fracasso.

Todo mundo grita. Todo mundo. A que diz que nunca gritou ou esqueceu, ou está mentindo. O que separa uma mãe da outra não é o grito — é o que vem **depois** dele.

E é sobre isso que a gente vai conversar agora.

---

## Por que o depois importa mais que o grito

Quando você grita, seu filho leva um susto. O corpinho dele entende: "o mundo ficou perigoso por um segundo". O coração dispara, ele se encolhe, às vezes chora, às vezes congela.

Mas olha uma coisa importante: **não é o susto que deixa marca. É o susto sem reparo.**

Quando você volta, se abaixa na altura dele e conserta, o cérebro da criança aprende algo lindo:

> "Quando a coisa aperta entre nós, a gente conserta. O amor não some. Ele volta."

Isso se chama vínculo. E o vínculo não é feito de dias perfeitos — é feito de rupturas que foram remendadas. Cada vez que você repara, você está costurando uma segurança dentro dele que vai durar a vida inteira.

A criança que cresce vendo a mãe pedir desculpa aprende três coisas que valem ouro:

- Que **errar é humano** e não o fim do mundo.
- Que **relações se consertam** — ela vai levar isso pro casamento, pras amizades, pra tudo.
- Que **ela merece respeito**, porque até a mãe se retrata com ela.

Então não, você não "estragou" seu filho quando gritou. Você só abriu uma ferida pequena. E agora vai aprender a fechá-la direitinho.

---

## A estrutura da reparação (4 passos)

Guarda esses quatro movimentos. Não precisa decorar frase — precisa entender o caminho. As palavras saem sozinhas quando você sabe onde quer chegar.

### 1. Reconhecer o que aconteceu
Sem rodeio, sem justificativa. Você nomeia o que houve.
*"Eu gritei com você agora há pouco."*

### 2. Nomear o sentimento (o dele e o seu)
Você mostra que enxerga como ele ficou — e assume o que passou por você.
*"Você deve ter ficado assustado. A mamãe estava cansada e perdeu a paciência."*

### 3. Reafirmar o amor
Essa é a parte que cura. Ele precisa ouvir que o amor não foi embora junto com o grito.
*"Mesmo quando eu fico brava, eu te amo. Isso não muda nunca."*

### 4. Combinar o próximo passo
Não é promessa de nunca mais errar (isso ninguém cumpre). É um combinado real e pequeno.
*"Da próxima vez que eu ficar assim, vou respirar antes de falar. E você pode me lembrar."*

---

### A REGRA DE OURO (leia duas vezes)

> **Nunca, jamais, use o "mas você também...".**

Nada de *"eu gritei, mas você também não me obedeceu"*. Nada de *"desculpa, mas se você tivesse parado quando eu pedi..."*.

No instante em que entra um "mas", a desculpa vira acusação. Você tira o peso das suas costas e coloca nos ombrinhos dele. A criança sai daquela conversa achando que a culpa do grito foi dela — e é exatamente isso que a gente **não** quer.

Reparar é assumir a **sua** parte. Só a sua. O comportamento dele você conversa depois, em outro momento, com calma. A desculpa é território sagrado: entra amor, não entra cobrança.

---

## 5 frases prontas pra usar

Escolha pela situação. Adapte pro seu jeito de falar — o importante é a alma da frase, não a palavra exata.

### 1. Pós-grito imediato (ainda quente)
> *"Ei... vem cá. A mamãe gritou e não foi legal. Você não merecia esse grito. Me desculpa. Eu te amo, tá?"*

Curta e direta. No calor do momento, menos é mais. Um abraço vale mais que um discurso.

---

### 2. Na hora de dormir (o reparo do fim do dia)
> *"Antes de você dormir, quero te falar uma coisa. Hoje mais cedo eu perdi a paciência e gritei. Eu pensei nisso o dia todo. Você é a coisa mais importante da minha vida. Amanhã é um dia novo pra gente. Bons sonhos, meu amor."*

A hora de dormir é mágica pra reparação. A criança vai dormir com a certeza de que é amada.

---

### 3. Criança que se fechou (não quer conversa nem abraço)
> *"Eu sei que você ficou chateado comigo, e você tem todo o direito. Não precisa falar nada agora. Eu só quero que você saiba que eu errei, e que eu vou estar aqui quando você quiser um colo. Sem pressa."*

Respeite o espaço. Forçar abraço é sobre você aliviar sua culpa — não sobre ele. Deixe a porta aberta e espere.

---

### 4. Criança pequena (2 a 4 anos)
> *"Mamãe falou alto e te assustou. Desculpa. Mamãe te ama muuuito."* — e abre os braços.

Com os pequenos, frase curtinha + tom suave + colo. Eles entendem muito mais pelo seu rosto e sua voz do que pelas palavras.

---

### 5. Criança maior (7 anos ou mais)
> *"Eu quero te pedir desculpa de verdade. Eu gritei com você e isso não foi justo, independente do que tinha acontecido. Gritar não é o jeito certo de resolver as coisas, e eu tô aprendendo isso junto com você. Você merece ser tratado com respeito. Me perdoa?"*

Com os maiores, dá pra ser mais honesta e até mostrar que você também está em construção. Isso ensina humildade — e aproxima demais.

---

## Uma última coisa, de mãe pra mãe

Existe um medo escondido que faz muita mãe travar na hora de pedir desculpa: *"se eu me retratar, ele vai perder o respeito por mim. Vai achar que pode tudo."*

É o contrário. É exatamente o contrário.

Autoridade não é feita de nunca errar. É feita de ser alguém em quem se pode confiar. E não existe confiança maior do que a de uma pessoa que sabe reconhecer quando passou do ponto.

Quando você pede desculpa, seu filho não pensa "a mamãe é fraca". Ele sente "a mamãe é justa. Eu posso confiar nela até quando ela erra."

Isso não enfraquece nada. Isso é a raiz mais funda do respeito.

Pedir desculpa não te tira do lugar de mãe. Te coloca no lugar de mãe em quem se pode confiar de olhos fechados.

E esse é o lugar mais poderoso do mundo.

---

*Você está fazendo um trabalho lindo. O simples fato de estar aqui já prova isso.*
$md$),
('mapa', 6, $t$Palavras que Curam × Palavras que Ferem$t$, $md$# Palavras que Ferem × Palavras que Curam
### Cole na parede da cozinha. Onde os 18h te encontram.

---

Todo mundo tem uma frase que escapa no impulso. Aquela que a gente aprendeu ouvindo, que sai da boca antes do pensamento chegar. Não é maldade — é piloto automático, cansaço, o dia inteiro pesando nos ombros.

A boa notícia? Frase é hábito. E hábito a gente troca.

Não precisa acertar de primeira. Só precisa ter a versão nova à mão pra quando a antiga vier na ponta da língua. Por isso essa folha existe: pra você bater o olho e lembrar que existe outro caminho.

---

| 🔴 Palavras que ferem | 🟢 Palavras que curam |
|---|---|
| "Para de chorar! Não é nada disso." | "Vem cá, me conta o que tá doendo." |
| "Você é muito difícil." | "Hoje tá sendo um dia difícil pra nós dois, né?" |
| "Olha o que você fez! De novo!" | "Aconteceu. Vamos ver como a gente resolve juntos." |
| "Você nunca me escuta." | "Preciso que você me olhe quando eu falo, tá bom?" |
| "Cala a boca!" | "Preciso de um minutinho de silêncio, pode me ajudar?" |
| "Você é chato demais." | "Você tá precisando de mais atenção agora, eu percebo." |
| "Se você fizer isso de novo, vai ver só." | "Quando você faz isso, machuca. Vamos combinar diferente." |
| "Por que você não é igual seu irmão?" | "Você é você, do seu jeitinho. E eu amo esse jeito." |
| "Você tá me deixando louca!" | "Eu tô ficando cansada e preciso de um tempinho." |
| "Não enche! Não tô a fim agora." | "Agora eu não consigo, mas às 8h eu sou toda sua." |
| "Deixa de ser bebê." | "Tá difícil pra você, e tudo bem sentir isso." |
| "Você é um problema." | "Você tá com um problema, e eu tô aqui pra te ajudar." |
| "Já falei mil vezes!" | "Vou explicar mais uma vez, com calma." |
| "Você me tira do sério!" | "Eu tô no meu limite, vou respirar e já volto." |
| "Que criança mal-educada." | "Esse jeito de falar não pode. Vamos tentar de outro jeito." |

---

### Um lembrete gentil, pra você guardar no coração

Você vai olhar essa tabela e, em algum dia corrido, vai dizer a frase da esquerda mesmo assim. Vai acontecer. E tá tudo bem.

Isso não te faz uma mãe ruim. Te faz uma mãe humana, cansada, fazendo o melhor que consegue com a energia que sobrou do dia.

O objetivo aqui nunca foi ser perfeita. É só ter, cada vez mais, a coluna da direita na ponta da língua. Uma frase por vez. Um dia por vez.

E quando escapar a da esquerda? Você já sabe o que fazer: se abaixa, olha nos olhos, e repara. O amor sempre volta.

---

*Você já é boa o suficiente. Essa folha só te dá mais uma ferramenta.*
$md$),
('mapa', 7, $t$A Regra dos 3 Passos$t$, $md$# A Regra dos 3 Passos
### Respirar · Notar · Escolher — 20 segundos que mudam tudo

---

São 18h. A casa tá uma bagunça, o jantar não fez, alguém tá chorando, e você sente aquela onda quente subindo do peito pra garganta. Você conhece essa onda. Ela vem antes do grito.

A boa notícia é que existe uma brecha ali. Um espacinho de segundos entre o gatilho e a explosão. E é nesse espacinho que mora a sua escolha.

A Regra dos 3 Passos cabe dentro dessa brecha. Ela não vai te transformar numa santa da paciência — vai só te dar 20 segundos pra sair do piloto automático e voltar pro comando. E, muitas vezes, 20 segundos é tudo que você precisa.

---

## Passo 1 — RESPIRAR 🫁

**O que fazer:** puxe o ar pelo nariz contando até 4, segure por 2, e solte pela boca contando até 6. Uma vez. Se der, duas.

**Como:** solte os ombros, desencaixe a mandíbula, deixe os braços caírem. Seu corpo tá em posição de ataque sem você perceber — a respiração longa avisa o cérebro que não tem leão nenhum na sala.

**Por quê:** quando a raiva sobe, seu corpo entra em modo alarme e a parte racional do cérebro literalmente sai do ar. A expiração longa é o botão de desligar esse alarme. Não é frescura — é biologia. Você não consegue pensar direito antes de respirar direito.

---

## Passo 2 — NOTAR 👀

**O que fazer:** por dois segundos, olhe pra dentro e pra fora. O que eu tô sentindo, de verdade? E o que o meu filho tá sentindo?

**Como:** dê nome ao que tá acontecendo em você. *"Eu não tô com raiva dele. Eu tô exausta, com fome, e no meu limite."* E olhe pra criança: *"Ele não tá me desafiando. Ele tá cansado e não sabe pedir ajuda."*

**Por quê:** na maioria das vezes, o grito não é sobre o que a criança fez. É sobre a soma do seu dia. Quando você nota isso, o filho deixa de ser o inimigo e vira o que ele é: uma criança perdida precisando de você. Notar tira o dedo do gatilho.

---

## Passo 3 — ESCOLHER ✅

**O que fazer:** decida a sua próxima frase antes de dizê-la. Uma frase, de propósito, no lugar da que ia sair sozinha.

**Como:** pergunte a si mesma: *"O que essa criança precisa ouvir agora pra gente sair dessa juntos?"* Pode ser um abaixar na altura dela, um *"vem cá"*, um *"me ajuda aqui"*, ou até um honesto *"a mamãe precisa de um minuto"*.

**Por quê:** entre o que acontece e como você reage, existe um espaço. Nesse espaço mora a sua liberdade. Reagir é automático — qualquer um faz. Escolher é seu poder de mãe. E toda vez que você escolhe, você fica mais forte nisso.

---

Não vai sair perfeito toda vez. Tem dia que você vai lembrar dos 3 passos só depois de já ter gritado. Tudo bem — aí você usa o Roteiro da Reparação e conserta. Aos poucos, os 20 segundos viram hábito, e o hábito vira o seu novo jeito.

---
---

## ✂️ ------------------------ recorte aqui ------------------------ ✂️

### 🃏 CARTÃO DE BOLSO — A Regra dos 3 Passos

*(recorte e guarde na carteira, na geladeira ou no espelho do banheiro)*

**Quando a onda subir, antes de gritar:**

**1. 🫁 RESPIRAR** — puxa o ar até 4, solta até 6. Ombros pra baixo.

**2. 👀 NOTAR** — o que EU sinto? O que ELE sente? (Cansaço, não guerra.)

**3. ✅ ESCOLHER** — qual a minha próxima frase? Escolho de propósito.

> *20 segundos entre a raiva e a reação. Nesse espaço, eu decido.*

---
$md$),
('kit-de-bolso', 1, $t$Geladeira Calma$t$, $md$# Cola da Geladeira: 3 Frases que Param a Birra
### Prende com um ímã. Respira. Usa quando o mundo tá desabando (o dela e o seu).

---

Quando a birra chega, o corpo da criança tá em tempestade. Ela não tá te desafiando — ela tá **sem controle** e assustada com o próprio tamanho do sentimento. Nessa hora, ela não escuta lição. Ela escuta **conexão**.

Antes de resolver qualquer coisa, a gente valida o que ela sente. Sentimento validado é sentimento que começa a baixar.

O segredo não é a frase perfeita. É o **tom** e o **corpo**:

- **Agacha** na altura dos olhos dela. Sai da posição de "gigante que manda".
- **Voz baixa e devagar.** Quanto mais alto ela grita, mais baixo você fala.
- **Mãos calmas.** Um toque leve no braço, se ela deixar.

---

## As 3 frases

> ## 1. "Eu tô aqui com você."
> *Ela precisa saber que não vai ser abandonada no meio do caos. Presença acalma mais que palavra.*

<br>

> ## 2. "Pode ficar bravo. Eu seguro isso com você."
> *Você dá permissão pro sentimento existir — sem deixar o comportamento sair do controle. Bravo pode. Bater, não.*

<br>

> ## 3. "Que coisa difícil, né? Tô vendo."
> *Nomear a dor dela mostra que você entendeu. Criança entendida para de precisar gritar pra ser ouvida.*

---

## Por que funcionam

Toda birra tem uma pergunta escondida embaixo: *"Você ainda me ama assim, do meu pior jeito?"*

Essas frases respondem **sim** antes mesmo da criança perguntar. Elas não discutem, não ameaçam, não prometem. Só dizem: *eu não vou embora, e o que você sente não me assusta.*

Quando a tempestade passa (e passa), **aí sim** vocês conversam sobre o que aconteceu. No calor, não. No calor, só presença.

---

*Você não precisa acertar a frase. Precisa só ficar. Ficar já é quase tudo.* 💛
$md$),
('kit-de-bolso', 2, $t$Cartas de Perdão$t$, $md$# Cartas de Perdão
### O que dizer depois do grito. Porque a reparação ensina mais que o erro machuca.

---

Você gritou. Se arrependeu. E agora tá com aquele nó no peito, achando que estragou tudo. Respira: **você não estragou.**

O que marca uma criança não é o erro da mãe — é o erro que nunca vira conversa. Quando você volta, olha nos olhos e repara, você ensina a coisa mais valiosa do mundo: *que amar é também saber pedir desculpa.*

Estas cartas são pra ler em voz alta pro seu filho, ou pra guardar num caderninho. Do jeito que doer menos.

---

## A regra de ouro

Um pedido de desculpa de verdade **nunca** tem "mas".

- "Desculpa por ter gritado, **mas você também** não me obedeceu." → isso não é desculpa, é acusação disfarçada.
- "Desculpa por ter gritado. Foi demais. Você não merecia." → **isso** é reparação.

A responsabilidade pelo grito é sua. A criança não precisa carregar metade dela.

---

## Modelos para criança pequena (2 a 5 anos)
*Frases curtas, concretas, ditas com o corpo baixinho, olho no olho.*

**Modelo 1**
> "Filho, a mamãe gritou. Foi feio e te assustou. A culpa não foi sua. Eu te amo, e vou tentar de novo com mais calma. Vem cá pro colo?"

**Modelo 2**
> "Eu fiquei muito brava e falei alto. Isso deixou você com medo, né? Desculpa. Você é bom. A mamãe que precisou respirar melhor."

---

## Modelos para criança maior (6 a 11 anos)
*Pode ser lida ou entregue escrita. Eles guardam essas palavras por anos.*

**Modelo 1**
> "Oi, meu amor. Hoje eu perdi a paciência e gritei com você. Eu tava cansada, mas isso não é desculpa pra te tratar assim. Você não fez nada que merecesse aquele tom. Eu te amo do mesmo tamanho quando você acerta e quando erra. Vou trabalhar pra me controlar melhor. Me perdoa?"

**Modelo 2**
> "Filho, fiquei pensando no que aconteceu mais cedo. Aquele grito foi meu, do meu cansaço — não seu. Eu sinto muito. Você tem todo o direito de ficar chateado comigo. Quando quiser conversar, eu tô aqui. Sempre vou estar."

---

## Agora escreva a sua

Nenhum modelo vai soar tão verdadeiro quanto o seu. Use estes começos e complete com o que é seu:

- *"Meu amor, hoje eu ________. Eu sinto muito por ________."*
- *"A culpa não foi sua. A verdade é que eu ________."*
- *"Uma coisa que eu quero que você nunca esqueça é ________."*

Não precisa ser bonito. Precisa ser verdadeiro.

---

*Reparar não apaga o grito. Mas ensina que depois da tempestade sempre vem o abraço. E é isso que fica.* 💛
$md$),
('kit-de-bolso', 3, $t$O Frasco da Calma$t$, $md$# O Frasco da Calma
### Um potinho mágico pra vocês dois respirarem juntos

---

Tem dias em que a birra chega antes da gente conseguir pensar. A criança grita, você sente o corpo esquentar, e parece que não existe botão de pausa.

O Frasco da Calma é esse botão.

É um pote com água e glitter que, quando chacoalhado, vira uma tempestade brilhante — e devagarzinho, o glitter vai assentando no fundo. Enquanto a criança olha o brilho descer, a respiração dela desacelera junto. E a sua também.

O melhor: vocês fazem juntos. Vira um momento de conexão antes mesmo de virar ferramenta.

---

## O que você vai precisar

- 1 pote ou garrafa de plástico transparente com tampa que feche bem (pote de vidro só se a criança for maior e com você por perto)
- Água morna (quase enchendo o pote)
- 1 a 2 colheres de sopa de glitter fino (ou purpurina)
- Cola glitter ou glicerina líquida (ajuda o brilho a descer mais devagar) — opcional
- Corante de alimentos ou um pouquinho de tinta guache (opcional, pra dar cor)
- Cola quente ou fita adesiva forte pra lacrar a tampa

---

## Modo de fazer (com a criança do lado)

1. **Encham o pote com água morna**, deixando um dedo de espaço no topo.
2. **Coloquem o glitter** — deixe a criança despejar. Ela vai amar.
3. **Adicionem a cola glitter ou glicerina** e mexam bem. Quanto mais cola, mais devagar o glitter desce.
4. **Pinguem o corante**, se quiserem cor. Uma ou duas gotas bastam.
5. **Fechem bem a tampa** e lacrem com cola quente ou fita (pra não vazar nas mãozinhas curiosas).
6. **Chacoalhem juntos** e observem a mágica.

> Dica: faça um teste antes. Se o glitter descer rápido demais, abra e adicione mais cola. Se descer devagar demais, adicione um pouco de água.

---

## Como usar no momento da birra

Não espere o pico pra apresentar o frasco. Mostre num momento calmo, brincando, pra virar algo familiar e gostoso.

Na hora da crise:

- **Ofereça sem exigir:** "Que tal a gente chacoalhar o frasco juntos?"
- **Chacoalhe você também.** A criança te imita. Se você respira fundo olhando o brilho, ela vai junto.
- **Combinem uma regrinha:** "Enquanto o glitter não descer todo, a gente só respira." Sem cobrança, sem lição no meio.
- **Quando assentar, o corpo assenta.** Aí sim vocês conversam, se for preciso.

O frasco não resolve tudo. Mas ele compra aqueles segundos preciosos entre o "quero explodir" e o "consigo pensar". Pra ela e pra você.

---

## Rótulos pra imprimir e colar

Recorte e cole no seu frasco. Escolha o que mais combina com vocês.

---

> ### ✨ Frasco da Calma
> *Chacoalha, respira e espera o brilho descer.*

---

> ### 🌬️ Respira Comigo
> *Enquanto o glitter dança, a gente se acalma.*

---

> ### 💙 Meu Potinho de Paz
> *Quando eu chacoalho, a tempestade passa.*

---

> ### 🌟 Tempestade que Passa
> *Toda tempestade tem fim. Essa também.*

---

> ### 🫧 Devagar, Devagarinho
> *O brilho desce no tempo dele. Eu também posso.*

---

Um pote simples. Mas dentro dele cabe um recado enorme: **toda tempestade assenta. A sua também vai passar.**
$md$),
('sos-hora-de-dormir', 1, $t$SOS Hora de Dormir$t$, $md$# SOS Hora de Dormir
### Um roteiro pra transformar a guerra da cama em um dos momentos mais gostosos do dia.

---

O fim do dia é traiçoeiro. Você tá esgotada, ele tá elétrico, e às 20h qualquer coisinha vira estopim. A hora de dormir não precisa ser batalha — mas ela pede **previsibilidade**. Criança que sabe o que vem a seguir se sente segura, e criança segura relaxa.

A rotina abaixo não é sobre pressa. É sobre **desacelerar juntos**.

---

## O roteiro (mais ou menos 30 minutos)

**1. Aviso gentil (uns 15 min antes)**
> "Daqui a pouquinho é hora de guardar os brinquedos e ir pro banho. Última brincadeira agora."

Nada de puxar do nada. Aviso evita o susto — e o susto vira birra.

**2. Banho morno e luz baixa**
Vá apagando as luzes da casa. O corpo entende: *o dia tá acabando.* Diminua o volume da sua própria voz também.

**3. Pijama + um copo d'água + xixi**
Resolva as "desculpas clássicas" antes que virem estratégia de adiar.

**4. Dois livros (nem mais, nem menos)**
Combine o número antes. Assim não vira negociação infinita.

**5. Uma frase de fechamento, sempre a mesma**
> "Hoje foi um dia. Amanhã tem outro. Eu te amo do tamanho do céu."

Repetir a mesma frase toda noite vira âncora de segurança.

**6. O áudio de ninar (abaixo)**
Se a noite tá difícil, coloque a locução. Sua voz cansada não precisa dar conta de tudo.

---

## Script de Áudio de Ninar
*Para gravar com sua própria voz — calma, baixinha, devagar. Cerca de 60 segundos.*

---

Agora é hora de descansar. [pausa]

Seu corpinho fez tanta coisa hoje... suas perninhas correram, suas mãozinhas brincaram, seus olhos viram o mundo inteiro. [pausa]

Agora eles podem descansar. [pausa longa]

Solta os ombrinhos. [pausa] Solta as perninhas. [pausa] Deixa o corpo ficar pesado e mole, afundando na cama macia. [pausa]

Você tá seguro. [pausa] A casa tá quietinha. A porta tá fechada. E eu tô pertinho, do outro lado. [pausa longa]

Respira fundo comigo... [pausa] devagarzinho pra dentro... [pausa] e solta. [pausa]

Mais uma vez. Pra dentro... [pausa] e solta. [pausa longa]

Não precisa fazer nada agora. Só descansar. [pausa]

O sono tá chegando, macio como um cobertor. [pausa] Deixa ele te abraçar. [pausa longa]

Eu te amo. [pausa] Bons sonhos, meu amor. [pausa]

Boa noite. [pausa longa]

---

*Se a noite virou choro e cansaço, tudo bem. Amanhã tem outra. Você tá fazendo bonito.* 💛
$md$),
('teste-do-pai', 1, $t$O Teste do Pai$t$, $md$# O Teste do Pai
### O mesmo mapa, agora pra ele. Porque criar filho é jogo de dois — e ninguém devia jogar sozinho.

---

Talvez você tenha feito seu mapa e pensado: *"queria tanto que ele entendesse o que eu sinto."* Esse material é pra isso. Não pra provar que você faz mais (mesmo que faça). É pra abrir uma conversa que une, em vez de mais uma que termina em porta batida.

A ideia é simples: ele responde um mini-teste sobre a rotina dele com o filho. Depois vocês comparam — **com curiosidade, não com placar.**

---

## Mini-teste (pra ele responder sozinho, sem pressa)

Responda de 1 a 5, sendo **1 = quase nunca** e **5 = quase sempre**:

**1.** Eu sei de cabeça a rotina do nosso filho (horário de comer, dormir, o que ele gosta). `___`

**2.** No fim do dia, eu tenho paciência — ou chego já no limite? `___`

**3.** Quando ele tem uma birra, eu sei o que fazer sem perder a cabeça. `___`

**4.** Eu percebo quando a mãe dele tá sobrecarregada, antes dela pedir. `___`

**5.** Eu assumo tarefas sozinho, sem precisar que "mandem" (banho, dormir, escola). `___`

**6.** Nos últimos dias, eu parei pra brincar sem pressa, só de bobeira, com ele. `___`

*Não existe nota boa ou ruim. Existe um retrato de agora — e retrato a gente pode mudar.*

---

## Como comparar sem virar briga

**Escolha a hora certa.** Nunca durante ou logo depois de um estresse. Espere um momento neutro — um café no fim de semana, o carro parado num trânsito.

**Comece por você, não por ele.**
> "Eu fiz um teste desses e me assustei com umas respostas minhas. Queria te mostrar. Você toparia fazer também, pra gente comparar?"

**Fale do time, não do juiz.**
A frase que salva conversas:
> "Não é você contra mim. É a gente contra o cansaço."

**Troque acusação por pedido concreto.**

| Em vez de... | Tente... |
|---|---|
| "Você nunca ajuda." | "Eu preciso que a hora do banho seja sua, fixa, sem eu pedir." |
| "Você não liga pra rotina." | "Me ajuda a decorar os horários com ele? Assim divide o peso na minha cabeça." |
| "Eu faço tudo sozinha." | "Tem uma coisa que tá me esmagando. Posso te passar uma parte?" |

**Fecha combinando UMA coisa só.** Não tente resolver o casamento inteiro numa conversa. Escolham **uma** tarefa pra ele assumir por completo essa semana. Uma que seja dele de verdade — do começo ao fim, sem você supervisionando.

---

## O que dividir a carga muda

Quando a carga é dividida, o grito diminui — porque metade do grito nasce do esgotamento de fazer tudo sozinha. Você não tá pedindo ajuda com o filho **dele**. Vocês tão dividindo uma vida que é dos dois.

---

*Vocês estão do mesmo lado. Às vezes só falta parar, respirar, e lembrar disso juntos.* 💛
$md$),
('completo', 1, $t$Programa — Visão Geral dos 21 Dias$t$, $md$# O Ninho Completo

### O seu mapa de 21 dias para sair do ciclo do grito e reconstruir a conexão com o seu filho

---

Respira fundo. Você chegou aqui.

Se você está lendo isto, é porque decidiu que não quer mais viver no piloto automático do grito — aquela roda que gira sozinha: você explode, se culpa, jura que amanhã vai ser diferente, e no dia seguinte, lá pelas 18h, tudo se repete.

Eu conheço essa roda. Muita mãe conhece. E a boa notícia é simples: **ela não gira por acaso, e por isso ela pode parar.**

O Ninho Completo não é um curso pra te ensinar a ser uma "mãe perfeita" — isso não existe e nem é o que o seu filho precisa. É um caminho de 21 dias, um passo de cada vez, pra você entender o que dispara os seus gritos, aprender a se desarmar no calor do momento, reparar o que já doeu e construir uma rotina onde a conexão vira o normal — não a exceção.

Não é sobre nunca mais perder a paciência. É sobre a paciência voltar mais rápido. É sobre o seu filho gravar, dentro dele, uma mãe que erra, se recompõe e volta com amor.

Este documento é o **mapa do programa**. Aqui você enxerga o caminho inteiro antes de começar a andar. Guarde ele por perto.

---

## Como o programa funciona

São **21 dias de vídeos curtos** (a maioria com menos de 10 minutos), pensados pra caber na sua vida real — assiste no ônibus, na fila da escola, com o café esfriando.

Cada dia tem:

- Um **vídeo** com uma ideia central, contada de forma simples.
- Uma **prática do dia** — pequena, concreta, pra fazer ainda hoje.
- Um **check-in** rápido que alimenta o seu Score de Conexão (você entende ele lá no fim deste mapa).

Os 21 dias são organizados em **3 semanas**, cada uma com um propósito claro. Você não precisa acertar tudo. Só precisa aparecer.

---

## Semana 1 — Enxergar o padrão

*Antes de mudar qualquer coisa, a gente precisa enxergar. Esta semana é sobre acender a luz — sem julgamento — no ciclo que hoje roda no escuro.*

---

### Dia 1 — O ciclo do grito tem nome
**Objetivo:** Reconhecer as quatro fases do ciclo (explode → se culpa → jura mudar → repete) e entender que ele é um padrão previsível, não um defeito seu.

### Dia 2 — O seu pavio não é fraqueza
**Objetivo:** Perceber que o grito quase nunca é sobre o que a criança fez, e sim sobre o que estava acumulado em você antes.

### Dia 3 — O mapa das 18h
**Objetivo:** Identificar os seus horários e situações de pico — a famosa "hora do lobo" do fim da tarde — pra parar de ser pega de surpresa.

### Dia 4 — Os seus três gatilhos
**Objetivo:** Nomear os disparadores mais frequentes (barulho, pressa, desobediência, cansaço) e entender qual é o seu principal.

### Dia 5 — O corpo avisa antes
**Objetivo:** Aprender a ler os primeiros sinais físicos da explosão (mandíbula travada, ombros duros, calor no peito) que aparecem segundos antes do grito.

### Dia 6 — O que o seu filho realmente grava
**Objetivo:** Compreender que a criança guarda o ciclo inteiro — inclusive a reparação — e não cada grito isolado como cicatriz.

### Dia 7 — Foto do ponto de partida
**Objetivo:** Fazer um retrato honesto e gentil de onde você está hoje, pra ter de onde comparar lá na frente. Sem cobrança, só clareza.

---

## Semana 2 — Desarmar no calor do momento

*Enxergar já muda muita coisa. Mas o ouro está aqui: aprender o que fazer nos segundos em que a raiva sobe. Esta semana é treino prático pra desarmar a bomba antes dela explodir.*

---

### Dia 8 — A pausa de 3 segundos
**Objetivo:** Instalar o primeiro freio — uma pausa mínima entre o gatilho e a reação — e treinar ela em situações pequenas.

### Dia 9 — Respirar pra baixar o corpo
**Objetivo:** Usar uma respiração simples (expiração longa) pra tirar o corpo do modo alarme em menos de um minuto.

### Dia 10 — A frase-âncora
**Objetivo:** Criar uma frase curta e sua pra repetir no pico ("ela é criança, eu sou o adulto") que te traz de volta pra si mesma.

### Dia 11 — Sair da cena sem abandonar
**Objetivo:** Aprender a se afastar por alguns segundos pra se regular, avisando a criança, sem que isso vire punição ou fuga.

### Dia 12 — Baixar a voz em vez de subir
**Objetivo:** Trocar o grito por um tom mais baixo e firme, e perceber como o volume da criança acompanha o seu.

### Dia 13 — O não que não vira guerra
**Objetivo:** Sustentar limites com firmeza e afeto ao mesmo tempo, sem entrar na disputa de força que alimenta a birra.

### Dia 14 — Quando você não conseguir
**Objetivo:** Ter um plano pros dias em que a pausa falha — porque vão existir — sem despencar de volta na culpa paralisante.

---

## Semana 3 — Reconstruir o vínculo

*Desarmar o grito abre espaço. Agora a gente preenche esse espaço com conexão de verdade — reparando o que doeu e criando os pequenos hábitos que sustentam o vínculo no dia a dia.*

---

### Dia 15 — A arte de reparar
**Objetivo:** Aprender a pedir desculpas pro filho de um jeito que ensina, sem se rebaixar, transformando o erro em vínculo.

### Dia 16 — Os 10 minutos que mudam o dia
**Objetivo:** Reservar um tempo curto e diário de atenção plena, guiada pela criança, que enche o "tanque emocional" dela.

### Dia 17 — Reconectar antes de corrigir
**Objetivo:** Entender por que a conexão precisa vir antes da correção pra criança conseguir realmente ouvir você.

### Dia 18 — O ritual de fim de tarde
**Objetivo:** Montar uma pequena rotina pra atravessar a hora de pico das 18h com mais previsibilidade e menos atrito.

### Dia 19 — A rotina que previne o grito
**Objetivo:** Ajustar os pontos de fricção do dia (sono, fome, pressa) que enchem o seu pavio antes mesmo da criança aparecer.

### Dia 20 — Cuidar de quem cuida
**Objetivo:** Reconhecer que a sua regulação depende do seu descanso, e criar micro-espaços de cuidado com você mesma sem culpa.

### Dia 21 — O novo normal
**Objetivo:** Consolidar tudo num plano simples e sustentável, celebrar o caminho andado e transformar as práticas em hábito de vida.

---

## Biblioteca de Roteiros de Crise

Nem toda tempestade avisa. Por isso o programa vem com uma **biblioteca de roteiros de emergência** — passo a passo curtos, por situação, pra você abrir no celular *no meio do caos* e saber exatamente o que fazer e o que dizer.

Não é teoria. É pra usar de olho molhado, criança gritando, você sem chão.

- **Birra em público** — o que fazer quando a explosão acontece no mercado, na rua, com todo mundo olhando.
- **Hora de dormir vira batalha** — desarmar a resistência do sono sem transformar a noite em guerra.
- **A briga das telas** — como tirar o tablet ou desligar a TV sem o mundo desabar.
- **Manhã corrida** — atravessar o "vamos que estamos atrasados" sem começar o dia gritando.
- **"Eu te odeio, mãe!"** — o que responder quando a frase que dói mais sai da boca dele.
- **Ciúme de irmão** — acolher o que a criança sente quando o outro chega ou recebe atenção.
- **A guerra do dever de casa** — sair do lugar de fiscal e virar aliada na hora da lição.
- **Recusa de comida** — sobreviver ao "não quero" à mesa sem transformar a refeição em chantagem.
- **Desfralde e escapes** — atravessar acidentes e recuos com paciência, sem envergonhar.
- **A separação na porta da escola** — lidar com o choro do "não vai, mamãe" sem carregar culpa o dia todo.
- **O choro que não para** — quando você já tentou tudo e a criança continua desabando.
- **Agressão física (bateu, mordeu, chutou)** — pôr o limite com firmeza e afeto quando ela machuca.
- **Você perdeu a paciência de novo** — o roteiro da reparação pra depois que o grito já saiu.
- **Fim de tarde impossível** — o socorro específico pra hora de pico, quando o cansaço de todo mundo bate junto.

Você não precisa decorar nenhum deles. Estão sempre ali, a um toque de distância.

---

## O seu Score de Conexão

Todo caminho fica mais fácil quando a gente enxerga o progresso. Só que conexão com filho não aparece na balança nem no boletim. Então a gente criou uma forma de tornar visível o que costuma ser invisível: o **Score de Conexão**.

### O que é

É uma pontuação de **0 a 100** que funciona como uma **bússola** — não como uma nota. Ela reflete os pequenos hábitos da sua rotina que, juntos, fortalecem o vínculo com o seu filho: momentos de atenção plena, reparações depois dos atritos, pausas antes do grito, rituais de fim de tarde, cuidado com você mesma.

Ela não mede se você é uma boa mãe. Isso não se mede — e você já é. Ela mede **movimento**: pra onde a sua rotina está indo.

### Como ela evolui

Todo dia, no seu check-in rápido, você marca as pequenas coisas que fez. Cada hábito soma. O Score sobe devagar, do jeito que mudança real acontece — não em saltos mágicos, mas em passos que se somam.

Nos primeiros dias, ele costuma ficar baixo, e tudo bem: esse é o seu ponto de partida, a foto do Dia 7. Conforme você pratica as pausas, os 10 minutos, as reparações e os rituais, os pontos vão subindo — e você vê, preto no branco, que o esforço está virando resultado.

Vai ter dia de o Score cair. Vai ter recaída. Isso faz parte e **não apaga** o que você construiu. A linha que importa não é a de um dia — é a dos 21.

### O que você faz pra subir os pontos

- **Aparecer no check-in** todo dia, mesmo nos dias difíceis.
- **Praticar a pausa** antes de reagir — cada vez que você segura o grito, conta.
- **Reparar** depois dos atritos, se abaixando na altura dele.
- **Garantir os 10 minutos** diários de atenção só dele.
- **Cuidar de você** — porque mãe descansada regula melhor.

O objetivo nunca foi chegar a um número. O número é só o retrato do caminho. O que fica de verdade é a mãe que você está se tornando ao longo dele.

---

## Bem-vinda ao Ninho

Você não precisa fazer isso perfeito. Você só precisa começar.

A partir de agora, você não está mais sozinha girando aquela roda no escuro. Você tem um mapa, tem roteiros pra hora do caos e tem uma bússola pra enxergar o quanto já andou.

Vai um dia de cada vez. Tem dia que vai brilhar, tem dia que vai desandar — e os dois fazem parte. O que importa é que, ao longo destes 21 dias, você vai descobrir uma coisa que sempre esteve aí: o vínculo com o seu filho é mais forte do que qualquer grito.

Seja muito bem-vinda. O ninho estava esperando por você.

Com carinho,
**Equipe O Ninho**
$md$),
('completo', 2, $t$21 Dias Sem Grito$t$, $md$# Desafio 21 Dias Sem Grito
### Não é sobre ser perfeita. É sobre se enxergar com carinho.

---

Antes de começar, respira e lê isso comigo:

Esse desafio **não é uma prova**. Você não vai tirar nota, ninguém vai te avaliar, e não existe reprovação.

A ideia não é nunca mais levantar a voz — isso seria uma promessa injusta com você. A ideia é **acender uma luz de consciência**: perceber quando o grito vem, o que ele avisa, e o que você pode fazer diferente na próxima.

Se num dia você explodir, não rasgue o desafio. **Recomeçar não é falhar.** É exatamente o que a gente ensina pros nossos filhos: caiu, levanta, tenta de novo. Você merece a mesma gentileza.

Marque o ✅ nos dias que der. Deixe em branco os que não deram. Tudo bem. O que importa é continuar olhando.

---

## Como funciona

Cada dia traz uma **micro-meta** ou uma **reflexão** — algo pequeno, que cabe num dia corrido. Não precisa fazer tudo perfeito. Basta prestar atenção.

Leia a meta de manhã. Viva o dia. À noite, marque se conseguiu se observar.

---

## Seu Checklist de 21 Dias

| Dia | Micro-meta / Reflexão | ✅ |
|:---:|:---|:---:|
| 1 | Só observe: a que horas o grito costuma vir hoje? Anote na cabeça. | ☐ |
| 2 | Perceba o sinal no seu corpo antes de explodir (mandíbula, ombros, respiração). | ☐ |
| 3 | Hoje, antes de responder, respire fundo UMA vez. Só uma. | ☐ |
| 4 | Repare no que vem logo antes da birra dela. Fome? Sono? Cansaço? | ☐ |
| 5 | Diga em voz baixa: "Estou ficando brava" — nomear já muda o corpo. | ☐ |
| 6 | Beba um copo de água quando sentir a raiva subir. Ganhe 10 segundos. | ☐ |
| 7 | Primeira semana! Olhe pra trás com carinho, não com cobrança. | ☐ |
| 8 | Hoje, agache na altura dela pra falar em vez de gritar de longe. | ☐ |
| 9 | Troque um "para com isso!" por "me conta o que está acontecendo". | ☐ |
| 10 | Perceba o horário de pico (o famoso caos das 18h) e prepare-se antes. | ☐ |
| 11 | Se explodir hoje, pratique o pedido de desculpas. Também é ensino. | ☐ |
| 12 | Faça uma pausa de 2 minutos só sua durante o dia. Sem culpa. | ☐ |
| 13 | Observe: o grito resolveu ou só descarregou? Sem julgamento. | ☐ |
| 14 | Duas semanas. Escolha uma vitória pequena e comemore por dentro. | ☐ |
| 15 | Hoje, antes das 18h, coma algo e beba água. Mãe com fome grita mais. | ☐ |
| 16 | Use o toque em vez da voz: uma mão no ombro dela pode acalmar os dois. | ☐ |
| 17 | Repare quando você conseguiu NÃO gritar. Anote pra lembrar. | ☐ |
| 18 | Baixe o tom de propósito. Sussurrar às vezes chama mais atenção. | ☐ |
| 19 | Perdoe o dia de ontem, seja lá como foi. Hoje é página nova. | ☐ |
| 20 | Note como VOCÊ se sente nos dias mais calmos. Guarde essa sensação. | ☐ |
| 21 | Último dia. Escreva uma frase gentil pra você mesma. Você merece. | ☐ |

---

## Chegou ao dia 21? E se não chegou?

Se você marcou todos os dias — que orgulho. Se marcou metade — que orgulho igual. Se olhou pra esse checklist e apenas começou a **perceber** os próprios gritos, você já mudou alguma coisa importante.

O grito não some da noite pro dia. Mas a consciência que você plantou nesses dias fica. Ela vai continuar trabalhando por dentro, mesmo nos dias em que você achar que falhou.

Você não está tentando ser uma mãe perfeita. Está tentando ser uma mãe presente. E olha só: **você tentou.** Isso já diz tudo sobre o amor que você tem aí dentro.

Amanhã sempre tem um dia 1 de novo. E você pode recomeçar quantas vezes precisar. 💙
$md$),
('completo', 3, $t$Birra no Mercado$t$, $md$# Birra no Mercado
### Abra em caso de emergência: quando a crise é em público e todo mundo olha

---

Você conhece a cena. A fila do caixa, o corredor de doces, a festa cheia de gente. E de repente: o choro, o grito, o corpo jogado no chão.

E junto com a birra vem aquilo que aperta ainda mais — **os olhares.** A vergonha. Aquela sensação de que estão te julgando, achando que você não sabe educar seu filho.

Respira. Você não está sozinha nessa, e não, você não é uma mãe ruim. Toda mãe já passou por isso. Aqui vai o que fazer no calor do momento.

---

## Primeiro: cuide de VOCÊ em 5 segundos

Antes de agir, ancore-se. A criança sente se você está em pânico.

- **Respire fundo uma vez.** Solte o ar devagar pela boca.
- **Sinta os pés no chão.** Você está firme.
- **Diga pra si mesma:** "Isso vai passar. Eu dou conta."

A birra dela é da idade. A vergonha é sua pra cuidar — e ela não manda em você.

---

## Depois: o passo a passo da crise

**1. Abaixe-se na altura dela.**
Sair de cima muda tudo. Você deixa de ser uma torre que grita e vira um porto seguro.

**2. Fale baixo e devagar.**
Quanto mais alto ela grita, mais baixo você fala. Isso obriga o ouvido (e o corpo) dela a desacelerar pra te escutar.

**3. Nomeie o que ela sente.**
"Você queria muito aquilo e não pode. Você está com muita raiva. Eu entendo."
Não é ceder. É mostrar que você viu a dor dela.

**4. Não negocie no auge.**
No pico do choro, o cérebro dela não escuta razão. Não é hora de explicar nem de dar sermão. É hora de estar junto e esperar.

**5. Se puder, mude de ambiente.**
Pegue no colo ou pela mão e saia pra um canto mais calmo — a saída da loja, um corredor vazio. Menos plateia, menos estímulo, menos tudo.

---

## Frases prontas pra usar

Guarde essas no bolso. No aperto, elas saem sozinhas:

- *"Eu sei, meu amor. Você está muito bravo. Eu estou aqui."*
- *"Pode chorar. Eu vou ficar do seu lado até passar."*
- *"A gente não vai levar hoje. E tudo bem sentir raiva disso."*
- *"Respira comigo. Devagarinho. Eu seguro sua mão."*

---

## E os olhares dos outros?

Aqui vai a verdade que liberta: **a opinião de estranhos não paga suas contas, não te conhece e não vai dormir na sua casa hoje.**

- Quem já foi mãe ou pai está torcendo por você, não te julgando.
- Quem julga esqueceu como é — o problema é dele, não seu.
- Você não precisa dar satisfação, nem "provar" que educa bem apagando a birra rápido.

Se alguém encarar, você pode simplesmente respirar e voltar o foco pro seu filho. Um sorriso cansado e um *"criança é assim mesmo"* resolvem — se você quiser dizer algo.

---

## Depois que passa

Quando a tempestade assentar, não puxe o assunto com bronca. Um abraço vale mais.
Mais tarde, num momento calmo, você pode conversar: *"Hoje foi difícil no mercado, né? Da próxima a gente combina antes."*

E pra você: **você conseguiu.** Segurou a onda no meio da multidão. Isso é força, não fracasso.

💙 *Guarde essa página no celular ou na bolsa. No próximo aperto, ela vai estar aqui.*
$md$),
('completo', 4, $t$Telas Sem Guerra$t$, $md$# Telas Sem Guerra
### Como desligar a TV/tablet sem que o mundo acabe. Aviso, transição, acolhimento — nessa ordem.

---

"Desliga o tablet." E aí vem o choro, a birra, o drama de fim de mundo. Não é frescura da criança: pra ela, a tela é um lugar gostoso onde ela tava — e você a tirou de lá **de repente**. A guerra não é sobre a tela. É sobre o **corte brusco**.

O segredo é nunca desligar do nada. É preparar a saída, como quem avisa que a festa tá acabando.

---

## O roteiro em 3 passos

**1. Aviso antecipado (o mais importante)**
Dê um aviso quando ainda falta tempo:
> "Faltam 5 minutinhos e a gente desliga, tá? Vou te avisar de novo."

Depois, o aviso final:
> "Acabou o tempo desse vídeo. Mais este e a gente desliga junto."

**2. A transição (o pulo do gato)**
Não deixe o vazio depois da tela. Ofereça o **próximo** lugar gostoso:
> "Desligou! Agora vem cá me ajudar a fazer o lanche / montar o quebra-cabeça / dar comida pro cachorro."

Criança não resiste ao "não tela". Resiste ao "nada depois da tela".

**3. Validar a frustração**
Se vier o choro, não brigue com o sentimento:
> "Eu sei, é chato quando acaba. Você tava gostando tanto. Pode ficar triste. Amanhã tem de novo."

---

## Frases prontas pra colar na parede

- *"Mais 5 minutinhos e a gente desliga junto."*
- *"Você desliga ou eu desligo? Você escolhe."* (dá senso de controle)
- *"A tela vai dormir agora. Amanhã ela acorda."*
- *"Eu sei que é difícil parar. Tô aqui com você."*
- *"Acabou por hoje, e tudo bem chorar. Vem, vamos fazer outra coisa gostosa."*

---

## Tabela de tempo de tela — referência acolhedora

*Isto é um norte, não uma régua. Sua realidade, sua rotina, seu dia. Um dia puxado com mais tela não faz de você uma mãe pior. Use como bússola gentil, não como cobrança.*

| Idade | Sugestão geral por dia | Observação carinhosa |
|---|---|---|
| Até 2 anos | Evitar, exceto chamada de vídeo com a família | Nessa fase, colo e voz valem mais que qualquer tela |
| 2 a 5 anos | Cerca de 1 hora, de preferência acompanhada | Assistir junto e comentar transforma tela em vínculo |
| 6 a 10 anos | Cerca de 1 a 2 horas, com pausas | Combine os horários com ela — participar diminui a briga |
| 11 anos ou mais | Combinar limites juntos | Aqui vale mais o diálogo do que o cronômetro |

---

*A meta não é zero tela nem tela perfeita. É uma casa onde desligar não vira desastre — e onde você não precisa gritar pra ser ouvida.* 💛
$md$),
('completo', 5, $t$Manhãs Sem Correria$t$, $md$# Manhãs Sem Correria
### Um quadro pra criança se aprontar sozinha — e você respirar de manhã

---

A manhã é o campeão dos gritos. O relógio corre, a criança enrola, e antes das 8h você já perdeu a paciência três vezes.

O segredo não é apressar mais. É **tirar você do papel de "lembrete ambulante"** e passar o comando pra própria criança, de um jeito que ela consegue e até acha divertido.

Esse quadro faz isso. A criança olha, sabe o que vem, e vai marcando cada passo. Menos "vai logo!", mais autonomia. Menos correria, menos grito.

---

## O Quadro da Manhã

Imprima, ilustre e cole num lugar que a criança alcance (porta do quarto, geladeira, banheiro). Cada tarefa tem um ícone pra quem ainda não lê.

| ✔ | Passo | Ícone |
|:---:|:---|:---:|
| ☐ | Acordar e dar bom dia | ☀️ |
| ☐ | Fazer xixi e dar descarga | 🚽 |
| ☐ | Escovar os dentes | 🦷 |
| ☐ | Lavar o rosto | 💧 |
| ☐ | Tomar café da manhã | 🥣 |
| ☐ | Vestir a roupa | 👕 |
| ☐ | Calçar os sapatos | 👟 |
| ☐ | Pentear o cabelo | 💇 |
| ☐ | Pegar a mochila | 🎒 |
| ☐ | Beijo na mãe e vamos! | 💋 |

> Ajuste a lista à rotina de vocês. Menos passos pra crianças menores, mais autonomia pros maiores.

---

## Como montar junto com a criança

Quando a criança ajuda a criar, ela sente que o quadro é **dela** — e obedece com muito mais vontade.

- **Desenhem juntos.** Deixe ela colorir os ícones ou colar figurinhas de revista.
- **Deixe ela escolher a ordem** (dentro do possível). Poder decidir dá orgulho.
- **Fotos funcionam.** Cole uma foto dela escovando o dente, vestindo a roupa. Fica pessoal e claro.
- **Coloque na altura dos olhos dela**, não na sua.

---

## Como transformar em jogo

Rotina vira briga quando é obrigação. Vira festa quando é brincadeira:

- **Corrida contra o cronômetro:** "Será que você vence o relógio hoje?" (sem pressão, só diversão).
- **Marcar com estrelinha ou adesivo** cada passo cumprido. A cartela cheia no fim da semana pode virar um programa especial juntas.
- **Voz de personagem:** vira super-herói se vestindo, ninja escovando os dentes.
- **Música da manhã:** uma playlist curta em que cada música marca uma etapa. Quando acabar, é hora de sair.

---

## Dicas que salvam a manhã

- **Adiante o que der na noite anterior:** roupa separada, mochila pronta, sapato na porta. Menos decisões de manhã, menos atrito.
- **Acorde 10 minutos antes.** Pressa é o combustível do grito.
- **Elogie o processo, não só o fim:** "Você escovou os dentes sozinho, que capricho!"
- **Se um dia der tudo errado**, tudo bem. Amanhã o quadro estará ali de novo, esperando vocês.

---

Aos poucos, a criança para de depender dos seus lembretes — e começa a se orgulhar de dar conta sozinha. A manhã deixa de ser corrida e vira o começo gostoso do dia de vocês. 💙

*Imprima, cole na parede e deixe a mágica da autonomia acontecer.*
$md$),
('completo', 6, $t$Áudios — Respiração da Mãe$t$, $md$# Áudios de Respiração da Mãe
### 5 pausas de 60 segundos — pra VOCÊ, não pra criança

---

Você cuida de todo mundo o dia inteiro. Estes áudios são o contrário: são o momento em que **alguém cuida de você.**

São cinco scripts curtos, de mais ou menos um minuto cada, pra você gravar com a própria voz (ou pedir pra alguém gravar) e ouvir quando o corpo pesa. Fone no ouvido, olhos fechados se puder, e deixa a amiga aqui de dentro te acompanhar.

Não precisa de tempo. Precisa de um minuto. Você tem um minuto.

---

## Áudio 1 — Respiração 4-7-8
**Quando ouvir:** quando a raiva está subindo e você sente que vai explodir a qualquer segundo.

> Oi. Para tudo por um minuto, tá? Só um minuto é seu agora. [pausa]
> Vamos respirar juntas. Vou te guiar, você só segue. [pausa]
> Puxe o ar pelo nariz, contando até quatro… um, dois, três, quatro. [inspira]
> Agora segura o ar. Sete tempos. Um, dois, três, quatro, cinco, seis, sete. [pausa]
> E solta bem devagar pela boca, contando oito… um, dois, três, quatro, cinco, seis, sete, oito. [expira longo]
> Isso. De novo. Puxa em quatro… [inspira] segura… [pausa] e solta em oito. [expira]
> Sentiu? Seu corpo já está mais lento. A raiva não some, mas ela não manda mais em você. [pausa]
> Mais uma vez, no seu tempo. Puxa… segura… solta. [pausa longa]
> Pronto. Você voltou pra você. Pode seguir agora, com mais calma. Eu tô aqui.

---

## Áudio 2 — Pés no chão
**Quando ouvir:** quando a cabeça está a mil e você se sente fora do corpo, no automático.

> Ei, respira. Vamos voltar pro agora, juntas. [pausa]
> Sinta os seus pés. Onde eles estão tocando o chão? [pausa]
> Pressione levemente os pés contra o chão. Sinta o peso do seu corpo sendo sustentado. [pausa]
> O chão está aqui, firme, te segurando. Você não precisa segurar tudo sozinha. [pausa]
> Agora sinta suas pernas. Seus quadris na cadeira ou firmes em pé. [pausa]
> Respira fundo e sinta seus ombros. Deixa eles caírem, longe das orelhas. [expira]
> Você está aqui. Neste cômodo. Neste minuto. Nada além de agora precisa de você. [pausa]
> Mais uma respiração, sentindo os pés no chão. [inspira… expira]
> Você está inteira. Está presente. E está firme. [pausa]
> Quando abrir os olhos, leve essa firmeza com você.

---

## Áudio 3 — Soltar a culpa
**Quando ouvir:** depois de gritar, quando a culpa aperta o peito e você se sente a pior mãe do mundo.

> Oi, meu amor. Eu sei o que você está sentindo agora. Essa culpa pesada, né? [pausa]
> Respira comigo primeiro. Puxa o ar… e solta. [inspira… expira]
> Você gritou. Aconteceu. E agora você está aqui, se importando. [pausa]
> Presta atenção nisso: mãe que não se importa não sente culpa. A sua culpa é a prova do seu amor. [pausa]
> Mas amor não precisa de castigo. Você não precisa se punir pra ser boa mãe. [pausa]
> Erra quem tenta. E você tenta todo dia, mesmo cansada, mesmo no limite. [pausa]
> Coloca a mão no peito. Sente o coração batendo? Esse coração ama demais. [pausa]
> Fala baixinho comigo: "Eu errei, e eu me perdôo. Amanhã eu tento de novo." [pausa]
> Solta o ar e solta o peso. Recomeçar não é falhar. Você pode recomeçar agora.

---

## Áudio 4 — Dois minutos só seus
**Quando ouvir:** no meio do caos, quando você precisa de uma pausa mas acha que não pode parar.

> Para. Só dois minutos. O mundo aguenta você respirar por dois minutos. [pausa]
> Se puder, feche a porta. Do banheiro, do quarto, de onde for. Esse espaço é seu. [pausa]
> Ninguém está te cobrando nada aqui dentro. Nem você mesma. [pausa]
> Respira fundo, devagar. Sinta o ar entrando… e saindo. [inspira… expira]
> Você não é uma máquina. Você é uma pessoa que precisa descansar, mesmo que pouquinho. [pausa]
> Esses dois minutos não são egoísmo. São o que te permite voltar mais inteira. [pausa]
> Relaxa o rosto. A testa, o maxilar, a língua. Deixa tudo mole. [pausa]
> Mais uma respiração longa. Você merece esse ar. [inspira… expira]
> Agora você pode voltar. Não porque acabou o tempo, mas porque você se recarregou. Vai com calma.

---

## Áudio 5 — Você está fazendo o suficiente
**Quando ouvir:** no fim de um dia difícil, quando bate a sensação de que nunca é o bastante.

> Oi. Antes de dormir, deixa eu te falar uma coisa. [pausa]
> Hoje foi difícil. Eu sei. Talvez você ache que falhou em várias coisas. [pausa]
> Mas olha só tudo o que você fez. Você alimentou, cuidou, tentou, amou. Mesmo exausta. [pausa]
> Você acha que precisava ser perfeita. Mas seu filho não precisa de uma mãe perfeita. [pausa]
> Ele precisa de você. Essa, de verdade. Cansada, humana, que erra e volta a amar. [pausa]
> Respira fundo e recebe isso: você está fazendo o suficiente. [inspira… expira]
> Você é suficiente. Não porque fez tudo certo, mas porque não desistiu. [pausa]
> Amanhã tem um dia novo, com novas chances. Hoje, você pode descansar. [pausa]
> Fecha os olhos. Solta o dia. Você mereceu esse descanso, mãe. Boa noite.

---

*Grave com sua voz ou de alguém querido. Salve no celular. E lembre: cuidar de você também é cuidar dele.* 💙
$md$);
