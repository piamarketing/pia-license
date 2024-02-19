import '@/lib/ui/horizon/assets/css/App.css';
import '@/styles/globals.css';
import 'react-phone-input-2/lib/bootstrap.css';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import theme from '@/lib/ui/horizon/theme/theme';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { MultiSelectTheme } from 'chakra-multiselect';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const themeExtended = extendTheme({
	...theme,
	components: {
		...theme.components,
		MultiSelect: MultiSelectTheme,
		Modal: {
			baseStyle: {
				container: {
					minWidth: '100%',
				},
			},
		},
	},
	config: {
		...theme.config,
	},
});

function App({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient();
	return (
		<SessionProvider
			// Provider options are not required but can be useful in situations where
			// you have a short session maxAge time. Shown here with default values.
			// @ts-ignore
			options={{
				// Stale Time controls how often the useSession in the client should
				// contact the server to sync the session state. Value in seconds.
				// e.g.
				// * 0  - Disabled (always use cache value)
				// * 60 - Sync session state with server if it's older than 60 seconds
				staleTime: 0,
				// Refetch Interval tells windows / tabs that are signed in to keep sending
				// a keep alive request (which extends the current session expiry) to
				// prevent sessions in open windows from expiring. Value in seconds.
				//
				// Note: If a session has expired when keep alive is triggered, all open
				// windows / tabs will be updated to reflect the user is signed out.
				refetchInterval: 0,
			}}
			session={pageProps.session}
		>
			<QueryClientProvider client={queryClient}>
				<ChakraProvider theme={themeExtended}>
					<ProSidebarProvider>
						<Component {...pageProps} />
					</ProSidebarProvider>
				</ChakraProvider>
			</QueryClientProvider>
		</SessionProvider>
	);
}

export default appWithTranslation(App);
