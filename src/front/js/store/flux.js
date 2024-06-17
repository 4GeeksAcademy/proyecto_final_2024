const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			token: null,
            user: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]

		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			login: async (email, password) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "api/login", {
                        method: "POST",
                        body: JSON.stringify({
                            email: email,
                            password: password
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (response.status === 200) {
                        const data = await response.json();
                        localStorage.setItem("token", data.access_token);
                        setStore({ token: data.access_token, user: data.user });
                    } else {
                        console.error("Failed to login");
                    }
                } catch (error) {
                    console.error("Error logging in:", error);
                }
            },
            getUserData: async () => {
                const store = getStore();
                try {
                    const response = await fetch(process.env.BACKEND_URL + "api/private", {
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer " + store.token
                        }
                    });
                    if (response.status === 200) {
                        const data = await response.json();
                        setStore({ user: data.user });
                    } else {
                        console.error("Failed to fetch user data");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        }
    };
};

export default getState;
