export interface Token {
    type: string
    version: number
    source: string
    time: number
    timeout: number
    callback: string
    target: string
    network: string
    message?: string
    sourceSignature?: string
    targetSignature?: string
}