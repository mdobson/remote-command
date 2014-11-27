#! /usr/bin/env node

var Connection = require('ssh2');
var commander = require('commander');
var conn = new Connection();

function getHostname() {
  remoteCommand('hostname');
}

function remoteCommand(command) {
  conn.on('ready', function() {
    console.log('Connection ------> Ready');
    console.log('Running remote command...');
    console.log('$> ' + command);
    conn.exec(command, function(err, stream) {
      if(err) throw err;
      stream.on('exit', function(code, signal) {
        console.log('Stream exited...');
      }).on('close', function() {
        console.log('Stream closed...');
        process.exit(1);
      }).on('data', function(data) {
        console.log(data.toString());
      }).stderr.on('data', function(data) {
        console.log('STDERR ------> ' + data);
      });
    });
  });
}

var host = '192.168.7.2';
var port = 22;
var user = 'root';
function connect(host, port, user) {

  console.log('Connecting to ' + user + '@' + host + ':' + port);
  conn
    .connect({
      host: host,
      port: port,
      username: user
    });
}

commander
  .version('0.0.1')
  .option('-h, --host [value]', 'hostname')
  .option('-p, --port [value]', 'port number')
  .option('-u, --username [value]', 'username');

commander
  .command('hostname')
  .description('Print beaglebone hostname')
  .action(function() {
    var hostname = commander.hostname ? commander.hostame : host;
    var portNumber = commander.port ? commander.port : port;
    var username = commander.username ? commander.username : user;

    getHostname();
    connect(hostname, portNumber, username);
  });

commander
  .command('command [command]')
  .description('Run a remote command on the beaglebone')
  .action(function(command) {
    var hostname = commander.hostname ? commander.hostame : host;
    var portNumber = commander.port ? commander.port : port;
    var username = commander.username ? commander.username : user;
    
    remoteCommand(command);
    connect(hostname, portNumber, username);

  });

commander  
  .parse(process.argv);


