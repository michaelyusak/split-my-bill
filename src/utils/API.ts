async function HandleFetch<T>(url: string, options: RequestInit): Promise<T> {
    let response: Response;

    try {
        response = await fetch(url, options);
    } catch (error) {
        throw new Error("server is offline");
    }

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(`failed to fetch data`);
    }

    return responseData.data;
}

export async function HandleGet<T>(
    url: string,
): Promise<T> {
    const options: RequestInit = {
        method: "GET",
    };

    return HandleFetch<T>(url, options)
}

export async function HandlePost<T>(
    url: string,
    body: string | FormData,
): Promise<T> {
    const options: RequestInit = {
        method: "POST",
        body: body,
    };

    return HandleFetch<T>(url, options)
}

export async function HandlePatch<T>(
    url: string,
    body: string | FormData,
): Promise<T> {
    const options: RequestInit = {
        method: "PATCH",
        body: body,
    };

    return HandleFetch<T>(url, options)
}