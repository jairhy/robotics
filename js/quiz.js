/* quiz.js — Quiz ENEM Robótica 4.0 (nota de 1 a 10, avanço automático) */
const Q = [
{img:"montagem.svg",t:"Robôs",p:"Uma fábrica de eletrônicos precisa inserir componentes em placas de circuito com grande velocidade, boa rigidez vertical e precisão. A morfologia robótica mais indicada para essa montagem, por combinar dois eixos rotacionais horizontais e um eixo linear vertical, é o robô:",o:["Cilíndrico, por ter uma base rotacional e dois eixos lineares","Esférico, por ter envelope de trabalho em formato de esfera","SCARA, por ter cinemática RRP com rigidez vertical elevada","Cartesiano, por se mover em três eixos lineares perpendiculares"],r:2,e:"O SCARA (RRP) é rápido e rígido no eixo vertical, dominante em montagem eletrônica."},
{img:"colaboracao.svg",t:"Robôs",p:"Uma pequena empresa quer que um operador e o robô trabalhem lado a lado, sem gaiolas de proteção. Para permitir essa colaboração com segurança, seguindo a norma ISO/TS 15066, o robô deve possuir:",o:["Sensores de força e limites de velocidade que reduzem o risco","Estrutura muito pesada e rígida para resistir a qualquer colisão","Envelope de trabalho esférico para afastar o operador da área","Três braços paralelos para dividir a carga com o operador"],r:0,e:"Cobots usam sensores de força e limites de velocidade, dispensando gaiolas de segurança."},
{img:"hcsr04.svg",t:"Sensores",p:"No código do sensor ultrassônico HC-SR04, a distância em centímetros é calculada com distancia = duracao * 0.017. O fator 0,017 é usado porque o som viaja a cerca de 0,034 cm/µs e o pulso medido corresponde a:",o:["Metade do trajeto, pois o eco mede a ida e a volta do som","Um trajeto completo, pois o som percorre apenas a ida","O dobro do trajeto, pois o sensor emite dois pulsos seguidos","Um quarto do trajeto, pois o som perde energia ao refletir"],r:0,e:"O tempo medido inclui ida e volta; dividir por 2 dá 0,034/2 = 0,017 cm/µs."},
{img:"ldr.svg",t:"Sensores",p:"Em um circuito com sensor LDR, ele é ligado a um resistor de 10 kΩ formando um divisor de tensão, e o ponto central é conectado à entrada A0 do Arduino. Essa configuração é necessária porque o LDR:",o:["Gera sozinho um sinal digital HIGH ou LOW conforme a luz","Varia sua resistência, e o divisor converte isso em tensão","Precisa do resistor apenas para não queimar o pino A0","Emite pulsos de luz que o resistor transforma em corrente"],r:1,e:"O LDR muda de resistência com a luz; o divisor transforma isso em tensão (0–5 V) lida pelo ADC."},
{img:"multimetro.svg",t:"Multímetro",p:"Um técnico deseja medir a corrente elétrica que passa por um LED em um circuito de protoboard alimentado pelo Arduino. Para essa medição com o multímetro na função amperímetro, o procedimento correto é:",o:["Ligá-lo em paralelo com o LED, sem interromper o circuito","Ligá-lo em série, interrompendo o circuito para a corrente passar por ele","Encostar as pontas no resistor com o circuito desligado","Ligá-lo nos terminais da fonte na função de resistência"],r:1,e:"Corrente é medida em série (o circuito é aberto); tensão é medida em paralelo."},
{img:"adc.svg",t:"Arduino",p:"O conversor analógico-digital (ADC) do Arduino Uno tem resolução de 10 bits para tensões de 0 V a 5 V. Se o comando analogRead(A0) retornar o valor 512, a tensão aproximada presente no pino A0 é de:",o:["1,0 V, pois 512 corresponde a um quinto da escala","5,0 V, pois 512 indica o valor máximo do conversor","0,5 V, pois o valor lido equivale a um décimo da escala","2,5 V, pois 512 está aproximadamente na metade de 0 a 1023"],r:3,e:"512/1023 × 5 V ≈ 2,5 V."},
{img:"pwm.svg",t:"Arduino",p:"No Desafio 1, o LED foi ligado ao pino 9 e controlado por analogWrite(ledPin, 120) para obter brilho reduzido. O pino 9 foi escolhido, e não o pino 8, porque ele:",o:["É o único pino do Arduino capaz de fornecer 5 V ao LED","Possui conversor analógico-digital para ler o LDR","Tem saída PWM, necessária para variar o brilho com analogWrite","Consome menos corrente que os demais pinos digitais"],r:2,e:"analogWrite só simula tensão variável em pinos com PWM (marcados com ~), como o 9."},
{img:"esp32.svg",t:"ESP32",p:"Um estudante trocou o Arduino Uno por um ESP32 para enviar dados à nuvem por Wi-Fi e quer conectar um sensor que trabalha com sinal de 5 V a um GPIO. Como os GPIOs do ESP32 operam em 3,3 V, o cuidado necessário é:",o:["Ligar o sensor direto, pois todos os GPIOs toleram 5 V","Usar um divisor de tensão ou conversor de nível no sinal","Trocar o sensor por um LED para evitar qualquer incompatibilidade","Aumentar a tensão do ESP32 para 5 V pelo código"],r:1,e:"GPIOs do ESP32 são de 3,3 V; sinais de 5 V exigem divisor ou conversor de nível."},
{t:"Código",img:"codigo1.png",p:"O código acima pertence a um sistema em que o LED deve acender com brilho máximo quando há presença e o ambiente está escuro. Ao executá-lo, o LED não acende. O erro está em:",o:["O pino do PIR ter sido declarado com valor 2","O LED estar configurado como INPUT em vez de OUTPUT","O valor 255 não poder ser usado no analogWrite","A leitura do LDR ser feita com analogRead"],r:1,e:"pinMode(ledPin, INPUT) deve ser OUTPUT para o LED poder ser acionado."},
{t:"Código",img:"codigo2.png",p:"O código acima mede a distância com um sensor ultrassônico, mas o compilador do Arduino apresenta um erro ao verificar o programa. A causa do erro é:",o:["O pino trigPin ser colocado em LOW antes do pulso","O uso de delayMicroseconds(10) no disparo do sensor","O uso de duracao no cálculo antes de ela ser declarada","A função Serial.println ser usada dentro do loop"],r:2,e:"A variável duracao é usada na conta antes de ser criada e lida com pulseIn."},
{t:"Código",img:"codigo3.png",p:"O código acima deveria acender o LED amarelo quando a umidade estiver abaixo de 50%, mas ele acende quando a umidade está alta. O erro de lógica está em:",o:["A temperatura ser lida antes da umidade","O LED verde ser tratado apenas no último else","A variável TEMP_MAX ter sido declarada como float","A comparação umidade > UMID_MIN, que deveria usar <"],r:3,e:"Umidade baixa é umidade < UMID_MIN; o sinal > inverte a condição."}
];
let i=0, resp=[], travado=false;
const $=id=>document.getElementById(id);
function mostrar(){
  const q=Q[i]; travado=false;
  $('q-cat').textContent=q.t; $('q-num').textContent=`Questão ${i+1} de ${Q.length}`;
  $('q-bar').style.width=(i/Q.length*100)+'%';
  $('q-txt').textContent=q.p;
  const im=$('q-img'); if(q.img){im.src=q.img.includes('/')?q.img:`images/quiz/${q.img}`;im.alt=q.t==='Código'?'Trecho de código Arduino':'Imagem ilustrativa da questão';im.hidden=false}else im.hidden=true;
  $('q-ops').innerHTML=q.o.map((t,k)=>`<button class="q-op" data-k="${k}"><b>${'ABCD'[k]}</b><span>${t}</span></button>`).join('');
  document.querySelectorAll('.q-op').forEach(b=>b.onclick=()=>responder(+b.dataset.k));
}
function responder(k){
  if(travado)return; travado=true;
  const q=Q[i]; resp.push(k);
  const bs=document.querySelectorAll('.q-op');
  bs[q.r].classList.add('certa'); if(k!==q.r)bs[k].classList.add('errada');
  setTimeout(()=>{ i++; i<Q.length?mostrar():fim(); },900);
}
function fim(){
  const ac=resp.filter((k,n)=>k===Q[n].r).length;
  const nota=Math.max(1,Math.round(ac/Q.length*10));
  $('quiz-box').hidden=true; $('res').hidden=false;
  $('res-nota').textContent=nota; $('res-ac').textContent=`${ac} de ${Q.length} questões corretas`;
  $('res-msg').textContent=nota>=8?'Excelente domínio do conteúdo!':nota>=6?'Bom resultado! Revise os pontos errados.':'Vale revisar o conteúdo do portal e tentar de novo.';
  $('res-rev').innerHTML=Q.map((q,n)=>{const ok=resp[n]===q.r;return `<li class="${ok?'ok':'no'}"><strong>${ok?'✓':'✗'} Questão ${n+1} (${q.t})</strong><br/>${ok?'':`Sua resposta: ${'ABCD'[resp[n]]}. `}Correta: ${'ABCD'[q.r]}. ${q.e}</li>`}).join('');
}
$('refazer').onclick=()=>{i=0;resp=[];$('res').hidden=true;$('quiz-box').hidden=false;mostrar()};
mostrar();
