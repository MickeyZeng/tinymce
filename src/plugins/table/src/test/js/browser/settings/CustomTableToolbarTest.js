asynctest(
  'browser.tinymce.plugins.table.CustomTableToolbarTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.table.Plugin',
    'tinymce.themes.modern.Theme',
    'tinymce.plugins.table.test.TableTestUtils'
  ],
  function (Assertions, Chain, GeneralSteps, Logger, Pipeline, TinyApis, TinyLoader, TinyUi, TablePlugin, ModernTheme, TableTestUtils) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TablePlugin();

    var tableHtml = '<table><tbody><tr><td>x</td></tr></tbody></table>';

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        Logger.t('test custom count of toolbar buttons', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetContent(tableHtml),
          TableTestUtils.sOpenToolbarOn(editor, 'table td', [0]),
          Chain.asStep({}, [
            tinyUi.cWaitForUi('no context found', 'div[aria-label="Inline toolbar"]'),
            Chain.mapper(function (x) {
              return x.dom().querySelectorAll('button').length;
            }),
            Assertions.cAssertEq('has correct count', 2)
          ])
        ]))
      ], onSuccess, onFailure);
    }, {
      plugins: 'table',
      table_toolbar: 'tableprops tabledelete',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);