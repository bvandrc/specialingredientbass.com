import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { triggerClick } from '../../../utils/html-utils'

export const GridCardTitle = ({
  title,
  isOpen,
  onClick,
  id,
}: {
  title: string
  isOpen: boolean
  onClick: React.MouseEventHandler<HTMLDivElement>
  id: string
}) => (
  // biome-ignore lint/a11y/useSemanticElements: is fine as Div
  <div
    className="card-title"
    role="button"
    tabIndex={0}
    aria-expanded={isOpen}
    onKeyDown={triggerClick}
    onClick={onClick}
  >
    <h2 id={id}>{title}</h2>
    <Icon
      size="lg"
      icon={faCaretDown}
      className={classNames('collapse-caret', { open: isOpen })}
      aria-hidden
    />
  </div>
)
