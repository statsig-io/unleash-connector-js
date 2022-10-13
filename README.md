Small package that helps connecting impression data from Unleash to Statsig to power analytics for feature toggles. Follow the steps below to enable data analytics for your feature toggles:

1. Sign up for a Statsig account at http://www.statsig.com/signup. It's free to sign up and we will credit your account with 5 million free events each month.

2. Create your feature toggle in Unleash, and make sure to follow the guide [here](https://docs.getunleash.io/advanced/impression-data#enabling-impression-data) to enable impression data.

3. Install the [`statsig-unleash-connector`](https://www.npmjs.com/package/statsig-unleash-connector) npm package, and log your Unleash impression data to Statsig using the connector:

```
import statsigConnector from 'statsig-unleash-connector';

// Initialize the connector on page load with your Statsig client key, which
// you can find the Statsig client API key under your Statsig project's settings.
statsigConnector.initialize('<STATSIG-CLIENT-API-KEY>');

const unleash = new UnleashClient({
  ...
  impressionDataAll: true, // make sure to use a version of the unleash SDK that supports this option
});

unleash.on('impression', (event) => {
  // Capture the event here and log to Statsig
  statsigConnector.logExposure(event.featureName, event.context.userId, event.enabled);
});

```

4. Add a gradual rollout strategy to your feature toggle and choose a %, e.g. 25%.

5. Create a feature gate in your Statsig project ([guide](https://docs.statsig.com/guides/first-feature)), and make sure to give it the exact same name as your feature toggle in Unleash. Then create a rule with an "Everyone" condition and open it to the same % in step #4, i.e. 25% in this example.

6. Log any analytics events that you'd like to see lifts for in your feature toggles using the `logEvent` API in the connector. For example, if you care about sign ups, then you should log a "sign_up" event with the API whenever someone signs up on your website. Then for any feature toggle you are logging impression data to Statsig with this method, you will see how does your feature affect sign ups for users who have the feature comparing to those who do not.