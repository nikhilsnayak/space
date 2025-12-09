import NextLink from 'next/link';

import { Button } from './button';

export function LinkButton({
  children,
  href,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'nativeButton' | 'render'> &
  React.ComponentProps<typeof NextLink>) {
  return (
    <Button
      {...props}
      nativeButton={false}
      render={<NextLink href={href}>{children}</NextLink>}
    />
  );
}
