export default interface UrlMetadataResponse {
    success: number,
    url: string,
    meta: {
        title: string,
        description: string,
        image: {
            url: string,
        },
    }
}