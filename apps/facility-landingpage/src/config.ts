import type { AppModuleInitiator } from '@equinor/fusion-framework-react-app';
import { enableContext } from '@equinor/fusion-framework-module-context';
import { enableFeatureFlagging } from '@equinor/fusion-framework-module-feature-flag';
import { createLocalStoragePlugin } from '@equinor/fusion-framework-module-feature-flag/plugins';
import { enableNavigation } from '@equinor/fusion-framework-module-navigation';
import { enablePortalMenu } from '@equinor/fusion-portal-module-menu';
import { enablePortalAppConfig, IPortal } from '@equinor/fusion-portal-module-app-config';

interface Client {
    baseUri: string;
    defaultScopes: string[];
}

interface Environment {
    portalClient: Client;
    ccApiClient: Client;
}

export const configure: AppModuleInitiator = (configurator, { env }) => {
    const { basename, config } = env;
    const environment = config?.environment as Environment | undefined;

    if (!environment) {
        throw new Error('Failed to load environment config for facility-landingpage');
    }
    enablePortalMenu(configurator);
    enableNavigation(configurator, basename);
    enableContext(configurator, (builder) => {
        builder.setContextType(['Facility']);
    });

    configurator.configureHttpClient('portal-client', environment.portalClient);
    configurator.configureHttpClient('query_api', {
        baseUri: 'https://query-api-ci.azurewebsites.net',
        defaultScopes: ['9f12661e-a8cf-4942-8fba-e304e2c16447/.default'],
    });

    configurator.configureHttpClient('cc-api', {
        baseUri: environment.ccApiClient.baseUri,
        defaultScopes: environment.ccApiClient.defaultScopes,
    });

    enablePortalAppConfig(configurator, (builder) => {
        builder.selPortalConfig(async (arg) => {
            const ref = arg.ref as { portalConfig?: { current: IPortal } };
            if (ref.portalConfig) {
                return ref.portalConfig.current.portalAppConfig;
            } else {
                return { id: 'cli', contextTypes: [{ type: 'ProjectMaster' }], env: 'ci' };
            }
        });
    });

    enableFeatureFlagging(configurator, (builder) => {
        builder.addPlugin(
            createLocalStoragePlugin([
                {
                    key: 'cc-tab',
                    title: 'New Construction and Commissioning Tab',
                    description:
                        'When enabled you will be able to tryout the new CC tab on project page',
                },
            ]),
        );
    });
};

export default configure;
