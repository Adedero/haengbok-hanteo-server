"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpEmail = void 0;
const helpEmail = ({ name, email, subject, message }) => {
    return `
  <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{ subject }}</title><style>body{font-family:Arial,sans-serif;margin:0;padding:0;color:#333;background-color:#f9f9f9;line-height:1.6;display:grid;place-content:center}.container{width:80dvw;margin:20px auto;padding:20px;background-color:#fff;border:1px solid #ddd;border-radius:8px}.header{text-align:center;border-bottom:1px solid #eee;margin-bottom:20px;padding-bottom:10px}.header h1{font-size:20px;margin:0;color:#444}.content{padding:10px 0}.content p{margin:10px 0}.footer{margin-top:20px;text-align:center;font-size:12px;color:#777}</style></head><body><div class="container"><div class="header"><h1>${subject || "Help Request"}</h1></div><div class="content"><p><strong>Name: </strong>${name}</p><p><strong>Email: </strong>${email}</p><p><strong>Message: </strong></p><p>${message}</p></div><div class="footer"><p>This message was sent from your website's help page.</p></div></div></body></html>`;
};
exports.helpEmail = helpEmail;
