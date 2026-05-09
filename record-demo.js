/**
 * Zero Clicks — Demo Video Recorder
 *
 * SETUP (one-time):
 *   brew install ffmpeg
 *   npm install puppeteer --save-dev
 *
 * RUN:
 *   node record-demo.js               → landscape 1280x800  (email / Loom)
 *   node record-demo.js --instagram   → portrait  1080x1920 (Instagram Reels)
 *   node record-demo.js --square      → square    1080x1080 (Instagram Feed / email thumb)
 *
 * OUTPUT:
 *   exports/zero-clicks-demo.mp4          (landscape)
 *   exports/zero-clicks-instagram.mp4     (portrait)
 *   exports/zero-clicks-square.mp4        (square)
 */

const puppeteer    = require('puppeteer');
const { execFileSync } = require('child_process');
const path         = require('path');
const fs           = require('fs');

// ── Format presets ──────────────────────────────────────────────────────────
const FORMATS = {
    landscape: {
        // Wider viewport — fixes bottom cutoff on tall scenes
        viewport:  { width: 1280, height: 900, deviceScaleFactor: 1 },
        // ffmpeg: pad to standard 16:9 with black bars if needed
        ffmpegScale: ['scale=1280:720:force_original_aspect_ratio=decrease',
                      'pad=1280:720:(ow-iw)/2:(oh-ih)/2:black'].join(','),
        outFile:   'zero-clicks-demo.mp4',
        label:     'Landscape 1280×720 (email / Loom)',
    },
    instagram: {
        // iPhone viewport — triggers mobile CSS breakpoints
        viewport:  { width: 390, height: 844, deviceScaleFactor: 3 },
        // ffmpeg: scale up to 1080×1920 with letterbox if needed
        ffmpegScale: ['scale=1080:1920:force_original_aspect_ratio=decrease',
                      'pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black'].join(','),
        outFile:   'zero-clicks-instagram.mp4',
        label:     'Portrait 1080×1920 (Instagram Reels)',
    },
    square: {
        // Square viewport — works at 560px breakpoint
        viewport:  { width: 540, height: 540, deviceScaleFactor: 2 },
        // ffmpeg: scale to 1080×1080
        ffmpegScale: ['scale=1080:1080:force_original_aspect_ratio=decrease',
                      'pad=1080:1080:(ow-iw)/2:(oh-ih)/2:black'].join(','),
        outFile:   'zero-clicks-square.mp4',
        label:     'Square 1080×1080 (Instagram Feed / email thumb)',
    },
};

// ── Parse args ───────────────────────────────────────────────────────────────
const arg    = process.argv[2] || '';
const format = arg === '--instagram' ? 'instagram'
             : arg === '--square'    ? 'square'
             :                        'landscape';

const preset     = FORMATS[format];
const DEMO_FILE  = path.resolve(__dirname, 'loom-demo.html');
const EXPORTS    = path.resolve(__dirname, 'exports');
const WEBM_OUT   = path.join(EXPORTS, 'demo-raw.webm');
const MP4_OUT    = path.join(EXPORTS, preset.outFile);

// Scene dwells match loom-demo.html DWELLS = [4400,5400,6200,4000,7200,5000]
// + 800ms start delay + 3s buffer = 36s
const RECORD_MS = 36000;

// ────────────────────────────────────────────────────────────────────────────

async function record() {
    fs.mkdirSync(EXPORTS, { recursive: true });
    if (fs.existsSync(WEBM_OUT)) fs.unlinkSync(WEBM_OUT);
    if (fs.existsSync(MP4_OUT))  fs.unlinkSync(MP4_OUT);

    console.log('\n Zero Clicks — Demo Recorder');
    console.log('────────────────────────────────');
    console.log(`Format  : ${preset.label}`);
    console.log(`Duration: ${RECORD_MS / 1000}s`);
    console.log(`Output  : ${MP4_OUT}\n`);

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--allow-file-access-from-files',
            '--disable-web-security',
            '--autoplay-policy=no-user-gesture-required',
            `--window-size=${preset.viewport.width},${preset.viewport.height}`,
        ],
    });

    const page = await browser.newPage();
    await page.setViewport(preset.viewport);

    const fileUrl = `file://${DEMO_FILE}?record=1`;
    console.log('Loading:', fileUrl);
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    console.log('Waiting for fonts...');
    await new Promise(r => setTimeout(r, 1500));

    console.log('Recording...');
    const recorder = await page.screencast({ path: WEBM_OUT });
    await new Promise(r => setTimeout(r, RECORD_MS));
    await recorder.stop();
    await browser.close();

    const rawMB = (fs.statSync(WEBM_OUT).size / 1024 / 1024).toFixed(1);
    console.log(`WebM saved (${rawMB} MB) — converting...`);

    execFileSync('ffmpeg', [
        '-y',
        '-i',        WEBM_OUT,
        '-vf',       preset.ffmpegScale,
        '-c:v',      'libx264',
        '-pix_fmt',  'yuv420p',
        '-crf',      '18',
        '-preset',   'fast',
        '-movflags', '+faststart',
        MP4_OUT,
    ], { stdio: 'inherit' });

    const mp4MB = (fs.statSync(MP4_OUT).size / 1024 / 1024).toFixed(1);
    fs.unlinkSync(WEBM_OUT);

    console.log('\nDone!');
    console.log(`File : ${MP4_OUT}`);
    console.log(`Size : ${mp4MB} MB\n`);
}

record().catch(err => {
    console.error('\nError:', err.message);
    if (err.message.includes('Cannot find module')) {
        console.error('Run:  npm install puppeteer --save-dev\n');
    }
    if (err.message.includes('ENOENT') && !err.message.includes('puppeteer')) {
        console.error('Run:  brew install ffmpeg\n');
    }
    process.exit(1);
});
