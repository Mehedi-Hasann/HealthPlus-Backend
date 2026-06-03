import fs from 'fs';
import dotenv from 'dotenv';

async function updateEnv() {
    try {
        const envConfig = dotenv.parse(fs.readFileSync('.env'));
        const envVars = Object.keys(envConfig).map(key => ({
            key: key,
            value: envConfig[key]
        }));

        const nodeEnvIndex = envVars.findIndex(v => v.key === 'NODE_ENV');
        if (nodeEnvIndex >= 0) envVars[nodeEnvIndex].value = 'production';
        else envVars.push({ key: 'NODE_ENV', value: 'production' });

        const finalEnvVars = envVars.map(ev => {
            if (ev.key === 'BETTER_AUTH_URL' || ev.key === 'APP_URL') {
                return { key: ev.key, value: "https://medistore-backend-z17i.onrender.com" };
            }
            return ev;
        });

        const updateResponse = await fetch(`https://api.render.com/v1/services/srv-d88vdlq8qa3s73dk2120/env-vars`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer rnd_bIfAe7N6mRxrw2gNBJqou37d3WJC",
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(finalEnvVars)
        });

        if (updateResponse.ok) {
            console.log("Successfully updated env vars.");
        } else {
            console.error("Failed to update env vars:", await updateResponse.json());
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

updateEnv();
