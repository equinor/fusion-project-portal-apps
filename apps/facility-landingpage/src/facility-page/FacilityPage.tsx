import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

import { FacilityOverview } from './FacilityOverview';

import { useState } from 'react';
import { Tabs } from '@equinor/eds-core-react';

import { platform } from '@equinor/eds-icons';
import { FacilityDetails } from './components/FacilityDetails';
import {
    PageHeader,
    ProjectPortalInfoBox,
    useNavigateOnContextChange,
} from '@equinor/project-portal-common';
import { AllApps } from '@equinor/fusion-portal-react-extensions';
import { User } from '@equinor/fusion-portal-react-components';
import {
    ContextNotSupported,
    NoContext,
    useCurrentContext,
} from '@equinor/fusion-portal-react-context';
import { Facility } from './types';

export const Styles = {
    Wrapper: styled.main`
        display: flex;
        flex-direction: column;
        background: ${tokens.colors.ui.background__light.hex};
        height: 100%;
    `,
    Content: styled.section`
        overflow: auto;
        flex: 1;
    `,

    Details: styled.div`
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        right: 3rem;
        top: 5rem;
        z-index: 1;
        width: 360px;
    `,

    TabsWrapper: styled.div`
        display: flex;
        flex-direction: row;
        gap: ${tokens.spacings.comfortable.large};
        padding: 1rem 2rem;
        width: calc(100vw - 490px);
        @media only screen and (max-width: 1300px) {
            flex-direction: column;
        }
    `,
    Row: styled.div`
        display: flex;
        flex-direction: row;
        gap: ${tokens.spacings.comfortable.large};

        width: calc(100vw - 490px);
        @media only screen and (max-width: 1300px) {
            flex-direction: column;
        }
    `,
    Col: styled.div`
        gap: 1.5rem;
        display: flex;
        flex: 1;
        flex-direction: column;
        width: 50%;
        @media only screen and (max-width: 1300px) {
            width: 100%;
        }
    `,
    Relative: styled.div`
        position: relative;
    `,
};

const TABS = {
    overview: 0,
    'all-apps': 1,
};

const SEARCH_PARM_TAB = 'tab';

export const FacilityPage = () => {
    const { contextId } = useParams();
    useNavigateOnContextChange();
    const [_, setSearchparams] = useSearchParams();

    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (index: number) => {
        setActiveTab(index);
        setSearchparams({ [SEARCH_PARM_TAB]: Object.keys(TABS)[index] });
    };

    const currentContext = useCurrentContext<Facility>();

    if (
        !currentContext ||
        !contextId?.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/)
    ) {
        return <NoContext />;
    }

    if (currentContext.type.id !== 'Facility') {
        return <ContextNotSupported contexts={['Facility']} />;
    }

    return (
        <Styles.Wrapper>
            <Styles.Content>
                <Styles.Relative>
                    <Styles.Details>
                        <User />
                        <ProjectPortalInfoBox />
                    </Styles.Details>
                </Styles.Relative>
                <PageHeader<Facility>
                    icon={platform}
                    contextImageResolver={(context) => {
                        return context?.value.identity || '';
                    }}
                >
                    <FacilityDetails />
                </PageHeader>

                <Styles.TabsWrapper>
                    <Tabs activeTab={activeTab} onChange={handleChange}>
                        <Tabs.List>
                            <Tabs.Tab>Overview</Tabs.Tab>
                            <Tabs.Tab>All Apps</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panels>
                            <Tabs.Panel>
                                <FacilityOverview openAllApps={() => handleChange(1)} />{' '}
                            </Tabs.Panel>
                            <Tabs.Panel>
                                <AllApps />
                            </Tabs.Panel>
                        </Tabs.Panels>
                    </Tabs>
                </Styles.TabsWrapper>
            </Styles.Content>
        </Styles.Wrapper>
    );
};
