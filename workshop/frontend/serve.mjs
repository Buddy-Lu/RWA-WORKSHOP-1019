import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');let name=decodeURIComponent(url.pathname);if(name==='/')name='/index.html';
 const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
}catch{res.writeHead(404);res.end('Not found');}});
server.listen(4173,'127.0.0.1',()=>console.log('Open http://127.0.0.1:4173 — Ctrl+C to stop.'));
