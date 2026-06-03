import fs from 'fs';
import dotenv from 'dotenv';

async function deploy() {
    try {
        const envConfig = dotenv.parse(fs.readFileSync('.env'));
        
        const envVars = Object.keys(envConfig).map(key => ({
            key: key,
            value: envConfig[key]
        }));

        // Set NODE_ENV to production
        const nodeEnvIndex = envVars.findIndex(v => v.key === 'NODE_ENV');
        if (nodeEnvIndex >= 0) envVars[nodeEnvIndex].value = 'production';
        else envVars.push({ key: 'NODE_ENV', value: 'production' });

        const payload = {
            type: "web_service",
            name: "medistore-backend",
            ownerId: "tea-d30u822dbo4c73e34k20",
            repo: "https://github.com/Mehedi-Hasann/MediStore-Backend",
            autoDeploy: "yes",
            branch: "main",
            envVars: envVars,
            serviceDetails: {
                plan: "free",
                region: "oregon",
                env: "node",
                envSpecificDetails: {
                    buildCommand: "pnpm install && pnpm run build",
                    startCommand: "pnpm run db:migrate && pnpm start"
                }
            }
        };

        const response = await fetch("https://api.render.com/v1/services", {
            method: "POST",
            headers: {
                "Authorization": "Bearer rnd_bIfAe7N6mRxrw2gNBJqou37d3WJC",
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Failed to create service:", data);
            process.exit(1);
        }

        console.log("Service created successfully!");
        console.log("ID:", data.id);
        console.log("URL:", data.service.url);
        
        // Render gives us a URL, but the user's .env had BETTER_AUTH_URL and APP_URL.
        // We should update those env vars on the newly created service so the auth works correctly!
        const updateEnvVars = envVars.map(ev => {
            if (ev.key === 'BETTER_AUTH_URL' || ev.key === 'APP_URL') {
                return { key: ev.key, value: data.service.url };
            }
            return ev;
        });

        const updateResponse = await fetch(`https://api.render.com/v1/services/${data.id}/env-vars`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer rnd_bIfAe7N6mRxrw2gNBJqou37d3WJC",
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateEnvVars)
        });

        if (updateResponse.ok) {
            console.log("Successfully updated APP_URL and BETTER_AUTH_URL to the new live URL.");
        } else {
            console.error("Failed to update env vars:", await updateResponse.json());
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

deploy();
