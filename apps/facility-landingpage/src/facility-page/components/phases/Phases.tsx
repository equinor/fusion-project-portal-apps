import { Card, Typography } from '@equinor/eds-core-react';

import { useMemo } from 'react';
import { KpiCardItem } from './KpiItem';
import styled from 'styled-components';

import { DateObject, findActiveDate, isGetActiveDateColor, verifyDate } from './utils/date';
import { NoProjectInfoAccessMessage } from '../messages/NoProjectInfoAccessMessage';

import { tokens } from '@equinor/eds-tokens';

import { useFramework } from '@equinor/fusion-framework-react';
import { useQuery } from '@tanstack/react-query';

import { useRelationsByType, useCurrentContext } from '@equinor/fusion-portal-react-context';
import { OrgProject } from '@equinor/fusion-portal-react-utils';

export const useProjectDetails = (projectId?: string) => {
    const client = useFramework().modules.serviceDiscovery.createClient('org');

    return useQuery<OrgProject, Error>({
        queryKey: ['project ', projectId],
        queryFn: async () => {
            const response = await (await client).fetch(`projects/${projectId}`);

            if (response.status === 403) {
                const data = await response.json();
                throw new Error(data.error.message);
            }
            if (!response.ok) {
                throw Error('Error');
            }

            return await response.json();
        },
        enabled: Boolean(projectId),
        _defaulted: undefined,
    });
};

const Styles = {
    Content: styled(Card.Content).withConfig({ displayName: 'phase' })`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
    `,
};

export const FacilityProjectPhases = () => {
    const context = useCurrentContext();
    const { relations: projectMasters } = useRelationsByType('ProjectMaster', context?.id);

    if (projectMasters.length === 0) return null;

    return (
        <>
            {projectMasters.map((context) => {
                return (
                    <Phases key={context.id} projectMasterId={context.id} title={context.title} />
                );
            })}
        </>
    );
};

const Phases = (props: { projectMasterId: string; title: string }) => {
    const { relations: equinorTask } = useRelationsByType('OrgChart', props.projectMasterId);
    const { data, isLoading, error } = useProjectDetails(equinorTask[0]?.externalId);

    const current = useMemo(() => findActiveDate(data?.dates.gates as DateObject), [data]);

    if (equinorTask.length === 0) return null;

    return (
        <Card elevation="raised">
            <Card.Header>
                <Typography
                    as={'a'}
                    color={tokens.colors.interactive.primary__resting.hex}
                    title={props.title}
                    variant="h6"
                    href={`/facility/${props.projectMasterId}`}
                >
                    {props.title}
                </Typography>

                {data?.dates.startDate && data.dates.endDate ? (
                    <Typography variant="meta">
                        {verifyDate(data?.dates.startDate)} - {verifyDate(data?.dates.endDate)}
                    </Typography>
                ) : (
                    <Typography variant="meta">-</Typography>
                )}
            </Card.Header>

            {error ? (
                <NoProjectInfoAccessMessage />
            ) : (
                <Styles.Content>
                    <KpiCardItem
                        {...{
                            title: 'DG1',
                            value: verifyDate(data?.dates.gates.dG1),
                            color: isGetActiveDateColor(current, data?.dates.gates.dG1),
                            subTitle: 'Concept planning',
                            isLoading: isLoading,
                        }}
                    />
                    <KpiCardItem
                        {...{
                            title: 'DG2',
                            value: verifyDate(data?.dates.gates.dG2),
                            color: isGetActiveDateColor(current, data?.dates.gates.dG2),
                            subTitle: 'Definition',
                            isLoading: isLoading,
                        }}
                    />
                    <KpiCardItem
                        {...{
                            title: 'DG3',
                            value: verifyDate(data?.dates.gates.dG3),
                            color: isGetActiveDateColor(current, data?.dates.gates.dG3),
                            subTitle: 'Execution',
                            isLoading: isLoading,
                        }}
                    />
                    <KpiCardItem
                        {...{
                            title: 'DG4',
                            value: verifyDate(data?.dates.gates.dG4),
                            color: isGetActiveDateColor(current, data?.dates.gates.dG4),
                            subTitle: 'Operation',
                            isLoading: isLoading,
                        }}
                    />
                </Styles.Content>
            )}
        </Card>
    );
};
