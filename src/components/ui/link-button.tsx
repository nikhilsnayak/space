import Link from 'next/link';

import { Button } from './button';

export function LinkButton<RouteType>({
  children,
  href,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'nativeButton' | 'render'> &
  React.ComponentProps<typeof Link<RouteType>>) {
  return (
    <Button
      {...props}
      nativeButton={false}
      render={<Link href={href}>{children}</Link>}
    />
  );
}
