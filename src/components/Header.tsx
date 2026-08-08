import {
  faFacebook,
  faInstagram,
  faReddit,
  faSoundcloud,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useCopyToClipboard } from 'usehooks-ts'
import { CircleLink } from './primitives/CircleLink'

const SOCIAL_LINK = classNames(
  'size-11 text-2xl', // general appearance
  '[background-image:linear-gradient(rgb(0_0_0/30%)_0_0)]', //dull the colors when not hovered
  'hover:[background-image:none] hover:shadow-[0_0_20px_yellow]', // full color on hover; yellow glow too
)

export const Header = () => {
  const [, copyToClipboard] = useCopyToClipboard()
  return (
    <header className="relative block w-full">
      <h1>
        <img
          data-testid="header-logo"
          src="/Logo Outlined.svg"
          alt="Special Ingredient Bass Mixes"
          width={480}
          height={261}
          className="block mx-auto p-2 w-auto h-auto max-h-45 lg:max-h-50 drop-shadow-[0_0_30px_purple]"
        />
      </h1>
      <div
        data-testid="header-bio-and-links"
        className="relative text-center lg:absolute lg:right-5 lg:bottom-0 lg:text-right"
      >
        <section
          aria-label="bio"
          className="my-2 text-gray-500 font-[Outfit] leading-5.25"
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
            className={classNames(SOCIAL_LINK, 'bg-soundcloud')}
            title="SoundCloud"
            icon={faSoundcloud}
            href="https://www.soundcloud.com/special-ingredient"
          />
          <CircleLink
            className={classNames(SOCIAL_LINK, 'bg-twitter')}
            title="Twitter"
            icon={faTwitter}
            href="https://www.twitter.com/dj_smoothbrain"
          />
          <CircleLink
            className={classNames(SOCIAL_LINK, 'bg-instagram')}
            title="Instagram"
            icon={faInstagram}
            href="https://www.instagram.com/special_ingredient_bass"
          />
          <CircleLink
            className={classNames(SOCIAL_LINK, 'bg-reddit')}
            title="Reddit"
            icon={faReddit}
            href="https://www.reddit.com/user/SpecialIngredient"
          />
          <CircleLink
            className={classNames(SOCIAL_LINK, 'bg-facebook')}
            title="Facebook"
            icon={faFacebook}
            href="https://www.facebook.com/profile.php?id=100087612335247"
          />
          <CircleLink
            className={classNames(SOCIAL_LINK, 'bg-slate-600')}
            title="Email"
            icon={faEnvelope}
            onClick={async () => {
              const EMAIL = 'SpecialIngredientBass@gmail.com'
              if (await copyToClipboard(EMAIL)) {
                alert(`Copied to clipboard: ${EMAIL}`)
              }
            }}
          />
        </div>
      </div>
    </header>
  )
}
