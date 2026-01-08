const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const path = require('path');
const fs = require('fs');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const tts = require('simple-tts-mp3');

// ================= CONFIG =================

// 🔒 NÚMEROS AUTORIZADOS (CAMBIA ESTO)
const authorizedNumbers = [
    '5215512345678@c.us' // tu número
];

const commandPrefix = '.';

// Mensajes
const farewellMessage = 'El bot se ha apagado temporalmente.';
const activationMessage = 'El bot está activo nuevamente.';

// Comandos
const activationCommand = 'encender';
const shutdownCommand = 'apagar';
const musicCommand = 'musica';
const ttsCommand = 'tts';

// Carpeta temporal
const tempFolder = path.join(__dirname, 'temp');

// Crear carpeta temp
if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder, { recursive: true });
}

// ================= CLIENT =================

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'railway-bot'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    }
});

// ================= STATE =================

let isActive = true;

// ================= EVENTS =================

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('📱 ESCANEA EL QR');
});

client.on('ready', () => {
    console.log('✅ BOT CONECTADO');
});

// ================= COMMAND LIST =================

const commands = {
    hola: 'Saludo',
    info: 'Info del bot',
    sayhi: 'Repite mensaje',
    ping: 'Latencia',
    help: 'Lista comandos',
    apagar: 'Apaga bot (admin)',
    encender: 'Enciende bot (admin)',
    musica: 'Descarga música',
    tts: 'Texto a voz'
};

// ================= MESSAGE HANDLER =================

client.on('message', async message => {
    if (!message.body.startsWith(commandPrefix)) return;

    const body = message.body.slice(1).trim();
    const [command, ...args] = body.split(/\s+/);

    if (!isActive && command !== activationCommand) {
        return message.reply('⛔ Bot apagado. Usa .encender');
    }

    switch (command) {

        case 'hola':
            return message.reply('👋 ¡Hola!');

        case 'info':
            return message.reply('🤖 Bot WhatsApp (Railway)');

        case 'sayhi':
            if (!args.length) return message.reply('❗ Escribe un mensaje');
            return message.reply(args.join(' '));

        case 'ping':
            const start = Date.now();
            await message.reply('🏓 Pong');
            return message.reply(`⏱ ${Date.now() - start} ms`);

        case 'help':
            let help = '📜 *Comandos:*\n\n';
            for (const c in commands) {
                help += `.${c} - ${commands[c]}\n`;
            }
            return message.reply(help);

        case shutdownCommand:
            if (!authorizedNumbers.includes(message.from)) {
                return message.reply('❌ Sin permisos');
            }
            isActive = false;
            return message.reply(farewellMessage);

        case activationCommand:
            if (!authorizedNumbers.includes(message.from)) {
                return message.reply('❌ Sin permisos');
            }
            isActive = true;
            return message.reply(activationMessage);

        case musicCommand:
            if (!args.length) {
                return message.reply('🎵 Nombre de la canción');
            }

            try {
                const search = await yts(args.join(' '));
                const video = search.videos[0];
                if (!video) return message.reply('❌ No encontrada');

                const safeName = video.title.replace(/[^\w\s]/gi, '');
                const filePath = path.join(tempFolder, `${safeName}.mp3`);

                const stream = ytdl(video.url, { filter: 'audioonly' });
                const write = fs.createWriteStream(filePath);

                stream.pipe(write);

                write.on('finish', async () => {
                    const media = MessageMedia.fromFilePath(filePath);
                    await message.reply(media);
                    fs.unlinkSync(filePath);
                });

            } catch (err) {
                console.error(err);
                message.reply('❌ Error descargando música');
            }
            break;

        case ttsCommand:
            if (!args.length) {
                return message.reply('🗣️ Texto requerido');
            }

            try {
                const audio = await tts.getAudioBuffer(args.join(' '), 'es');
                const ttsPath = path.join(tempFolder, 'tts.mp3');

                fs.writeFileSync(ttsPath, audio);
                const media = MessageMedia.fromFilePath(ttsPath);
                await message.reply(media);
                fs.unlinkSync(ttsPath);

            } catch (err) {
                console.error(err);
                message.reply('❌ Error en TTS');
            }
            break;

        default:
            message.reply('❓ Comando inválido. Usa .help');
    }
});

// ================= START =================

client.initialize();
