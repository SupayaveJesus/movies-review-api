import * as crypto from "crypto";

// Hash seguro SHA-256
export function hashPassword(str: string): string {
    return crypto.createHash("sha256").update(str).digest("hex");
}

// Generar un token interno usando SHA-256 también
export function generateAuthToken(salt: string): string {
    return crypto
        .createHash("sha256")
        .update(salt + Date.now().toString())
        .digest("hex");
}
