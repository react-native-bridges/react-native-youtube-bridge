import './index.css';

import { useVersion } from '@rspress/core/runtime';
import {
  HomeLayout as BasicHomeLayout,
  getCustomMDXComponent as basicGetCustomMDXComponent,
} from '@rspress/core/theme-original';
import { useRef } from 'react';

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
              pnpm add{' '}
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

export { HomeLayout };
// oxlint-disable-next-line import/export
export * from '@rspress/core/theme-original';
