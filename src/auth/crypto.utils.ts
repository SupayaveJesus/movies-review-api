import * as crypto from "crypto";

export const stringToSha1 = str => {
    const shasum = crypto.createHash("sha1");
    shasum.update(str);
    return shasum.digest("hex");
};
export const generateAuthToken = salt => {
    return stringToSha1(salt + new Date().getTime());
};
