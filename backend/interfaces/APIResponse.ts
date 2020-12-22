import { APIError } from "./APIError";

export default interface APIResponse {
    success: boolean,
    payload?: any,
    error?: APIError,
    token?: string,
}