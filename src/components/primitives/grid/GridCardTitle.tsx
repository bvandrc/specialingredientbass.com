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
    className="flex items-center justify-center relative top-0 m-2.5 p-2.5 font-[Roboto_Condensed] rounded-2xl bg-[darkslateblue] cursor-pointer hover:shadow-[0_0_10px_2px_cyan] hover:text-glow-[darkcyan]"
    role="button"
    tabIndex={0}
    aria-expanded={isOpen}
    onKeyDown={triggerClick}
    onClick={onClick}
  >
    <h2 id={id} className="my-0 mx-5 text-center text-2xl font-bold">
      {title}
    </h2>
    <Icon
      size="lg"
      icon={faCaretDown}
      className={classNames(
        'absolute right-2.5 transition-transform duration-200 ease-linear select-none',
        isOpen ? 'rotate-180' : 'rotate-0',
      )}
      aria-hidden
    />
  </div>
)
