import {
  faFacebook,
  faInstagram,
  faReddit,
  faSoundcloud,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { CircleLink } from './primitives/CircleLink'

const SOCIAL_LINK = classNames(
  'size-11 text-2xl',
  '[background-image:linear-gradient(rgb(0_0_0/30%)_0_0)]',
  'hover:[background-image:none] hover:shadow-[0_0_20px_yellow]',
)

export const Header = () => {
  return (
    <header className="relative block w-full">
      <div id="header-center">
        <img
          src="/Logo Outlined.svg"
          alt="Special Ingredient Bass Mixes"
          className="block mx-auto p-2 drop-shadow-[0_0_30px_purple] max-h-[17vh] lg:max-h-[200px]"
        />
      </div>
      <div className="relative mx-auto text-center lg:absolute lg:right-5 lg:bottom-0 lg:text-right">
        <section
          aria-label="bio"
          className="my-2 text-gray-500 font-[Outfit,sans-serif] leading-5"
        >
          All forms of bass music 🌀
          <br />
          Tracklist in every mix 🎵
          <br />
          For your bike rides, hikes, walks, and long drives 🙃
          <br />
          Take a journey 🏕️
          <br />
          Denver based 🏔️ from Wisconsin 🧀
          <br />
          AKA DJ Smoothbrain 😉
        </section>
        {/** biome-ignore lint/a11y/useSemanticElements: is fine as Div */}
        <div
          role="group"
          aria-label="social links"
          className="flex justify-center items-center gap-1 lg:justify-end"
        >
          <CircleLink
            className={classNames(SOCIAL_LINK, 'soundcloud')}
            title="SoundCloud"
            icon={faSoundcloud}
            href="https://www.soundcloud.com/special-ingredient"
          />
          <CircleLink
            className={classNames(SOCIAL_LINK, 'twitter')}
            title="Twitter"
            icon={faTwitter}
            href="https://www.twitter.com/dj_smoothbrain"
          />
          <CircleLink
            className={classNames(SOCIAL_LINK, 'instagram')}
            title="Instagram"
            icon={faInstagram}
            href="https://www.instagram.com/special_ingredient_bass"
          />
          <CircleLink
            className={classNames(SOCIAL_LINK, 'reddit')}
            title="Reddit"
            icon={faReddit}
            href="https://www.reddit.com/user/SpecialIngredient"
          />
          <CircleLink
            className={classNames(SOCIAL_LINK, 'facebook')}
            title="Facebook"
            icon={faFacebook}
            href="https://www.facebook.com/profile.php?id=100087612335247"
          />
          <CircleLink
            className={classNames(SOCIAL_LINK, 'bg-slate-500')}
            title="Email"
            icon={faEnvelope}
            onClick={() => {
              const EMAIL = 'SpecialIngredientBass@gmail.com'
              navigator.clipboard.writeText(EMAIL)
              alert(`Copied to clipboard: ${EMAIL}`)
            }}
          />
        </div>
      </div>
    </header>
  )
}
