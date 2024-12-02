import { ContextRelationNavigation } from '@equinor/project-portal-common';
import { WorkAssigned, Favorites } from '@equinor/fusion-portal-react-extensions';
import { Styles } from './FacilityPage';
import { FacilityProjectPhases } from './components/phases/Phases';

export const FacilityOverview = ({ openAllApps }: { openAllApps: () => void }) => {
    return (
        <Styles.Row>
            <Styles.Col>
                <ContextRelationNavigation title="Projects" path="project" type="ProjectMaster" />
                <WorkAssigned />
            </Styles.Col>
            <Styles.Col>
                <Favorites openAllApps={openAllApps} />
                <FacilityProjectPhases />
            </Styles.Col>
        </Styles.Row>
    );
};
