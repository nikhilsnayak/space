import NextLink from 'next/link';

import { Button } from './button';

export function LinkButton<RouteType>({
  children,
  href,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'nativeButton' | 'render'> &
  React.ComponentProps<typeof NextLink<RouteType>>) {
  return (
    <Button
      {...props}
      nativeButton={false}
      render={<NextLink href={href}>{children}</NextLink>}
    />
  );
}
