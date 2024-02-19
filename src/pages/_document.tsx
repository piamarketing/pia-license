import theme from '@/lib/ui/horizon/theme/theme';
import { ColorModeScript } from '@chakra-ui/react';
import { Html, Head, Main, NextScript } from 'next/document';
import { themeExtended } from './_app';

export default function Document() {
	return (
		<Html lang="en">
			<Head />
			<body>
				<ColorModeScript
					initialColorMode={themeExtended.config.initialColorMode}
				/>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

// --
