import { ComponentProps } from 'react';
import { Button, ButtonProps, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function GlossaryOverlay({
  variant,
  str,
  description,
}: {
  variant: 'in-world' | 'cyoa';
  str: string;
  description: string;
}) {
  const renderTooltip = (props: ComponentProps<typeof Tooltip>) => (
    <Tooltip id="button-tooltip" {...props}>
      {description}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <span
        style={{
          textDecoration: 'underline dotted',
        }}
      >
        {str}
      </span>
    </OverlayTrigger>
  );
}
