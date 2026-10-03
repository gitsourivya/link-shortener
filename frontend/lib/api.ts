const API_URL = "http://localhost:8080";

function getToken(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem("token");
}

function getHeaders(): HeadersInit {
    const token = getToken();

    if (!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`,
    };
}


export async function createShortUrl(
    originalUrl: string,
    customAlias?: string,
    expirationDays?: number
) {

    const params = new URLSearchParams();

    params.append(
        "originalUrl",
        originalUrl
    );

    if (customAlias) {
        params.append(
            "customAlias",
            customAlias
        );
    }

    if (expirationDays) {
        params.append(
            "expirationDays",
            expirationDays.toString()
        );
    }

    const response = await fetch(
        `${API_URL}/api/links?${params.toString()}`,
        {
            method: "POST",
            headers: getHeaders(),
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json()
                .catch(() => null);

        throw new Error(
            errorData?.message ||
            "Failed to create short URL"
        );
    }

    return response.json();
}


export async function getAllLinks() {

    const response = await fetch(
        `${API_URL}/api/links`,
        {
            cache: "no-store",
            headers: getHeaders(),
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json()
                .catch(() => null);

        throw new Error(
            errorData?.message ||
            "Failed to fetch links"
        );
    }

    return response.json();
}


export async function getAnalytics(
    shortCode: string
) {

    const response = await fetch(
        `${API_URL}/api/links/${shortCode}/analytics`,
        {
            headers: getHeaders(),
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json()
                .catch(() => null);

        throw new Error(
            errorData?.message ||
            "Failed to fetch analytics"
        );
    }

    return response.json();
}


export async function deleteLink(
    shortCode: string
) {

    const response = await fetch(
        `${API_URL}/api/links/${shortCode}`,
        {
            method: "DELETE",
            headers: getHeaders(),
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json()
                .catch(() => null);

        throw new Error(
            errorData?.message ||
            "Failed to delete link"
        );
    }
}