const axios = require('axios');

exports.handler = async (event) => {
    const steamId = event.queryStringParameters.steamid;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    };

    if (!steamId) return { statusCode: 400, headers, body: JSON.stringify({ error: "No ID" }) };

    try {
        const response = await axios.get(`https://steamcommunity.com/inventory/${steamId}/730/2?l=english&count=1000`);
        
        if (!response.data || !response.data.assets) {
            return { statusCode: 200, headers, body: JSON.stringify({ items: [] }) };
        }

        const assets = response.data.assets;
        const descriptions = response.data.descriptions;

        const items = assets.map(asset => {
            const desc = descriptions.find(d => d.classid === asset.classid);
            if (desc && desc.tradable === 1) {
                // Зургийн URL-г 2 янзаар шалгах
                const imgHash = desc.icon_url_large || desc.icon_url;
                return {
                    assetid: asset.assetid,
                    name: desc.market_hash_name,
                    image: `https://community.cloudflare.steamstatic.com/public/images/econ/characters/${imgHash}`,
                    rarity: desc.tags.find(t => t.category === "Rarity")?.name || "Normal"
                };
            }
            return null;
        }).filter(i => i !== null);

        return { statusCode: 200, headers, body: JSON.stringify({ items }) };
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: "Private Inventory" }) };
    }
};
