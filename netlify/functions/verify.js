exports.handler = async (event) => {
    // Энэ функц нь ихэвчлэн админ талын хүсэлтийг Firestore-д баталгаажуулахад ашиглагдана
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    };

    try {
        const body = JSON.parse(event.body);
        // Verify logic here (e.g., checking with Steam API if trade completed)
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Verification endpoint active", status: "ok" })
        };
    } catch (error) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Invalid request" })
        };
    }
};
