#!/usr/bin/env node

const net = require('net');
const { spawn } = require('child_process');

const startPort = parseInt(process.env.PORT, 10) || 3000;
const maxPort = startPort + 100;

function checkPort(port) {
    return new Promise((resolve, reject) => {
        const server = net.createServer()
            .once('error', err => {
                if (err.code === 'EADDRINUSE' || err.code === 'EACCES') resolve(false);
                else reject(err);
            })
            .once('listening', () => {
                server.close(() => resolve(true));
            })
            .listen(port, '::');
    });
}

(async () => {
    for (let p = startPort; p <= maxPort; p++) {
        try {
            const ok = await checkPort(p);
            if (ok) {
                console.log(`✅ Selected port ${p} (starting from ${startPort})`);
                // Prefer invoking Next with the local Node resolution so this works without `npx` on all platforms
                const path = require('path');
                const fs = require('fs');
                let execCommand, execArgs;
                try {
                    const nextBin = require.resolve('next/dist/bin/next');
                    execCommand = process.execPath; // node
                    execArgs = [nextBin, 'start', '-p', String(p)];
                } catch (err) {
                    const local = path.join(process.cwd(), 'node_modules', '.bin', 'next' + (process.platform === 'win32' ? '.cmd' : ''));
                    if (fs.existsSync(local)) {
                        execCommand = local;
                        execArgs = ['start', '-p', String(p)];
                    } else {
                        execCommand = 'npx';
                        execArgs = ['next', 'start', '-p', String(p)];
                    }
                }

                const proc = spawn(execCommand, execArgs, { stdio: 'inherit', env: { ...process.env, PORT: String(p) } });
                proc.on('exit', code => process.exit(code));
                proc.on('error', err => {
                    console.error('Failed to start Next:', err);
                    process.exit(1);
                });
                return;
            }
        } catch (err) {
            console.error('Error checking port', p, err);
        }
    }
    console.error(`No free port found in range ${startPort}-${maxPort}.`);
    process.exit(1);
})();
