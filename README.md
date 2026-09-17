# MOVEO — Avaliação funcional do ombro

MVP de uma aplicação web mobile-first que usa apenas a câmera do celular
(via MediaPipe Pose Landmarker, no navegador) para medir características
**funcionais** do movimento do ombro: amplitude aproximada, assimetria entre
lados, velocidade, compensação do tronco e consistência entre repetições.

**A aplicação não diagnostica lesões, doenças ou condições ortopédicas.**
Ela descreve apenas o movimento observado durante o teste.

O nome do produto ("MOVEO") e todos os textos, cores, CTA e limites
experimentais ficam centralizados em [`config/app.ts`](config/app.ts).

## Como instalar e rodar

```bash
cd moveo
npm install
npm run dev
```

Abra `http://localhost:3000`. Para testar no celular, garanta que o
computador e o celular estejam na mesma rede Wi-Fi e acesse
`http://<IP-do-computador>:3000` (o `next dev` escuta em todas as
interfaces de rede por padrão). Como `getUserMedia` exige HTTPS ou
`localhost` em navegadores móveis, para testar em um celular físico fora
da rede local será necessário publicar em HTTPS (ex.: Vercel) ou usar um
túnel HTTPS (ex.: `ngrok`) apontando para a porta 3000.

## Como publicar na Vercel

1. Suba o conteúdo da pasta `moveo/` em um repositório Git.
2. Importe o repositório em [vercel.com/new](https://vercel.com/new).
3. Nenhuma variável de ambiente é necessária — todo o processamento de
   câmera acontece no navegador do usuário.
4. Build command padrão (`next build`) e output padrão do framework Next.js
   funcionam sem configuração adicional.

## Como funciona o MediaPipe

- Usa `@mediapipe/tasks-vision` (`PoseLandmarker`), carregado no navegador a
  partir de CDNs públicas (`jsdelivr` para o runtime wasm, `storage.googleapis.com`
  para o modelo `pose_landmarker_lite`). Ver [`lib/pose/loadPoseLandmarker.ts`](lib/pose/loadPoseLandmarker.ts).
- A detecção roda em `runningMode: "VIDEO"`, chamando `detectForVideo` a
  cada frame dentro de um loop de `requestAnimationFrame`
  ([`lib/pose/usePoseLandmarker.ts`](lib/pose/usePoseLandmarker.ts)).
- Os 33 landmarks do BlazePose são reduzidos aos 9 pontos usados pela
  aplicação (nariz, ombros, cotovelos, punhos, quadris) em
  [`lib/pose/convertLandmarks.ts`](lib/pose/convertLandmarks.ts). O eixo X é
  espelhado nessa conversão porque o vídeo é exibido em modo espelho
  (como em qualquer app de câmera frontal) — assim overlay, ângulos e vídeo
  ficam no mesmo referencial.
- Nenhum vídeo, frame ou imagem é enviado a um servidor. Ver seção
  "Privacidade" abaixo.

## Como os ângulos são calculados

- **Flexão** e **abdução** usam a mesma função geométrica de base
  ([`lib/angles.ts`](lib/angles.ts)): o ângulo no vértice do ombro entre o
  vetor ombro→quadril (eixo do tronco) e o vetor ombro→cotovelo (braço).
  Uma câmera frontal 2D não separa com confiabilidade o plano sagital
  (flexão) do plano frontal (abdução) — na imagem, os dois movimentos
  aparecem como "elevação do braço". Isso é uma limitação conhecida e
  aceita explicitamente no protocolo: a diferenciação real vem da instrução
  dada ao usuário (levantar para frente vs. lateralmente), não da geometria
  isolada.
- Os ângulos brutos passam por uma média móvel simples
  ([`lib/smoothing.ts`](lib/smoothing.ts)) antes de alimentar a máquina de
  estados de detecção de movimento, para reduzir ruído do tracking.
- **Inclinação do tronco**: ângulo da linha entre os pontos médios dos
  ombros e dos quadris em relação à vertical.

Todos os ângulos são **estimativas de amplitude por visão computacional
2D**, não goniometria clínica certificada.

## Como funciona a detecção de movimento

Uma máquina de estados simples ([`lib/movementDetection.ts`](lib/movementDetection.ts))
por repetição: `IDLE → READY → ASCENDING → PEAK → DESCENDING → COMPLETED`.
O início é detectado por variação consistente do ângulo por alguns frames
consecutivos (evita ruído); o pico, por estabilização do ângulo ou reversão
de direção. Os limiares (graus, nº de frames) ficam em
`config/app.ts → thresholds.movementDetection`.

## Como funciona a compensação do tronco

Durante cada repetição, a inclinação do tronco é comparada com a
inclinação neutra capturada na calibração
([`lib/trunkCompensation.ts`](lib/trunkCompensation.ts)). O maior desvio
observado classifica a repetição como compensação **mínima / moderada /
elevada**, segundo limites configuráveis em `config/app.ts →
thresholds.trunkCompensation`. Esses limites são **experimentais** — ainda
não validados clinicamente — e servem apenas para destaque visual, nunca
como critério médico.

A partir da mesma lógica, é calculada a **amplitude antes da compensação**:
o ângulo do braço no instante em que o desvio do tronco ultrapassa o
limite mínimo pela primeira vez naquela repetição.

## Limitações da câmera 2D

- Uma câmera única, em plano frontal, não mede profundidade nem separa
  plano sagital de plano frontal com precisão — os ângulos são estimativas.
- Iluminação ruim, roupas largas, enquadramento incorreto ou perda de
  landmarks reduzem a confiabilidade da medição.
- A "distância" do usuário à câmera não é calculada em metros: usa-se a
  largura relativa dos ombros no frame como proxy para orientar
  "aproxime-se" / "afaste-se" (ver [`lib/positioning.ts`](lib/positioning.ts)).
- Quando uma métrica não pode ser calculada com confiança (ex.: nenhuma
  compensação relevante detectada), a interface mostra "não detectada" em
  vez de inventar um valor.

## Limitações clínicas

Esta ferramenta **não diagnostica** lesões, doenças ou condições
ortopédicas, e não deve ser usada como critério isolado para decisões
médicas. Ela descreve apenas o movimento observado durante o teste
(amplitude, assimetria, velocidade, compensação, consistência e dor
autorrelatada). Antes do teste, perguntas de segurança (trauma recente,
dor muito intensa, perda súbita de força, incapacidade de mover o braço)
podem interromper a avaliação e recomendar buscar avaliação profissional
(ver [`lib/safety.ts`](lib/safety.ts)).

O **Índice de Movimento** (0–100) é explicitamente experimental — combina
assimetria, amplitude, consistência e compensação apenas para permitir que
a própria pessoa compare seus testes ao longo do tempo. Não é um score de
saúde, gravidade ou lesão, e não é comparado a valores populacionais.

## Privacidade

- Todo o processamento de pose acontece localmente no navegador
  (MediaPipe Tasks Vision roda via WebAssembly/WebGL no dispositivo).
- Nenhum vídeo, frame ou imagem é gravado ou enviado a um servidor.
- Apenas landmarks, ângulos, timestamps, resultados calculados e respostas
  do usuário ficam em memória (estado do Zustand), durante a sessão.
- Não há banco de dados neste MVP: ao fechar ou recarregar a página, os
  dados são descartados.

## Modo Demonstração

Se a câmera não estiver disponível (ex.: desktop sem webcam, permissão
negada, ou nenhuma câmera detectada), a interface oferece "Continuar em
modo demonstração", que carrega um resultado fictício
([`lib/demoData.ts`](lib/demoData.ts)) para permitir testar toda a
interface de resultados. A tela de resultados sempre exibe um aviso
"Modo demonstração — resultados fictícios" nesse caso, e dados reais e
fictícios nunca são combinados.

## Modo Debug

Durante as telas de câmera, um botão discreto "debug" no canto superior
direito ativa um painel com tela atual, fase da máquina de estados,
repetição, ângulo e status de detecção de landmarks — útil para depurar o
rastreamento sem poluir a interface para o usuário final.

## Testes

Funções de cálculo (ângulos, comparação entre lados, consistência,
compensação do tronco, duração, máquina de estados de detecção) são puras
e testadas isoladamente, sem depender de câmera:

```bash
npm test
```

## Arquitetura e decisões

- O fluxo de telas (`components/AssessmentFlow.tsx`) é um único componente
  client-side controlado por uma máquina de estado no Zustand
  (`stores/assessmentStore.ts`), em vez de uma rota do Next.js por tela.
  Isso mantém a câmera e a detecção de pose ativas continuamente entre as
  etapas de posicionamento, calibração e teste, sem reinicializar o
  `getUserMedia` a cada transição.
- O motor de cálculo biomecânico (`lib/angles.ts`, `lib/trunkCompensation.ts`,
  `lib/movementMetrics.ts`, `lib/movementDetection.ts`, `lib/resultRules.ts`)
  é isolado de qualquer componente visual, para permitir evoluir os
  algoritmos sem tocar na interface.
- Preparado para evoluir (não implementado neste MVP): login, pacientes,
  médicos, banco de dados, histórico entre sessões, comparação semanal,
  painel médico e outras articulações (cotovelo, punho, joelho, quadril,
  coluna).
