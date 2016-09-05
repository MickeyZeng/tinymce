asynctest(
  'HotspotPositionTest',
 
  [
    'ephox.agar.api.Chain',
    'ephox.agar.api.NamedChain',
    'ephox.agar.api.Step',
    'ephox.alloy.api.GuiFactory',
    'ephox.alloy.test.GuiSetup',
    'ephox.perhaps.Result'
  ],
 
  function (Chain, NamedChain, Step, GuiFactory, GuiSetup, Result) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    GuiSetup.setup(function (store, doc, body) {
      var fixedSink = GuiFactory.build({
        uiType: 'custom',
        dom: {
          tag: 'div'
        },
        uid: 'fixed-sink',
        positioning: {
          useFixed: true
        }
      });

      var relativeSink = GuiFactory.build({
        uiType: 'custom',
        dom: {
          tag: 'div'
        },
        uid: 'relative-sink',
        positioning: {
          useFixed: true
        }
      });

      var popup = GuiFactory.build({
        uiType: 'custom',
        dom: {
          tag: 'div',
          innerHtml: 'Demo day',
          styles: {
            width: '200px',
            height: '150px',
            border: '1px solid black'
          }
        },
        uid: 'popup'
      });

      var hotspot = GuiFactory.build({
        uiType: 'button',
        text: 'Hotspot',
        action: function () { },
        dom: {
          styles: {
            position: 'absolute',
            left: '100px',
            top: '350px'
          }
        },
        uid: 'hotspot'
      });

      return GuiFactory.build({
        uiType: 'custom',
        dom: {
          tag: 'div'
        },
        components: [
          { built: fixedSink },
          { built: relativeSink },
          { built: popup },
          { built: hotspot }
        ]
      });

    }, function (doc, body, gui, component, store) {
      var cFindUid = function (uid) {
        return Chain.binder(function (context) {
          return context.getByUid(uid);
        });
      };

      return [
        Chain.asStep({}, [
          NamedChain.asChain([
            NamedChain.writeValue('context', gui),
            NamedChain.direct('context', cFindUid('fixed-sink'), 'fixed'),
            NamedChain.direct('context', cFindUid('hotspot'), 'hotspot'),
            NamedChain.direct('context', cFindUid('popup'), 'popup'),
            NamedChain.bundle(function (data) {
              data.fixed.apis().addContainer(data.popup);
              data.fixed.apis().position({
                anchor: 'hotspot',
                hotspot: data.hotspot
              }, data.popup);
              return Result.value({ });
              console.log('data', data);
            })
          ])
        ]),
        Step.debugging
      ];
    }, function () { success(); }, failure);
 

  }
);