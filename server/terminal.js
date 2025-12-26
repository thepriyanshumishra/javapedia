const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    let javaProcess = null;

    socket.on('run', (code) => {
        // Kill existing process if any
        if (javaProcess) {
            try {
                javaProcess.kill();
            } catch (e) { }
        }

        const sessionId = socket.id;
        const sessionDir = path.join(TEMP_DIR, sessionId);

        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true });
        }

        const filePath = path.join(sessionDir, 'Main.java');
        fs.writeFileSync(filePath, code);

        // Absolute paths
        const JAVAC_PATH = '/Library/Java/JavaVirtualMachines/jdk-25.jdk/Contents/Home/bin/javac';
        const JAVA_PATH = '/Library/Java/JavaVirtualMachines/jdk-25.jdk/Contents/Home/bin/java';

        // Compile
        const compileProcess = spawn(JAVAC_PATH, [filePath], {
            cwd: sessionDir,
            env: process.env
        });

        let compileOutput = "";

        compileProcess.stdout.on('data', (data) => {
            compileOutput += data.toString();
            socket.emit('output', data.toString().replace(/\n/g, '\r\n'));
        });

        compileProcess.stderr.on('data', (data) => {
            compileOutput += data.toString();
            socket.emit('output', data.toString().replace(/\n/g, '\r\n'));
        });

        compileProcess.on('close', (code) => {
            if (code === 0) {
                socket.emit('output', '\r\n\x1b[32mCompilation successful. Running...\x1b[0m\r\n\r\n');

                // Run Java program
                javaProcess = spawn(JAVA_PATH, ['-cp', sessionDir, 'Main'], {
                    cwd: sessionDir,
                    env: process.env
                });

                javaProcess.stdout.on('data', (data) => {
                    socket.emit('output', data.toString().replace(/\n/g, '\r\n'));
                });

                javaProcess.stderr.on('data', (data) => {
                    socket.emit('output', data.toString().replace(/\n/g, '\r\n'));
                });

                javaProcess.on('close', (code) => {
                    socket.emit('output', `\r\n\x1b[33mProgram exited with code ${code}\x1b[0m\r\n`);
                    javaProcess = null;
                });
            } else {
                socket.emit('output', `\r\n\x1b[31mCompilation failed.\x1b[0m\r\n`);
            }
        });
    });

    // Line buffer for editing support
    let currentLine = "";

    socket.on('input', (data) => {
        if (javaProcess && javaProcess.stdin) {
            try {
                // Handle character by character to support editing
                for (let i = 0; i < data.length; i++) {
                    const char = data[i];

                    if (char === '\r') { // Enter
                        // Send line to Java process
                        javaProcess.stdin.write(currentLine + '\n');
                        // Echo newline to terminal
                        socket.emit('output', '\r\n');
                        // Clear buffer
                        currentLine = "";
                    } else if (char === '\u007f') { // Backspace
                        if (currentLine.length > 0) {
                            // Remove last char from buffer
                            currentLine = currentLine.slice(0, -1);
                            // Visual backspace: move back, print space, move back
                            socket.emit('output', '\b \b');
                        }
                    } else if (char === '\u0003') { // Ctrl+C
                        // Kill process
                        if (javaProcess) javaProcess.kill();
                    } else {
                        // Normal character
                        currentLine += char;
                        socket.emit('output', char);
                    }
                }
            } catch (e) {
                console.error('Write failed:', e);
            }
        }
    });

    socket.on('resize', () => {
        // Child process doesn't support resize, ignore
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        if (javaProcess) {
            try {
                javaProcess.kill();
            } catch (e) { }
        }
        // Cleanup temp files
        const sessionDir = path.join(TEMP_DIR, socket.id);
        if (fs.existsSync(sessionDir)) {
            fs.rmSync(sessionDir, { recursive: true, force: true });
        }
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Terminal server running on port ${PORT}`);
});
