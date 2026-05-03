import './index.css';

import { useVersion } from '@rspress/core/runtime';
import {
  HomeLayout as BasicHomeLayout,
  NotFoundLayout as BasicNotFoundLayout,
  getCustomMDXComponent as basicGetCustomMDXComponent,
} from '@rspress/core/theme-original';
import { useEffect, useRef } from 'react';

const GUIDE_SECTION_NAMES = new Set(['getting-started', 'usage']);

function getGuideRedirectPath(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  const prefix: string[] = [];
  let rest = parts;

  if (rest[0] === '1.x') {
    prefix.push(rest[0]);
    rest = rest.slice(1);
  }

  if (rest[0] === 'ko') {
    prefix.push(rest[0]);
    rest = rest.slice(1);
  }

  const [section] = rest;

  if (section && (GUIDE_SECTION_NAMES.has(section) || section.startsWith('migration-from-1.x'))) {
    return `/${[...prefix, 'guide', ...rest].join('/')}`;
  }

  return null;
}

function HomeLayout() {
  const version = useVersion();
  const { pre: PreWithCodeButtonGroup, code: Code } = basicGetCustomMDXComponent();
  const copyElementRef = useRef<HTMLDivElement>(null);

  return (
    <BasicHomeLayout
      afterHeroActions={
        <div
          className="rspress-doc custom-code"
          style={{ minHeight: 'auto', width: '100%', maxWidth: 500 }}
        >
          <PreWithCodeButtonGroup
            containerElementClassName="language-bash"
            codeButtonGroupProps={{
              copyElementRef,
            }}
          >
            <Code
              className="language-bash"
              style={{
                textAlign: 'center',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
                borderRadius: '0.5rem',
              }}
            >
              npm install{' '}
              {version === '1.x'
                ? 'react-native-youtube-bridge@1.x'
                : 'react-native-youtube-bridge'}
            </Code>
          </PreWithCodeButtonGroup>
        </div>
      }
    />
  );
}

function NotFoundLayout() {
  useEffect(() => {
    const redirectPath = getGuideRedirectPath(window.location.pathname);

    if (redirectPath) {
      window.location.replace(`${redirectPath}${window.location.search}${window.location.hash}`);
    }
  }, []);

  return <BasicNotFoundLayout />;
}

export { HomeLayout, NotFoundLayout };
// oxlint-disable-next-line import/export
export * from '@rspress/core/theme-original';
