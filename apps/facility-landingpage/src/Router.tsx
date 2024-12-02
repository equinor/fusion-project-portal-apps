import { useMemo } from 'react';
import { RouteObject, RouterProvider } from 'react-router-dom';
import { useNavigationModule } from '@equinor/fusion-framework-react-app/navigation';
import { FacilityPage } from './facility-page/FacilityPage';

const routes: RouteObject[] = [
	{
		path: '/',
		element: <FacilityPage />,
		children: [
			{
				path: ':contextId/*',
				element: <FacilityPage />,
				errorElement: <div>ohh no..</div>,
			},
		],
		errorElement: <div>ohh no..</div>,
	},
];

export const AppRouter = () => {
	const navigation = useNavigationModule();
	const router = useMemo(() => navigation.createRouter(routes), []);
	return <RouterProvider router={router} />;
};
