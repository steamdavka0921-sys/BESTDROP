exports.handler = async (event) => {
    const params = event.queryStringParameters;
    // Steam-ээс ирсэн identity URL-г авах
    const identity = params['openid.claimed_id'];

    if (identity) {
        // URL-ын төгсгөлөөс SteamID64-ийг салгах
        const steamID = identity.split('/').pop();
        
        // Буцаад үндсэн сайт руу SteamID-г дамжуулж шилжүүлэх
        return {
            statusCode: 302,
            headers: {
                "Location": `/?steamid=${steamID}`,
                "Cache-Control": "no-cache"
            }
        };
    }

    return {
        statusCode: 400,
        body: JSON.stringify({ error: "Steam Authentication Failed" })
    };
};
