const axios = require('axios');

exports.handler = async (event) => {
    const steamId = event.queryStringParameters.steamid;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET"
    };

    if (!steamId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "SteamID required" }) };
    }

    try {
        // Steam Inventory API - CS2 (730)
        const response = await axios.get(
            `https://steamcommunity.com/inventory/${steamId}/730/2?l=english&count=1000`
        );

        if (!response.data || !response.data.assets || !response.data.descriptions) {
            return { statusCode: 200, headers, body: JSON.stringify({ items: [] }) };
        }

        const assets = response.data.assets;
        const descriptions = response.data.descriptions;

        const items = assets.map(asset => {
            const desc = descriptions.find(d => d.classid === asset.classid);
            // Зөвхөн шууд шилжүүлж болох (tradable) зүйлсийг авна
            if (desc && desc.tradable === 1) {
                return {
                    assetid: asset.assetid,
                    name: desc.market_hash_name,
                    image: `https://community.cloudflare.steamstatic.com/public/images/econ/characters/${desc.icon_url}`,
                    rarity: desc.tags.find(t => t.category === "Rarity")?.name || "Consumer Grade"
                };
            }
            return null;
        }).filter(item => item !== null);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ items })
        };

    } catch (error) {
        console.error("Inventory Error:", error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Failed to fetch inventory. Profile might be private." })
        };
    }
};
