import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { triggerClick } from '../../../utils/html-utils'

export const GridCardTitle = ({
  title,
  isOpen,
  onClick,
  id,
  ref,
}: {
  title: string
  isOpen: boolean
  onClick: React.MouseEventHandler<HTMLDivElement>
  id: string
  ref: React.RefObject<HTMLDivElement>
}) => (
  // biome-ignore lint/a11y/useSemanticElements: is fine as Div
  <div
    className="card-title"
    role="button"
    tabIndex={0}
    aria-expanded={isOpen}
    onKeyDown={triggerClick}
    onClick={onClick}
    ref={ref}
  >
    <h2 id={id}>{title}</h2>
    <FontAwesomeIcon
      size="lg"
      icon={faCaretDown}
      className={classNames('collapse-caret', { open: isOpen })}
      aria-hidden
    />
  </div>
)
