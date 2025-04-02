function generateShortKey() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function publish(content: string, suffix: string) {
    const key = generateShortKey();
    try {
        const res = await fetch("https://note.linkof.link/set", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ value: content, key }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to publish:", errorText);
            throw new Error(`Failed to publish: ${res.status} ${res.statusText}`);
        }

        const url = `https://note.linkof.link/${key}${suffix}`;
        console.log("Published to:", url);
        return url;
    } catch (error) {
        console.error("Error publishing to tiny-server:", error);
        throw error;
    }
}

