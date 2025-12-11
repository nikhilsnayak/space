import { createLink } from '@tanstack/react-router';

import { Button } from './button';
import type { LinkComponent } from '@tanstack/react-router';

function BaseLinkButton({
  children,
  href,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'nativeButton' | 'render'> &
  React.ComponentProps<'a'>) {
  return (
    <Button
      {...props}
      nativeButton={false}
      render={<a href={href}>{children}</a>}
    />
  );
}

const CreatedLinkButton = createLink(BaseLinkButton);

export const LinkButton: LinkComponent<typeof CreatedLinkButton> = (props) => {
  return <CreatedLinkButton {...props} />;
};
