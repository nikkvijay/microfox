import fs from "fs";
import path from "path";
import { MODE } from "./constants";

/**
 * Set environment variables in process.env
 * @param {string} functionDir - The directory of the function
 */
function setEnvironmentVariables(functionDir: string) {
    // Set mode-specific variables
    process.env.NODE_ENV = MODE.toLowerCase()
    process.env.STAGE = getStageFromMode(MODE)

    const envJson: Record<string, string> = {
        NODE_ENV: MODE,
        STAGE: getStageFromMode(MODE),
        MICROFOX_API_KEY: process.env.MICROFOX_API_KEY || "",
    }

    // write an env.json file in the same folder as serverless.yml
    const envFilePath = path.join(functionDir, 'env.json')
    fs.writeFileSync(envFilePath, JSON.stringify(envJson, null, 2))
}

/**
* Map environment mode to stage name
* @param {string} mode - The environment mode (PROD, STAGING, DEV, PREVIEW)
* @returns {string} - The stage name (prod, staging, dev, preview)
*/
function getStageFromMode(mode: string) {
    const stageMap = {
        PROD: 'prod',
        STAGING: 'staging',
        DEV: 'dev',
        PREVIEW: 'preview'
    }

    const stage = stageMap[mode as keyof typeof stageMap]
    if (!stage) {
        throw new Error(`Invalid mode: ${mode}`)
    }

    return stage
}

export {
    setEnvironmentVariables,
    getStageFromMode
}