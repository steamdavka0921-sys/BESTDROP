const axios = require('axios');

exports.handler = async (event) => {
    const { steamID } = event.queryStringParameters;

    if (!steamID) {
        return { statusCode: 400, body: "SteamID is required" };
    }

    try {
        // Steam API-аас CS2 (AppID: 730) инвентарь татах
        const url = `https://steamcommunity.com/inventory/${steamID}/730/2?l=english&count=100`;
        const response = await axios.get(url);

        if (!response.data || !response.data.descriptions) {
            return { statusCode: 404, body: JSON.stringify({ error: "Inventory not found or private" }) };
        }

        const items = response.data.descriptions.map(item => ({
            name: item.market_hash_name,
            img: `https://community.cloudflare.steamstatic.com/economy/image/${item.icon_url}`,
            color: item.name_color,
            tradable: item.tradable
        }));

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(items)
        };
    } catch (error) {
        console.error("Steam API Error:", error.message);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Failed to fetch inventory", message: error.message }) 
        };
    }
};
