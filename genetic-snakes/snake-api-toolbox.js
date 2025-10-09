"use strict";

class ObservationType {
    static RawState = "RawState";
    static Dense32 = "Dense32";
    static Dense11 = "Dense11";
    static Dense28Ego = "Dense28Ego";
    static Raycasts19 = "Raycasts19";
}

Object.freeze(ObservationType);

class ActionNames {
    static Straight = 0;
    static TurnRight = 1;
    static TurnLeft = 2;
}

Object.freeze(ActionNames);

class SnakeApiV1 {

    static async spec() {
        const url = 'http://localhost:8080/v1/spec';
        const options = {
            method: 'GET',
            headers: {
                'accept': '*/*'
            }
        };
        return await this.fetchData(url, options);
    }

    static async reset(seed, obs_type) {
        const url = 'http://localhost:8080/v1/reset';
        const options = {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                "seed": seed,
                "obs_type": obs_type
            })
        };
        return await this.fetchData(url, options);
    }

    static async step(action) {
        const url = 'http://localhost:8080/v1/step';
        const options = {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                "action": action
            })
        };
        return await this.fetchData(url, options);
    }

    static async reset_many(actions, session) {
        const url = 'http://localhost:8080/v1/reset_many';
        const options = {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                "actions": actions,
                "session": session
            })
        };
        return await this.fetchData(url, options);
    }

    static async step_many(action) {
        const url = 'http://localhost:8080/v1/step_many';
        const options = {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                "action": action
            })
        };
        return await this.fetchData(url, options);
    }

    static async reset_combo(seed, obs_type) {
        const url = 'http://localhost:8080/v1/reset_combo';
        const options = {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                "seed": seed,
                "obs_type": obs_type
            })
        };
        return await this.fetchData(url, options);
    }

    static async step_combo(action) {
        const url = 'http://localhost:8080/v1/step_combo';
        const options = {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                "action": action
            })
        };
        return await this.fetchData(url, options);
    }

    static async reset_many_combo(seeds, obs_type, count, session) {
        const url = 'http://localhost:8080/v1/reset_many_combo';
        const options = {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                "seeds": seeds,
                "obs_type": obs_type,
                "count": count,
                "session": session
            })
        };
        return await this.fetchData(url, options);
    }

    static async step_many_combo(actions, session) {
        const url = 'http://localhost:8080/v1/step_many_combo';
        const options = {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                "actions": actions, // Array length must match number of games
                "session": session
            })
        };
        return await this.fetchData(url, options);
    }

    static async fetchData(url, options) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); 
            return data;
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    }
}

Object.freeze(SnakeApiV1);

export { ObservationType, ActionNames, SnakeApiV1 };