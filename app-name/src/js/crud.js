export class CommonUtility {
    apiUrl = "http://localhost:8055/items/";
    async getData(endpoint) {
        return await fetch(this.apiUrl + endpoint);
    }

    async updateRecord(endpoint,item, recordId) {
        const config = {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        };

        return await fetch(
            this.apiUrl + endpoint + "/" + recordId,
            config
        );
    }

    async insertRecord(endpoint,item) {
        const config = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        };
        return await fetch(
            this.apiUrl + endpoint,
            config
        );
    }

}