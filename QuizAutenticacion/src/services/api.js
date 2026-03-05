const BASE_URL = "http://localhost:3000";

const api = {
    /**
     * Fetch products or other resources (GET)
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("GET Error:", error);
            throw error;
        }
    },

    /**
     * Create a new resource (POST)
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("POST Error:", error);
            throw error;
        }
    },

    /**
     * Update a resource partially (PATCH)
     */
    async patch(endpoint, id, data) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("PATCH Error:", error);
            throw error;
        }
    },

    /**
     * Update a resource completely (PUT)
     */
    async put(endpoint, id, data) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("PUT Error:", error);
            throw error;
        }
    },

    /**
     * Delete a resource (DELETE)
     */
    async delete(endpoint, id) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return true;
        } catch (error) {
            console.error("DELETE Error:", error);
            throw error;
        }
    }
};

export default api;
