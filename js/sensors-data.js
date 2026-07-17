/* =========================================================
   sensors-data.js — Base de dados dos 10 sensores IoT
   Fonte: Catálogo Técnico Digital — Sensores IoT e Indústria 4.0
   ========================================================= */

const SENSORES = [
  {
    id: "dht22",
    nome: "DHT22 (AM2302)",
    fabricante: "AOSONG Electronics",
    categoria: "temperatura",
    categoriaLabel: "Temperatura e Umidade",
    sinal: "digital",
    sinalLabel: "Digital",
    icone: "termometro",
    resumo: "Sensor digital de alta precisão para medição combinada de temperatura e umidade relativa do ar.",
    conceito: "O DHT22 é um sensor digital de alta precisão para medição combinada de temperatura e umidade relativa do ar ambiente, amplamente utilizado em sistemas de climatização (HVAC) e estufas automatizadas devido ao seu sinal de saída digital pré-calibrado.",
    principio: "Mede a umidade do ar através de um elemento capacitivo polimérico cuja permissividade varia com a absorção de vapor d'água. A temperatura é medida através de um termistor NTC (resistor cuja resistência cai com o aumento de calor). Um microcontrolador interno de 8 bits processa estas grandezas analógicas e transmite um pacote digital estruturado de 40 bits em um barramento de fio único (single-bus).",
    pinos: [
      { nome: "VCC", desc: "Alimentação 3.3V a 5.5V DC" },
      { nome: "DATA", desc: "Barramento digital único (single-bus) — requer resistor pull-up de 4.7kΩ a 10kΩ" },
      { nome: "NC", desc: "Não conectado" },
      { nome: "GND", desc: "Terra / referência" }
    ],
    specs: [
      { label: "Faixa de operação", value: "Umidade 0–100% UR | Temperatura -40°C a +80°C" },
      { label: "Precisão", value: "Umidade ±2% UR | Temperatura ±0.5°C" },
      { label: "Tensão operacional", value: "3.3V a 5.5V DC (corrente máx. 1.5mA em leitura)" },
      { label: "Modelos comerciais", value: "AM2302, DHT22, AOSONG Electronics" }
    ],
    aplicacoes: "Monitoramento ambiental de datacenters, controle climático de silos agrícolas e estações meteorológicas IoT domésticas ou urbanas.",
    codigo: `// Projeto de Aquisição Climática com DHT22
#include "DHT.h"
const int DHTPIN = 2; // Pino digital conectado ao DATA do sensor
#define DHTTYPE DHT22 // Define o modelo do sensor
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println("Sensor DHT22 Inicializado!");
}

void loop() {
  delay(2000); // O DHT22 necessita de um intervalo mínimo de 2s entre leituras
  float umidade = dht.readHumidity();
  float temperatura = dht.readTemperature();

  if (isnan(umidade) || isnan(temperatura)) {
    Serial.println("Falha na leitura do sensor DHT22!");
    return;
  }

  Serial.print("Umidade: "); Serial.print(umidade); Serial.print(" % | ");
  Serial.print("Temp: "); Serial.print(temperatura); Serial.println(" °C");
}`,
    simulador: "dht22"
  },
  {
    id: "ds18b20",
    nome: "DS18B20",
    fabricante: "Maxim Integrated (Analog Devices)",
    categoria: "temperatura",
    categoriaLabel: "Temperatura e Umidade",
    sinal: "1-wire",
    sinalLabel: "1-Wire",
    icone: "termometro-agua",
    resumo: "Termômetro digital à prova d'água com sonda de aço inoxidável, ideal para líquidos.",
    conceito: "O DS18B20 é um termômetro digital com resolução programável de 9 a 12 bits. É comercializado comumente encapsulado em uma sonda de aço inoxidável à prova d'água, ideal para monitoramento de líquidos e processos químicos molhados.",
    principio: "Utiliza transdutores internos de temperatura baseados na taxa de variação da frequência de osciladores de cristal de quartzo altamente dependentes de calor. O chip interno traduz os dados e se comunica via barramento 1-Wire da Dallas Semiconductor, permitindo que dezenas de sensores sejam conectados ao mesmo pino do Arduino por possuírem um endereço físico de 64 bits gravado a laser de fábrica.",
    pinos: [
      { nome: "VCC", desc: "Alimentação 3.0V a 5.5V DC (suporta modo parasita)" },
      { nome: "DATA", desc: "Barramento 1-Wire — requer resistor pull-up de 4.7kΩ" },
      { nome: "GND", desc: "Terra / referência" }
    ],
    specs: [
      { label: "Faixa de operação", value: "-55°C a +125°C" },
      { label: "Precisão", value: "±0.5°C na faixa de -10°C a +85°C" },
      { label: "Tensão operacional", value: "3.0V a 5.5V DC (suporta modo parasita de energia)" },
      { label: "Fabricante", value: "Maxim Integrated (Analog Devices)" }
    ],
    aplicacoes: "Controle térmico de tanques de brassagem em cervejarias, resfriadores industriais, pasteurizadores industriais e monitoramento de dutos hidráulicos.",
    codigo: `// Leitura do Sensor DS18B20 (requer resistor pull-up de 4.7k ohms no pino de sinal)
#include <OneWire.h>
#include <DallasTemperature.h>

const int ONE_WIRE_BUS = 4; // Pino digital conectado ao DATA do DS18B20
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);
  sensors.begin();
  Serial.println("Sensor DS18B20 Inicializado!");
}

void loop() {
  sensors.requestTemperatures(); // Envia comando para todos os sensores do barramento
  float tempC = sensors.getTempCByIndex(0); // Lê o primeiro dispositivo encontrado

  if (tempC == DEVICE_DISCONNECTED_C) {
    Serial.println("Erro: Sensor desconectado!");
  } else {
    Serial.print("Temperatura do Tanque: ");
    Serial.print(tempC);
    Serial.println(" °C");
  }
  delay(1000);
}`,
    simulador: "ds18b20"
  },
  {
    id: "ldr",
    nome: "LDR (Fotorresistor)",
    fabricante: "Diversos (GL5516, GL5528)",
    categoria: "luminosidade",
    categoriaLabel: "Luminosidade",
    sinal: "analogico",
    sinalLabel: "Analógico",
    icone: "sol",
    resumo: "Resistência variável controlada pela incidência de luz — base de circuitos de acionamento automático.",
    conceito: "O LDR (Light Dependent Resistor) é uma resistência variável controlada pela incidência de luz em sua superfície sensível, muito empregado para acionamentos automáticos baseados na luz natural do dia.",
    principio: "É composto por Sulfeto de Cádmio (CdS), um material semicondutor de alta resistência intrínseca. Quando fótons da luz incidente colidem com o material, liberam elétrons livres na banda de condução, reduzindo drasticamente a sua resistência elétrica de forma não linear. Para ler essa variação em um microcontrolador, monta-se um circuito divisor de tensão resistivo: Vout = Vcc × (RLDR / (Rfixed + RLDR))",
    pinos: [
      { nome: "Terminal A", desc: "Ligado ao Vcc (5V) através do divisor resistivo" },
      { nome: "Terminal B", desc: "Ligado à entrada analógica (ex: A0) e ao GND via resistor fixo de 10kΩ" }
    ],
    specs: [
      { label: "Resistência no escuro", value: "~1 MΩ (típico)" },
      { label: "Resistência na luz (10 lux)", value: "~10 kΩ a 20 kΩ (típico)" },
      { label: "Tensão máxima", value: "150V AC/DC pico (depende do encapsulamento)" },
      { label: "Modelos comerciais", value: "LDR 5mm GL5516, GL5528" }
    ],
    aplicacoes: "Controle inteligente de iluminação pública e industrial (fotocélulas), detecção de obstrução de passagens e automação residencial (Smart Cities).",
    codigo: `// Divisor de Tensão LDR em A0 (Esquema: GND - R 10K - A0 - LDR - 5V)
const int ldrPin = A0;   // Pino analógico conectado ao meio do divisor
const int relayPin = 13; // Saída digital acoplada a um relé de iluminação

void setup() {
  Serial.begin(9600);
  pinMode(relayPin, OUTPUT);
}

void loop() {
  int ldrRaw = analogRead(ldrPin); // Retorna um valor de 0 a 1023
  float tensao = ldrRaw * (5.0 / 1023.0); // Conversão para tensão

  Serial.print("Leitura ADC: "); Serial.print(ldrRaw);
  Serial.print(" | Tensao: "); Serial.print(tensao); Serial.println(" V");

  if (ldrRaw < 400) { // Ambiente escureceu
    digitalWrite(relayPin, HIGH); // Acende os refletores
    Serial.println("Ambiente escuro detectado -> Iluminação LIGADA");
  } else {
    digitalWrite(relayPin, LOW); // Apaga os refletores
  }
  delay(1000);
}`,
    simulador: "ldr"
  },
  {
    id: "hcsr04",
    nome: "HC-SR04",
    fabricante: "AOSONG, RCWL",
    categoria: "distancia",
    categoriaLabel: "Distância",
    sinal: "digital",
    sinalLabel: "Digital",
    icone: "ondas",
    resumo: "Transdutor ultrassônico para medir distâncias sem contato mecânico, baseado no tempo de voo do som.",
    conceito: "O HC-SR04 é um transdutor ultrassônico amplamente utilizado para medir distâncias físicas e detectar obstáculos sem qualquer contato mecânico direto com os objetos medidos.",
    principio: "Funciona com base no sonar ecolocalizador dos morcegos (tempo de voo do som). O microcontrolador envia um pulso de trigger digital de 10 microssegundos, o transdutor emite uma rajada de 8 pulsos ultrassônicos a 40 kHz. As ondas colidem com o obstáculo, retornam, e o pino ECHO fica HIGH pelo tempo exato do trajeto. Distância = (tempo do pulso HIGH × 0,0343) / 2, considerando velocidade do som ≈ 343 m/s a 20°C.",
    pinos: [
      { nome: "VCC", desc: "Alimentação 5V DC" },
      { nome: "TRIG", desc: "Entrada digital — dispara o pulso ultrassônico" },
      { nome: "ECHO", desc: "Saída digital — fica HIGH durante o tempo de voo do eco" },
      { nome: "GND", desc: "Terra / referência" }
    ],
    specs: [
      { label: "Faixa de detecção", value: "2 cm a 400 cm" },
      { label: "Resolução efetiva", value: "3 mm (ângulo de abertura ideal < 15°)" },
      { label: "Tensão e corrente", value: "5V DC | corrente de repouso < 2mA" },
      { label: "Fabricantes / modelos", value: "AOSONG, HC-SR04 original, RCWL" }
    ],
    aplicacoes: "Medição de nível em silos graneleiros, monitoramento volumétrico em esteiras rolantes de separação, e navegação segura para AGVs em galpões logísticos.",
    codigo: `// Projeto de medição física com HC-SR04
const int trigPin = 5;
const int echoPin = 6;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); // Dispara pulso de 10us
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duracao = pulseIn(echoPin, HIGH); // Captura duração do pulso de retorno
  float distancia = (duracao * 0.0343) / 2; // tempo x velocidade do som / 2 (ida e volta)

  if (distancia >= 400 || distancia <= 2) {
    Serial.println("Leitura fora de alcance ou com erro!");
  } else {
    Serial.print("Distancia: ");
    Serial.print(distancia);
    Serial.println(" cm");
  }
  delay(500);
}`,
    simulador: "hcsr04"
  },
  {
    id: "pir",
    nome: "PIR HC-SR501",
    fabricante: "Diversos",
    categoria: "presenca",
    categoriaLabel: "Presença",
    sinal: "digital",
    sinalLabel: "Digital",
    icone: "movimento",
    resumo: "Detecta movimento monitorando a energia infravermelha (calor corporal) emitida por seres vivos.",
    conceito: "O sensor infravermelho passivo (PIR) detecta movimento monitorando a energia infravermelha (calor corporal) emitida por seres vivos no ambiente, sendo fundamental em sistemas modernos de segurança.",
    principio: "Utiliza um elemento piroelétrico (cristal que gera carga elétrica quando exposto ao calor). O sensor é dividido em dois slots que medem a temperatura da radiação ao redor. Quando uma fonte quente se desloca pelo campo de visão, ela intercepta primeiro um slot e depois o outro. A lente de Fresnel foca a luz infravermelha dispersa sobre o cristal sensor, e o amplificador integrado gera um pulso digital HIGH indicando movimento ativo.",
    pinos: [
      { nome: "VCC", desc: "Alimentação 4.5V a 20V DC" },
      { nome: "OUT", desc: "Sinal digital lógico de 3.3V — HIGH quando detecta movimento" },
      { nome: "GND", desc: "Terra / referência" }
    ],
    specs: [
      { label: "Distância de detecção", value: "3 a 7 metros (ajustável via potenciômetro)" },
      { label: "Delay de saída", value: "5s a 200s (ajustável via potenciômetro)" },
      { label: "Tensão de alimentação", value: "4.5V a 20V DC (sinal lógico de saída 3.3V)" },
      { label: "Modos de operação", value: "L (sem repetição de gatilho) ou H (com repetição)" }
    ],
    aplicacoes: "Sistemas anti-intrusão para edifícios inteligentes, automação de iluminação residencial e de escritórios, acionamento automático de portas e displays comerciais interativos.",
    codigo: `// Sistema de Alarme de Intrusão IoT
const int pirPin = 7;    // Pino digital do sensor de movimento
const int alarmLED = 8;  // Sinalização de Alarme Ativo

void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  pinMode(alarmLED, OUTPUT);
  Serial.println("Calibrando o sensor PIR (Aguardando estabilização)...");
  delay(30000); // Aguarda 30s para o sensor PIR mapear o ambiente estático
  Serial.println("Sistema Ativo!");
}

void loop() {
  int movimento = digitalRead(pirPin);
  if (movimento == HIGH) {
    digitalWrite(alarmLED, HIGH);
    Serial.println("ALERTA: INTRUSO DETECTADO NO CAMPO COBERTO!");
  } else {
    digitalWrite(alarmLED, LOW);
  }
  delay(200);
}`,
    simulador: "pir"
  },
  {
    id: "lj12a3",
    nome: "LJ12A3-4-Z/BX",
    fabricante: "Diversos (grau industrial)",
    categoria: "distancia",
    categoriaLabel: "Distância",
    sinal: "digital",
    sinalLabel: "Digital",
    icone: "proximidade",
    resumo: "Sensor indutivo robusto de grau industrial para detecção de metais sem desgaste físico.",
    conceito: "O LJ12A3 é um sensor indutivo robusto de grau industrial, comumente empregado em máquinas de corte CNC, braços robóticos e esteiras para contagem ou posicionamento de peças metálicas, sem qualquer tipo de desgaste físico.",
    principio: "Consiste em uma bobina interna que, ao ser alimentada, emite um campo eletromagnético de alta frequência no cabeçote de detecção. Quando um objeto metálico entra neste campo, correntes parasitas de Foucault (Eddy currents) são induzidas em sua superfície, roubando energia do circuito ressonante. Um Schmitt Trigger integrado detecta essa queda de amplitude e muda o estado do transistor NPN interno.",
    pinos: [
      { nome: "Marrom (+)", desc: "Alimentação 6V a 36V DC" },
      { nome: "Preto (Sinal)", desc: "Saída NPN — vai a GND quando detecta metal (requer divisor/pull-up para ler 5V)" },
      { nome: "Azul (-)", desc: "Terra / referência" }
    ],
    specs: [
      { label: "Distância de detecção", value: "Até 4 mm (ideal para ferro; reduz com alumínio/cobre)" },
      { label: "Frequência de chaveamento", value: "500 Hz (rápido para contagem de giro)" },
      { label: "Tensão de alimentação", value: "6V a 36V DC (requer divisor resistivo de proteção para ler 5V)" },
      { label: "Tipo de transistor", value: "NPN normal aberto (chaveia o terra/GND)" }
    ],
    aplicacoes: "Controle de fim de curso em eixos de tornos mecânicos e impressoras 3D, contagem de embalagens metálicas em linhas de envase, e tacômetro para medição indireta de rotação de eixos.",
    codigo: `// Conexão de Sensor NPN Industrial de 24V com divisor de tensão para proteger o pino 3
const int limitPin = 3;   // Pino conectado ao divisor de tensão do coletor NPN
const int statusLED = 13; // LED nativo do Arduino

void setup() {
  Serial.begin(9600);
  // No modelo NPN, a saida vai para GND quando detecta metal. Usamos pull-up interno.
  pinMode(limitPin, INPUT_PULLUP);
  pinMode(statusLED, OUTPUT);
  Serial.println("Sistema de Proteção Indutiva Pronto!");
}

void loop() {
  int sensorEstado = digitalRead(limitPin);
  // Como é NPN, LOW significa "Metal Detectado" e HIGH significa "Nenhum metal"
  if (sensorEstado == LOW) {
    digitalWrite(statusLED, HIGH);
    Serial.println("ATENÇÃO: Peça Metálica Identificada!");
  } else {
    digitalWrite(statusLED, LOW);
  }
  delay(100);
}`,
    simulador: "lj12a3"
  },
  {
    id: "mq135",
    nome: "MQ-135",
    fabricante: "Diversos",
    categoria: "gas",
    categoriaLabel: "Gás/Poluição",
    sinal: "analogico",
    sinalLabel: "Analógico",
    icone: "gas",
    resumo: "Sensor de gás sensível a compostos orgânicos voláteis, amônia, benzeno, álcool e fumaça.",
    conceito: "O MQ-135 é um sensor de gás altamente sensível a compostos orgânicos voláteis (VOCs), amônia, benzeno, álcool e fumaça em geral, sendo um dos sensores centrais para medição da qualidade do ar e ventilação inteligente.",
    principio: "Baseia-se em um elemento sensor de Dióxido de Estanho (SnO2) aquecido eletricamente por uma bobina interna de platina e níquel. No ar limpo, a condutividade elétrica do SnO2 é muito baixa. Gases nocivos interagem quimicamente com o oxigênio adsorvido na superfície do SnO2, liberando elétrons adicionais na banda de condução — a resistência diminui de forma exponencial em relação à concentração de gás.",
    pinos: [
      { nome: "VCC", desc: "Alimentação 5V DC (aquecedor consome ~150mA)" },
      { nome: "AOUT", desc: "Saída analógica contínua proporcional à concentração de gás" },
      { nome: "DOUT", desc: "Saída digital por comparador — HIGH quando ultrapassa limiar ajustável (trimpot)" },
      { nome: "GND", desc: "Terra / referência" }
    ],
    specs: [
      { label: "Faixa de detecção", value: "10 ppm a 1000 ppm (depende do composto e calibração)" },
      { label: "Resistência do sensor (Rs)", value: "2 kΩ a 20 kΩ (varia conforme o gás presente)" },
      { label: "Alimentação do aquecedor", value: "5V DC | ~800mW (corrente constante ~150mA)" },
      { label: "Tempo de preaquecimento", value: "24 horas recomendadas para uso estável de precisão" }
    ],
    aplicacoes: "Detectores de poluição atmosférica urbana, sistemas de purificação ou exaustão de cozinhas, alertas de fumaça industriais e monitoramento de CO2 indireto em edifícios inteligentes.",
    codigo: `// Medição da concentração e alarmes de gás nocivo
const int mq135AnalogPin = A1;  // Pino de sinal analogico continuo
const int mq135DigitalPin = 9;  // Saida digital (com limiar de comparador por trimpot)
const int buzzer = 10;          // Buzzer piezoelétrico para alarme sonoro

void setup() {
  Serial.begin(9600);
  pinMode(mq135DigitalPin, INPUT);
  pinMode(buzzer, OUTPUT);
}

void loop() {
  int rawValue = analogRead(mq135AnalogPin);
  int gasLimiarEstourado = digitalRead(mq135DigitalPin);

  Serial.print("Qualidade do Ar (Nivel Relativo): ");
  Serial.print(rawValue);

  if (gasLimiarEstourado == HIGH) { // Se o gas exceder a barreira física
    digitalWrite(buzzer, HIGH);
    Serial.println(" [ALERTA: AR TOXICO DETECTADO!]");
  } else {
    digitalWrite(buzzer, LOW);
    Serial.println(" [Condicoes de Ar Seguras]");
  }
  delay(1000);
}`,
    simulador: "mq135"
  },
  {
    id: "yfs201",
    nome: "YF-S201",
    fabricante: "Diversos",
    categoria: "vazao",
    categoriaLabel: "Vazão",
    sinal: "digital",
    sinalLabel: "Digital",
    icone: "gota",
    resumo: "Hidrômetro/fluxômetro eletrônico de efeito Hall que detecta o volume de líquido em fluxo dinâmico.",
    conceito: "O YF-S201 é um hidrômetro/fluxômetro eletrônico que detecta o volume de líquido em fluxo dinâmico dentro de tubulações residenciais ou industriais leves, ideal para evitar desperdícios e automação hidráulica.",
    principio: "É composto por uma válvula plástica de 1/2 polegada, um rotor mecânico de pás internas e um circuito de Efeito Hall. À medida que o líquido flui, ele força o rotor a girar. Um ímã de neodímio fixado nas pás cruza repetidamente o sensor de efeito Hall, gerando um pulso elétrico quadrado a cada volta. O volume total é determinado pela contagem desses pulsos via interrupção de hardware: f = 7.5 × Q (Q em L/min).",
    pinos: [
      { nome: "Vermelho (VCC)", desc: "Alimentação 5V a 18V DC" },
      { nome: "Preto (GND)", desc: "Terra / referência" },
      { nome: "Amarelo (Sinal)", desc: "Pulsos digitais de 5V — requer pino de interrupção externa" }
    ],
    specs: [
      { label: "Faixa de fluxo medido", value: "1 a 30 Litros por Minuto (L/min)" },
      { label: "Frequência de pulso", value: "f = 7.5 × Q (onde Q é a vazão em L/min)" },
      { label: "Pressão máxima suportada", value: "≤ 1.75 MPa (≈ 17.5 bar)" },
      { label: "Tensão operacional", value: "5V a 18V DC (sinal digital de 5V lógico)" }
    ],
    aplicacoes: "Sistemas agrícolas automáticos de irrigação inteligente, controle de dosagem industrial de substâncias aquosas neutras, medição de consumo doméstico de água com integração via painéis Web IoT.",
    codigo: `// Contagem de Vazão Usando Interrupção Externa no pino 2 (Interrupção 0)
const int flowPin = 2; // Pino obrigatorio para interrupcoes no Arduino Uno
volatile int pulsosContagem = 0;
float vazaoLitrosPorMinuto = 0.0;

void incrementarPulso() {
  pulsosContagem++; // Soma a cada passagem magnética do rotor
}

void setup() {
  Serial.begin(9600);
  pinMode(flowPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(flowPin), incrementarPulso, FALLING);
}

void loop() {
  pulsosContagem = 0;
  interrupts();
  delay(1000); // Amostra o fluxo por exatamente 1 segundo
  noInterrupts();

  // Conversão: freq = pulsos/segundo. Vazão (L/min) = freq / 7.5
  vazaoLitrosPorMinuto = (pulsosContagem / 7.5);
  Serial.print("Vazão Atual: ");
  Serial.print(vazaoLitrosPorMinuto);
  Serial.println(" L/min");
}`,
    simulador: "yfs201"
  },
  {
    id: "acs712",
    nome: "ACS712",
    fabricante: "Allegro MicroSystems",
    categoria: "corrente",
    categoriaLabel: "Corrente Elétrica",
    sinal: "analogico",
    sinalLabel: "Analógico",
    icone: "corrente",
    resumo: "Transdutor de efeito Hall para monitorar correntes elétricas CA ou CC com isolamento dielétrico.",
    conceito: "O ACS712 é um transdutor integrado projetado para monitorar de forma segura, com isolamento dielétrico de até 2.1 kV, correntes elétricas alternadas (CA) ou contínuas (CC).",
    principio: "A corrente que flui pela linha de cobre integrada na placa cria um campo eletromagnético proporcional à intensidade da corrente. O chip Allegro detecta esse campo pelo Efeito Hall interno e converte a força magnética em uma tensão contínua linear. No modelo de 20A, sem corrente (0A), a saída fica em Vcc/2 (2.5V) — cada Ampere soma ou subtrai 100 mV desse valor central.",
    pinos: [
      { nome: "VCC", desc: "Alimentação 5V DC estabilizada" },
      { nome: "OUT", desc: "Saída analógica linear centrada em Vcc/2 (2.5V a 0A)" },
      { nome: "GND", desc: "Terra / referência" },
      { nome: "IP+/IP-", desc: "Terminais de alta potência — passagem da corrente a ser medida" }
    ],
    specs: [
      { label: "Faixas de trabalho", value: "±5A, ±20A ou ±30A (dependendo da variante)" },
      { label: "Sensibilidade (20A)", value: "100 mV por Ampere medido" },
      { label: "Tensão de operação", value: "5V DC estabilizada (consumo ~10mA)" },
      { label: "Fabricante original", value: "Allegro MicroSystems" }
    ],
    aplicacoes: "Medição de consumo em quadros elétricos inteligentes, proteção de sobrecorrente em motores de indução trifásicos, monitoramento de geração de painéis solares fotovoltaicos e inversores industriais.",
    codigo: `// Medição de Corrente Contínua (DC) com ACS712 de 20A
const int pinACS712 = A2;
const float sensibilidade = 0.100;      // 100 mV/A para a versão de 20A
const float Vref_ZeroCorrente = 2.5;    // Vcc/2 (ideal)

void setup() {
  Serial.begin(9600);
}

void loop() {
  int adcValor = analogRead(pinACS712);
  float tensaoMedida = adcValor * (5.0 / 1023.0); // ADC -> Tensão real

  float corrente = (tensaoMedida - Vref_ZeroCorrente) / sensibilidade;

  Serial.print("Tensao do Sensor: "); Serial.print(tensaoMedida); Serial.print(" V | ");
  Serial.print("Corrente Real: "); Serial.print(corrente); Serial.println(" Amperes (A)");
  delay(1000);
}`,
    simulador: "acs712"
  },
  {
    id: "mfrc522",
    nome: "MFRC522",
    fabricante: "NXP Semiconductors",
    categoria: "rfid",
    categoriaLabel: "RFID",
    sinal: "spi",
    sinalLabel: "SPI",
    icone: "rfid",
    resumo: "Leitor/gravador de tags RFID de 13.56 MHz para controle de acesso e logística inteligente.",
    conceito: "O MFRC522 é um módulo digital de leitura e escrita de tags magnéticas sem fio de alta frequência (13.56 MHz), essencial para o controle de acesso de pessoal e logística inteligente de cargas.",
    principio: "Utiliza modulação e demodulação avançadas para métodos e protocolos passivos de comunicação de proximidade a 13.56 MHz. O módulo emite um campo de radiofrequência através de sua antena impressa. Quando uma tag passiva (com microbobina interna) entra neste campo, é energizada por acoplamento indutivo e responde modulando a impedância do sinal, transmitindo seu identificador único (UID) ao MFRC522 via barramento SPI.",
    pinos: [
      { nome: "SDA (SS)", desc: "Seleção do dispositivo no barramento SPI" },
      { nome: "SCK", desc: "Clock do barramento SPI" },
      { nome: "MOSI", desc: "Master Out Slave In — dados enviados ao módulo" },
      { nome: "MISO", desc: "Master In Slave Out — dados recebidos do módulo" },
      { nome: "RST", desc: "Reset do módulo" },
      { nome: "3.3V / GND", desc: "Alimentação 3.3V DC — atenção: não usar 5V direto na alimentação" }
    ],
    specs: [
      { label: "Frequência de operação", value: "13.56 MHz (bandas livres ISM industriais)" },
      { label: "Alcance de leitura", value: "Aproximadamente 3 a 5 cm (sem obstruções metálicas densas)" },
      { label: "Tensão operacional", value: "3.3V DC (pinos de sinal toleram 5V, mas alimentação deve ser 3.3V)" },
      { label: "Cartões suportados", value: "Mifare1 S50, Mifare1 S70, Mifare UltraLight, Mifare Pro" }
    ],
    aplicacoes: "Controle de ponto eletrônico de funcionários, rastreabilidade de caixas e paletes em esteiras logísticas automatizadas, bloqueio e liberação de acesso físico a salas de servidores e maquinários críticos.",
    codigo: `// Exemplo de Leitura de Chaveiro RFID usando a biblioteca MFRC522
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9
MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600);
  SPI.begin();       // Inicializa a comunicacao com barramento SPI
  rfid.PCD_Init();   // Inicializa a placa leitora MFRC522
  Serial.println("Leitor RFID MFRC522 Ativo. Aproxime a sua Tag...");
}

void loop() {
  if ( ! rfid.PICC_IsNewCardPresent() ) return;
  if ( ! rfid.PICC_ReadCardSerial() ) return;

  Serial.print("Código UID Identificado: ");
  for (byte i = 0; i < rfid.uid.size; i++) {
    Serial.print(rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(rfid.uid.uidByte[i], HEX);
  }
  Serial.println();
  rfid.PICC_HaltA(); // Para o loop de leitura da tag ativa atual
}`,
    simulador: "mfrc522"
  }
];
