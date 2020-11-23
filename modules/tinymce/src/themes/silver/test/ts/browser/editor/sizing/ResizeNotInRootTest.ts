import { Assertions, Chain, Pipeline } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { TinyApis, TinyLoader } from '@ephox/mcagar';
import { Insert, Remove, SelectorFind, SugarBody, SugarElement, Width } from '@ephox/sugar';
import Editor from 'tinymce/core/api/Editor';

import Theme from 'tinymce/themes/silver/Theme';

UnitTest.asynctest('Editor resize test', (success, failure) => {
  Theme();

  const toolbarContainer = SugarElement.fromHtml('<div id="toolbar" style="width: 50%;"></div>');
  Insert.append(SugarBody.body(), toolbarContainer);

  TinyLoader.setup((editor: Editor, onSuccess, onFailure) => {
    const tinyApis = TinyApis(editor);
    Pipeline.async({ }, [
      tinyApis.sSetContent('fixed_toolbar_container test'),
      tinyApis.sFocus(),
      Chain.asStep(SugarBody.body(), [
        Chain.op(() => {
          // Add a border to ensure we're using the correct height/width (ie border-box sizing)
          editor.dom.setStyles(editor.getContainer(), {
            border: '2px solid #ccc'
          });
        }),
        Chain.op(() => {
          const html = SugarBody.body();
          const sink = SelectorFind.descendant<HTMLElement>(html, '.tox-silver-sink');

          const expectedWidth = Math.floor(Width.get(html) / 2);
          Assertions.assertEq(`Sink should be ${expectedWidth}px wide`, expectedWidth, Width.get(sink.getOrDie()));
        })
      ])
    ], onSuccess, onFailure);
  },
  {
    theme: 'silver',
    base_url: '/project/tinymce/js/tinymce',
    resize: 'both',
    fixed_toolbar_container: '#toolbar',
    inline: true,
  }, () => {
    Remove.remove(toolbarContainer);
    success();
  }, failure);
});
