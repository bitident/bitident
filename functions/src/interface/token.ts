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
    signature?: string
}