import { ProjectHeader } from '../components/page-header/PageHeader';

import styled from 'styled-components';

import { Card, Typography } from '@equinor/eds-core-react';

import { User } from '@equinor/fusion-portal-react-components';
import { useNavigateOnContextChange, ProjectPortalInfoBox } from '@equinor/project-portal-common';

import { PortalContextSelector } from '../components/context/PortalContextSelector';
import { Allocations } from '../components/allocations/Allocations';
import { useFeature } from '@equinor/fusion-framework-react-app/feature-flag';

import { useFramework } from '@equinor/fusion-framework-react';

import { useQuery } from '@tanstack/react-query';
import { useAppModules } from '@equinor/fusion-framework-react-app';

export const Styles = {
    Wrapper: styled.main`
        display: flex;
        flex-direction: column;
    `,
    ContentWrapper: styled.div`
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `,
    Section: styled.span`
        width: 40vw;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    `,
    Content: styled.section`
        padding: 0rem 2rem;
        height: 100vh;
    `,
    Details: styled.div`
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        right: 5rem;
        top: -5rem;
        z-index: 1;
        width: 360px;
    `,
};

type Portal = {
    name: string;
    description: string;
    shortName: string;
};

const usePortals = () => {
    const modules = useAppModules();
    const client = modules.http.createClient('portal-client');

    return useQuery({
        queryKey: ['portal-list'],
        queryFn: async () => {
            try {
                const res = await client.fetch(`api/portals`);
                if (!res.ok) throw res;
                return (await res.json()) as Portal[];
            } catch (error) {
                console.error('Failed to fetch portals', error);
                return [] as Portal[];
            }
        },
    });
};

export const ProjectPortalPage = (): JSX.Element => {
    const { feature } = useFeature('project-prediction');
    const { data, error, isLoading } = usePortals();
    useNavigateOnContextChange();
    return (
        <Styles.Wrapper>
            <ProjectHeader>
                <Styles.Details>
                    <User />
                    <ProjectPortalInfoBox />
                </Styles.Details>
                <Styles.Content>
                    <Styles.ContentWrapper>
                        <Styles.Section>
                            <Typography>
                                Please choose a project or facility from the search field to
                                continue. This will direct you to the context's homepage, where you
                                can access the applications associated with the selected context
                                through the menu.
                            </Typography>
                        </Styles.Section>
                        <PortalContextSelector />
                    </Styles.ContentWrapper>
                    {feature?.enabled && <Allocations />}
                    <div>
                        {isLoading && <div>Loading...</div>}
                        {error && <div>Error: {error.message}</div>}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {data
                                ?.filter((p) => p.name.includes('ProCoSys'))
                                .sort((a, b) => (a.name > b.name ? -1 : 1))
                                .map((portal: any) => (
                                    <Card key={portal.id}>
                                        <a
                                            href={`https://${portal.shortName.toLowerCase()}-pcs5-demo-test.radix.equinor.com/`}
                                            style={{
                                                padding: '1rem',
                                                display: 'flex',
                                                gap: '1rem',
                                                height: '60px',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <div
                                                dangerouslySetInnerHTML={{ __html: portal.icon }}
                                            />
                                            <div>
                                                <Typography variant="h2">
                                                    {portal.shortName}
                                                </Typography>
                                                <Typography>{portal.description}</Typography>
                                            </div>
                                        </a>
                                    </Card>
                                ))}
                        </div>
                    </div>
                </Styles.Content>
            </ProjectHeader>
        </Styles.Wrapper>
    );
};
