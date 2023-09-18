import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//console.log(__dirname)
export default __dirname;

export const createHash = async(password) => {
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salts);
}

export const validatePassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword); 

export async function validateLimit(limit) {
    try {
        let a = Number(limit);
        if (a > 0) {
            return a;
        } else {
            return 10;
        }
        
    } catch (error) {
        console.log("validLimit error: " + error);
        return 10;
    }
}

export async function validatePage(page) {
    try {
        let a = Number(page);
        if (a > 0) {
            return a;
        } else {
            return 1;
        }
        
    } catch (error) {
        console.log("validLimit error: " + error);
        return 1;
    }
}

export async function fileExists(email) {
  try {
    fs.accessSync(`/docs/profiles/${email}.jpg`, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}