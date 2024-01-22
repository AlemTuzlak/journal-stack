import clsx from 'clsx'
import { Fragment, useEffect, useRef, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useRouteLoaderData,
} from '@remix-run/react'
import { ChevronDownIcon, RatioIcon, SearchIcon, XIcon } from 'lucide-react'
import { Menu, Transition } from '@headlessui/react'
import { useTransition, animated } from 'react-spring'

import { RemixPWAThemeSwitcher as ThemeSwitcher } from '~/components/ThemeSwitcher'
import { useSidebar } from '~/hooks/useSidebar'
import { useOnClickOutside } from '~/hooks/useOnClickOutside'

function Breadcrumb({
  section,
  setIsNavOpen,
  title,
}: {
  section: string
  title: string
  setIsNavOpen: (arg0: boolean) => void
}) {
  return (
    <Fragment>
      {/* {width <= 1024 && ( */}
      <div className="flex select-none items-center border-b border-slate-900/10 p-4 dark:border-slate-50/[0.06] lg:hidden">
        <button
          type="button"
          onClick={() => setIsNavOpen(true)}
          className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
        >
          <span className="sr-only">Open side menu</span>
          <svg width="24" height="24">
            <path
              d="M5 6h14M5 12h14M5 18h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {title && (
          <ol className="ml-4 flex min-w-0 whitespace-nowrap text-sm leading-6">
            {section && (
              <li className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                {section}
                <svg
                  width="3"
                  height="6"
                  aria-hidden="true"
                  className="mx-3 overflow-visible text-slate-400"
                >
                  <path
                    d="M0 0L3 3L0 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </li>
            )}
            <li className="truncate font-semibold text-slate-900 dark:text-slate-200">
              {title}
            </li>
          </ol>
        )}
      </div>
      {/* )} */}
    </Fragment>
  )
}

function MobileSidebar() {
  const { navIsOpen, setNavIsOpen } = useSidebar()
  const sideBartransitions = useTransition(navIsOpen, {
    from: { opacity: 0, transform: 'translateX(-100%)' },
    enter: { opacity: 1, transform: 'translateX(0%)' },
    leave: { opacity: 0, transform: 'translateX(-100%)' },
  })

  const sidebarRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(sidebarRef, () => {
    setNavIsOpen(false)
  })

  return sideBartransitions((style, item) =>
    // eslint-disable-next-line multiline-ternary
    item ? (
      <animated.div
        style={style}
        className={clsx(
          'fixed inset-0 left-0 top-0 z-[9999] h-screen w-screen items-start overflow-y-auto bg-slate-900/50 pr-10 backdrop-blur lg:hidden',
          navIsOpen ? 'flex' : 'hidden'
        )}
      >
        <div
          ref={sidebarRef}
          className="z-50 min-h-full w-80 max-w-xs bg-white px-4 pb-12 pt-5 dark:bg-slate-900 sm:px-6"
        >
          <div className="flex items-center">
            <button
              className="relative mr-6 focus:outline-none focus:ring-0"
              onClick={() => setNavIsOpen(true)}
            >
              <XIcon
                className="block h-6 w-6 stroke-2 text-slate-700 dark:text-sky-100"
                stroke="currentColor"
                aria-hidden="true"
                onClick={() => setNavIsOpen(true)}
              />
            </button>
            <Link to={'/'}>
              {/* <RemixLogo mobile /> */}
              <RatioIcon />
            </Link>
          </div>
          <nav className="mt-5 px-1 text-base lg:text-sm">
            <ul className="space-y-8">
              {/* {meta &&
                meta.map((el: MetaDataObject, i: number) => (
                  <NavItem key={`${i}-${el.name}`} {...el} />
                ))} */}
            </ul>
          </nav>
        </div>
      </animated.div>
    ) : null
  )
}

export default function Header({
  section,
  title,
}: {
  title: string
  section: string
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { setNavIsOpen } = useSidebar()
  const { versions } = useRouteLoaderData('root') as { versions: string[] }

  const [isOpaque, setIsOpaque] = useState(false)
  const [currentTag, setTag] = useState(location.pathname.split('/')[2])

  useEffect(() => {
    // Duplicate of sidebar provider
    setTag(location.pathname.split('/')[2])
  }, [location.pathname])

  useEffect(() => {
    const offset = 50

    function onScroll() {
      if (!isOpaque && window.scrollY > offset) {
        setIsOpaque(true)
      } else if (isOpaque && window.scrollY <= offset) {
        setIsOpaque(false)
      }
    }

    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [isOpaque])

  // useEffect(() => {
  //   if (width > 1024) {
  //     setClosed(true)
  //   }
  // }, [setClosed, width])

  // useEffect(() => {
  //   setNavIsOpen(false)
  // }, [location.pathname])

  return (
    <div
      className={clsx(
        'sticky top-0 z-40 w-full flex-none backdrop-blur dark:border-slate-50/[0.06] lg:z-50 lg:border-b lg:border-slate-900/10',
        isOpaque
          ? 'bg-white supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75'
          : 'bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent'
      )}
    >
      {/* --- Mobile Sidebar here --- */}
      <MobileSidebar />
      <div className="mx-auto max-w-8xl">
        <div
          className={
            'mx-4 border-b border-slate-900/10 py-2 dark:border-slate-300/10 md:py-3 lg:mx-0 lg:border-0 lg:px-8 lg:py-4'
          }
        >
          <div className="relative flex items-center">
            <Link
              aria-label="Home page"
              to="/"
              reloadDocument
              className="md:flex"
            >
              <span className="sr-only">Remix PWA home page</span>
              {/* <RemixLogo mobile height="h-10" width="w-11" />
            <RemixLogo height="h-10" width="w-11" /> */}
              <p className="relative hidden font-[Benzin] text-2xl font-bold text-slate-700 dark:text-sky-100 md:flex">
                Remix&nbsp;
                <span className="bg-gradient-to-tr from-indigo-500 to-sky-300 bg-clip-text text-transparent dark:from-indigo-400 dark:to-sky-200">
                  PWA
                </span>
              </p>
            </Link>
            <div className="relative ml-3">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="dark:highlight-white/5 flex items-center space-x-2 rounded-full bg-slate-400/10 px-3 py-1 text-sm font-semibold leading-5 text-slate-400 hover:bg-slate-400/20">
                    {currentTag}
                    <ChevronDownIcon
                      className="ml-2 h-3 w-3 stroke-slate-400 stroke-2"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="dark:highlight-white/5 absolute left-0 top-full mt-1 w-40 origin-top-left rounded-lg bg-white py-2 text-sm font-semibold leading-6 text-slate-700 shadow ring-1 ring-slate-900/5 dark:bg-slate-800 dark:text-slate-300">
                    {versions.map((version: string) => (
                      <Menu.Item
                        key={version}
                        disabled={currentTag === version}
                      >
                        {({ active }) => (
                          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                          <span
                            className={clsx(
                              currentTag === version
                                ? 'flex items-center justify-between px-3 py-1 text-sky-500 dark:text-sky-400'
                                : 'block px-3 py-1',
                              active &&
                                currentTag !== version &&
                                'cursor-pointer bg-slate-50 text-slate-900 dark:bg-slate-600/30 dark:text-white'
                            )}
                            onClick={() => navigate(`/docs/${version}`)}
                            role="button"
                            tabIndex={0}
                          >
                            {version}
                            {/* eslint-disable-next-line multiline-ternary */}
                            {currentTag === version ? (
                              <svg
                                width="24"
                                height="24"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="m7.75 12.75 2.25 2.5 6.25-6.5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : null}
                          </span>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <div className="relative flex flex-grow basis-0 justify-end gap-6 sm:gap-8">
              <div className="relative flex basis-0 content-center justify-end gap-6 sm:gap-6 md:flex-grow">
                <button type="button" className="flex h-6 w-6 lg:hidden">
                  <SearchIcon className="h-6 w-6 flex-none text-slate-400 group-hover:fill-slate-500 dark:text-slate-500 md:group-hover:text-slate-400" />
                  <span className="sr-only select-none">Search docs</span>
                </button>
                <div className="relative z-10">
                  <ThemeSwitcher />
                </div>
                <a
                  className="group"
                  aria-label="GitHub"
                  href="https://github.com/ShafSpecs/journal-stack"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Breadcrumb section={section} title={title} setIsNavOpen={setNavIsOpen} />
    </div>
  )
}
