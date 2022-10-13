const statsigMetadata = {
    sdkType: "statsig-unleash-connector",
    sdkVersion: "0.1.0",
}

const statsigConnector = {
    initialize: function(clientKey) {
        statsigConnector._clientKey = clientKey;
        statsigConnector._dedupeKeys = {};
    },

    logExposure: function(toggle, userID, enabled) {
        const dedupeKey = `${toggle}:${userID}:${enabled}`;
        if (statsigConnector._dedupeKeys[dedupeKey]) {
            return;
        } else {
            statsigConnector._dedupeKeys[dedupeKey] = true;
        }

        const body = {
            events: [
                {
                    eventName: "statsig::gate_exposure",
                    time: Date.now(),
                    user: { userID },
                    metadata: {
                        gate: toggle,
                        gateValue: String(enabled),
                    }
                }
            ],
            statsigMetadata: statsigMetadata,
        };

        logEvent(body);
    },

    logEvent: function(eventName, userID, value = null, metadata = null) {
        const body = {
            events: [
                {
                    eventName,
                    value,
                    metadata,
                    time: Date.now(),
                    user: { userID }
                }
            ],
            statsigMetadata: statsigMetadata,
        };
        logEvent(body);
    },

    _logEvent: async function(body) {
        const params = {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "STATSIG-API-KEY": statsigConnector._clientKey,
                "STATSIG-CLIENT-TIME": Date.now() + ""
            }
        };
        await fetch("https://events.statsigapi.net/v1/rgstr", params);
    }
}

export default statsigConnector;