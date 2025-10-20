import ping from 'ping';
import { Client } from 'ssh2';
import { exec } from 'child_process';
// sudo grub-reboot 4 && sudo reboot
function execute(command, callback) {
    exec(command, function (error, stdout, stderr) { callback(stdout); });
}
;
export const getStatus = async (_req, res) => {
    try {
        const IP = process.env.SERVER_IP ?? "nope";
        let serverState = 0;
        let msg = '';
        ping.sys.probe(IP, function (isAlive) {
            console.log(isAlive);
            if (isAlive) {
                msg = 'host ' + IP + ' is alive';
                res.status(200).send({ msg });
            }
            else {
                msg = 'host ' + IP + ' is dead';
                res.status(404).send({ msg });
            }
        });
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
};
export const shutdown = async (req, res) => {
    try {
        const OS = req.body.currentOS;
        const privateKeyPath = process.env.RSA_PRIVATE ?? "~/.ssh/rsa_id";
        const config = {
            host: process.env.SERVER_IP ?? 'hostname',
            port: Number(process.env.SERVER_PORT) ?? 22,
            username: process.env.USER ?? 'user',
        };
        switch (OS) {
            case "Linux":
                const conn = new Client();
                conn.on('ready', () => {
                    console.log('Successfully connected to server');
                    conn.exec('whoami', (err, stream) => {
                        if (err)
                            throw err;
                        // stream.on('close', (code: string, signal: string) => {
                        //   console.log('Stream :: close :: code: ' + code + ', signal: ' + signal)
                        //   conn.end()
                        // }).on('data', (data: string) => {
                        //   console.log('STDOUT: ' + data)
                        // }).stderr.on('data', (data) => {
                        //   console.log('STDERR: ' + data)
                        // })
                    });
                    conn.end();
                }).on('error', () => {
                    console.log('Error connecting to server');
                    res.status(200).send({ msg: "Error connecting to server" });
                    return;
                });
                conn.connect(config);
                break;
            case "Windows":
                break;
            default:
                console.log("Aucun OS de lancé");
                break;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
};
export const powerOn = async (_req, res) => {
    try {
        exec("wakeonlan A8:A1:59:9E:DD:87", function (error, stdout, stderr) {
            if (error) {
                // log and return if we encounter an error
                res.status(500).send({ error: "could not execute command: " + error });
                return;
            }
            if (stderr) {
                // log and return if we encounter an error
                res.status(500).send({ stderr: "stderr: " + stderr });
                return;
            }
            res.status(200).send({ msg: "Server started" });
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
};
