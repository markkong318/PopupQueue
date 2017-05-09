# PopupQueue
A manager for showing popup in order

If you have create some popup ui in your page, you may encounter multi-popup show up at the same time then the page is messed up. I create this tool for manage all the incoming popup and then control them show up one by one.

And then, I also add some grouping idea in the manager so you could manage parent-child popups avoid to writing lots of code for each case.

For hook this library to your system more easily, this library does not contain any popup ui. You just set some show/hide entry points to manager just tell it how to control your popups.

## Usage
Before you start, you should make a hidden link for open popup
```
<a href="javascript:void(0);" data-target="foo" id="popup_trigger-foo" style="visibility:hidden;"></a>
```
Your popup target is call foo, and you should add a onClick on this link to open your popup.

If you do not like this, you can modify the source code to fit your requirement.

When your popup close, you should tell the manager you has been closed
```
$(window).trigger('close_popup');
```
OK, when everything is ready, you could start to push the popup into the manager.
