const http = require('http');
const { exec } = require('child_process');
const { URLSearchParams } = require('url');

const PORT = 9666;

const SSH_USER = process.env.SSH_USER || 'user';
const SSH_HOST = process.env.SSH_HOST || 'remoteserver';
const SSH_PASS = process.env.SSH_PASS || 'password';

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/flash/addcrypted2') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const params = new URLSearchParams(body);
            const curlDataArgs = [];
            for (const [key, value] of params) {
                curlDataArgs.push(`--data "${key}=${value}"`);
            }

            const curlCommand = `curl ${curlDataArgs.join(' ')} http://127.0.0.1:9666/flash/addcrypted2`;
            const sshCommand = `sshpass -p "${SSH_PASS}" ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST} "${curlCommand}"`;

            exec(sshCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    res.statusCode = 500;
                    res.end('Error');
                    return;
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                }
                console.log(`Stdout: ${stdout}`);
                res.statusCode = 200;
                res.end('OK');
            });
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});