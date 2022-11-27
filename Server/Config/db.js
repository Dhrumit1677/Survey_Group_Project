"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secret =
    exports.HostName =
    exports.RemoteURI =
    exports.LocalURI =
    void 0;
// exports.LocalURI = "mongodb+srv://atiss:LbGnvmBQSqw8vaVf@cluster0.htmvx.mongodb.net/new_atiss?retryWrites=true&w=majority";
exports.LocalURI = "mongodb://127.0.0.1:27017/s";

exports.RemoteURI = process.env.RemoteURI;
exports.HostName = "MongoDB Atlas";
exports.Secret =
    process.env.SESSION_SECRET || "1af2ec08c869bdb42539bf93248ff528b742ff77";
//# sourceMappingURL=db.js.map