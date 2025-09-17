export async function HandleGet<T>(
    url: string,
): Promise<T> {
    const options: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    let response: Response;

    try {
        response = await fetch(url, options);
    } catch (error) {
        throw new Error("server is offline");
    }

    const responseData = await response.json();

    if (!response.ok) {
        console.log(responseData.message);

        throw new Error(`failed to fetch data`);
    }

    return responseData.data;
}
